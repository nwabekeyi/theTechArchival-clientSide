import React, { useRef, useState, useEffect } from 'react';
import {endpoints} from '../../utils/constants'


const VideoCall = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const wsRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [clientId, setClientId] = useState(null);
  const [offerReceived, setOfferReceived] = useState(null);
  const [loading, setLoading] = useState(false);


  const servers = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  };

console.log(endpoints.WEBSOCKET_ENDPOINT)

  // Setup WebSocket connection
  useEffect(() => {
    const setupWebSocket = () => {
      wsRef.current = new WebSocket("wss://babatech-e-learning.onrender.com");

      wsRef.current.onmessage = handleSignalingMessage;

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        const uniqueClientId = `client-${Date.now()}`;
        setClientId(uniqueClientId);
        wsRef.current.send(JSON.stringify({ type: 'register', id: uniqueClientId, action: 'connectVideoClient' }));
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket connection closed');
        closeConnections();
      };
    };

    setupWebSocket();

    return () => {
      closeConnections();
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Request access to media devices
  const requestUserMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 }, // You can adjust video resolution
        audio: true
      });
      return stream;
    } catch (error) {
      console.error("Error accessing media devices:", error);
      alert("Unable to access camera or microphone. Please check your permissions.");
      throw error;
    }
  };

  // Handle signaling messages
  const handleSignalingMessage = async (event) => {
    const msg = JSON.parse(event.data);
    switch (msg.type) {
      case 'create-offer':
        console.log('Offer received from', msg.senderId);
        setOfferReceived(msg);
        break;
      case 'accept-offer':
        console.log('Answer received:', msg.answer);
        await handleAnswer(msg.answer);
        break;
      case 'ice-candidate':
        console.log('ICE candidate received:', msg.candidate);
        await handleNewICECandidate(msg.candidate);
        break;
      default:
        console.log('Unknown message type:', msg.type);
    }
  };

  // Handle offer from another client
  const handleOffer = async (offer) => {
    try {
      const stream = await requestUserMedia();
      if (!stream) {
        console.error("Media stream not available");
        return;
      }

      localVideoRef.current.srcObject = stream;
      setLocalStream(stream);

      const peerConnection = new RTCPeerConnection(servers);
      peerConnectionRef.current = peerConnection;

      stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));

      peerConnection.ontrack = (event) => {
        console.log('Remote stream set');
        remoteVideoRef.current.srcObject = event.streams[0];
      };

      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      console.log('Sending answer:', answer);
      wsRef.current.send(JSON.stringify({ type: 'accept-offer', answer, senderId: clientId }));

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('Sending ICE candidate:', event.candidate);
          wsRef.current.send(
            JSON.stringify({ type: 'ice-candidate', candidate: event.candidate, senderId: clientId })
          );
        }
      };
    } catch (error) {
      console.error("Error handling offer:", error);
    }
  };

  // Handle received answer
  const handleAnswer = async (answer) => {
    const peerConnection = peerConnectionRef.current;
    if (!peerConnection) return;

    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    console.log('Remote description set after receiving answer.');
  };

  // Handle ICE candidates
  const handleNewICECandidate = async (candidate) => {
    const peerConnection = peerConnectionRef.current;
    if (peerConnection) {
      try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        console.log('ICE candidate added:', candidate);
      } catch (error) {
        console.error("Error adding received ICE candidate", error);
      }
    }
  };

  // Create offer
  const createOffer = async () => {
    const peerConnection = new RTCPeerConnection(servers);
    peerConnectionRef.current = peerConnection;

    try {
      const stream = await requestUserMedia();
      if (!stream) {
        console.error("Media stream not available");
        return;
      }

      localVideoRef.current.srcObject = stream;
      setLocalStream(stream);

      stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      console.log('Sending offer:', offer);
      wsRef.current.send(JSON.stringify({ type: 'create-offer', offer, senderId: clientId }));

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('Sending ICE candidate:', event.candidate);
          wsRef.current.send(
            JSON.stringify({ type: 'ice-candidate', candidate: event.candidate, senderId: clientId })
          );
        }
      };

      peerConnection.ontrack = (event) => {
        remoteVideoRef.current.srcObject = event.streams[0];
      };
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  };

  // Close peer connection and stop media streams
  const closeConnections = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }

    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
  };

  // Accept the offer and start the connection
  const acceptOffer = async () => {
    if (offerReceived) {
      setLoading(true);
      console.log('Accepting offer from:', offerReceived.senderId);
      await handleOffer(offerReceived.offer);
      setOfferReceived(null);
      setLoading(false);
    }
  };

  return (
    <div>
      <video ref={localVideoRef} autoPlay muted style={{ width: '300px' }} />
      <video ref={remoteVideoRef} autoPlay style={{ width: '300px' }} />
      <div>
        <button onClick={createOffer}>Create Offer</button>
        <button onClick={closeConnections}>End Call</button>
      </div>
      {offerReceived && (
        <div>
          <p>Offer from {offerReceived.senderId}:</p>
          <button onClick={acceptOffer} disabled={loading}>
            {loading ? 'Accepting...' : 'Accept Offer'}
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoCall;
