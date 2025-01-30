import { useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import useThrottleAndDebounce from './useThrothleAndDebounce'; // Use the combined hook
import useWebSocket from './useWebSocket'; // Import your WebSocket hook

const useMessageVisibility = (messageRefs, messages, chatroomName) => {
  const visibleMessagesRef = useRef([]); // Storing visible messages in a ref (not causing re-renders)
  const { userId, firstName, lastName, profilePictureUrl } = useSelector((state) => state.users.user);
  const observer = useRef(null); // IntersectionObserver stored in a ref
  const observedMessageIds = useRef(new Set()); // Track observed message IDs to avoid re-observing

  const { emit, isConnected } = useWebSocket(); // Destructure emit from useWebSocket

  // Throttled emit function using the custom hook (e.g., every 2000ms)
  const throttledEmit = useCallback(
    useThrottleAndDebounce((visibleMessages) => {
      if (isConnected) {
        visibleMessages.forEach((message) => {
          emit('chatroomMessage readBy', {
            chatroomName: message.chatroomName,
            messageId: message.messageId,
            recipientDetails: {
              userId,
              firstName,
              lastName,
              profilePictureUrl,
            }, // Assuming you have recipient details or build it here
            senderId: message.senderId,
          });
        });
      }
    }, 2000, 'throttle'),
    [isConnected, emit, userId, firstName, lastName, profilePictureUrl]
  );

  // Debounced function to handle visibility updates using the custom hook (debounced by 1000ms)
  const debouncedUpdateVisibility = useCallback(
    useThrottleAndDebounce((entries, messages, currentlyVisibleMessages, userId) => {
      let updatedVisibleMessages = [...visibleMessagesRef.current];

      entries.forEach((entry) => {
        const messageId = entry.target.firstElementChild.getAttribute('data-message-id');
        const message = messages.find((msg) => msg._id === messageId);

        if (entry.isIntersecting && message) {
          const isReadByUser = message.readBy.some((readUser) => readUser.userId === userId);
          if (!isReadByUser && !currentlyVisibleMessages.has(messageId) && isConnected) {
            // Add message to the visible messages ref
            updatedVisibleMessages = [
              ...updatedVisibleMessages,
              {
                messageId: message._id,
                chatroomName,
                senderId: message.sender.id,
              },
            ];
          }
        } else if (!entry.isIntersecting && messageId && currentlyVisibleMessages.has(messageId)) {
          // Remove messages that are no longer visible
          updatedVisibleMessages = updatedVisibleMessages.filter((msg) => msg.messageId !== messageId);
        }
      });

      // Update the ref value for visible messages
      visibleMessagesRef.current = updatedVisibleMessages;
      // Throttled emit of unread messages
      throttledEmit(visibleMessagesRef.current);
    }, 1000, 'debounce'),
    [messages, userId, chatroomName, isConnected, throttledEmit]
  );

  useEffect(() => {
    // Create an IntersectionObserver instance
    observer.current = new IntersectionObserver(
      (entries) => {
        const currentlyVisibleMessages = new Set(visibleMessagesRef.current.map((msg) => msg.messageId));
        // Use debounced function to handle the visibility updates
        debouncedUpdateVisibility(entries, messages, currentlyVisibleMessages, userId);
      },
      {
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    // Observe message elements that haven't been observed yet
    Object.keys(messageRefs.current).forEach((messageId) => {
      if (!observedMessageIds.current.has(messageId)) {
        const messageElement = messageRefs.current[messageId];
        if (messageElement) {
          observer.current.observe(messageElement);
          observedMessageIds.current.add(messageId);
        }
      }
    });

    // Cleanup observer
    return () => {
      if (observer.current) {
        Object.keys(messageRefs.current).forEach((messageId) => {
          const messageElement = messageRefs.current[messageId];
          if (messageElement) {
            observer.current.unobserve(messageElement);
          }
        });
        observer.current.disconnect();
      }
    };
  }, [messages, userId, chatroomName, isConnected, debouncedUpdateVisibility, messageRefs]);

  return visibleMessagesRef.current; // Returning the ref value
};

export default useMessageVisibility;