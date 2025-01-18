import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

export const useMessageVisibility = (messageRefs, messages, chatroomName) => {
  const [visibleMessages, setVisibleMessages] = useState([]);
  const userId = useSelector((state) => state.users.user.userId);

  const observer = useRef(null);

  useEffect(() => {
    // Create an IntersectionObserver
    observer.current = new IntersectionObserver(
      (entries) => {
        const visibleMessagesArray = [];

        entries.forEach((entry) => {
          const messageId = entry.target.firstElementChild.getAttribute('data-message-id');
          const message = messages.find((msg) => msg._id === messageId);

          if (entry.isIntersecting && message && !message.readBy.includes(userId)) {
            visibleMessagesArray.push({
              messageId: message._id,
              chatroomName,
              userId,
            });
          }
        });

        setVisibleMessages(visibleMessagesArray);
      },
      {
        rootMargin: '0px',
        threshold: 0.1, // Trigger when 50% of the message is visible
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
  }, [messages, messageRefs, userId]);

  return visibleMessages;
};
