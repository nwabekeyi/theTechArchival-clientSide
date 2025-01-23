import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUnreadChatroomMessages } from '../reduxStore/slices/messageSlice';

export const useMessageVisibility = (messageRefs, messages, chatroomName) => {
  const [visibleMessages, setVisibleMessages] = useState([]);
  const userId = useSelector((state) => state.users.user.userId);
  const dispatch = useDispatch();

  const observer = useRef(null);

  useEffect(() => {
    // Create an IntersectionObserver
    observer.current = new IntersectionObserver(
      (entries) => {
        const currentlyVisibleMessages = new Set(visibleMessages.map(msg => msg.messageId));

        entries.forEach((entry) => {
          const messageId = entry.target.firstElementChild.getAttribute('data-message-id');
          const message = messages.find((msg) => msg._id === messageId);

          if (entry.isIntersecting && message) {
            // Check if the userId is not in the readBy array
            const isReadByUser = message.readBy.some((readUser) => readUser.userId === userId);
            console.log(isReadByUser)
            if (!isReadByUser && !currentlyVisibleMessages.has(messageId)) {
              // Add message to the list only if it's not already there
              setVisibleMessages((prevMessages) => [
                ...prevMessages,
                {
                  messageId: message._id,
                  chatroomName,
                  senderId: message.sender.id
                }
              ]);
            }
          } else if (!entry.isIntersecting && messageId && currentlyVisibleMessages.has(messageId)) {
            // Remove messages that are no longer visible
            setVisibleMessages((prevMessages) =>
              prevMessages.filter((msg) => msg.messageId !== messageId)
            );
          }
        });
      },
      {
        rootMargin: '0px',
        threshold: 0.1, // Trigger when 10% of the message is visible
      }
    );

    // Observe each message element using IntersectionObserver
    Object.keys(messageRefs.current).forEach((messageId) => {
      const messageElement = messageRefs.current[messageId];
      if (messageElement) {
        observer.current.observe(messageElement);
      }
    });

    // Cleanup observer when component is unmounted
    return () => {
      if (observer.current) {
        Object.keys(messageRefs.current).forEach((messageId) => {
          const messageElement = messageRefs.current[messageId];
          if (messageElement) {
            observer.current.unobserve(messageElement);
          }
        });
      }
    };
  }, [messages, messageRefs, userId, visibleMessages]);

  // Dispatch the updated unread messages whenever visibleMessages changes
  useEffect(() => {
    if (visibleMessages.length > 0) {
      dispatch(setUnreadChatroomMessages(visibleMessages));
    }
  }, [visibleMessages, dispatch]);

  return visibleMessages;
};
