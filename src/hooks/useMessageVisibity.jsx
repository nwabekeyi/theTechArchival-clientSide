import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUnreadChatroomMessages } from '../reduxStore/slices/messageSlice';

const useThrottle = (callback, delay) => {
  const lastCallTime = useRef(0);

  return (...args) => {
    const now = Date.now();
    if (now - lastCallTime.current >= delay) {
      callback(...args);
      lastCallTime.current = now;
    }
  };
};

const useDebounce = (callback, delay) => {
  const timeout = useRef(null);

  return (...args) => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    timeout.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};

export const useMessageVisibility = (messageRefs, messages, chatroomName) => {
  const visibleMessagesRef = useRef([]);  // Storing visible messages in a ref (not causing re-renders)
  const userId = useSelector((state) => state.users.user.userId);
  const dispatch = useDispatch();
  const observer = useRef(null); // IntersectionObserver stored in a ref

  // Throttled dispatch function (e.g., every 500ms)
  const throttledDispatch = useThrottle((visibleMessages) => {
    dispatch(setUnreadChatroomMessages([...visibleMessages]));
  }, 2000);

  // Debounced function to handle visibility updates
  const debouncedUpdateVisibility = useDebounce((entries, messages, currentlyVisibleMessages, userId) => {
    let updatedVisibleMessages = [...visibleMessagesRef.current];

    entries.forEach((entry) => {
      const messageId = entry.target.firstElementChild.getAttribute('data-message-id');
      const message = messages.find((msg) => msg._id === messageId);

      if (entry.isIntersecting && message) {
        const isReadByUser = message.readBy.some((readUser) => readUser.userId === userId);
        if (!isReadByUser && !currentlyVisibleMessages.has(messageId)) {
          // Add message to the visible messages ref
          updatedVisibleMessages = [
            ...updatedVisibleMessages,
            {
              messageId: message._id,
              chatroomName,
              senderId: message.sender.id
            }
          ];
        }
      } else if (!entry.isIntersecting && messageId && currentlyVisibleMessages.has(messageId)) {
        // Remove messages that are no longer visible
        updatedVisibleMessages = updatedVisibleMessages.filter((msg) => msg.messageId !== messageId);
      }
    });

    // Update the ref value for visible messages
    visibleMessagesRef.current = updatedVisibleMessages;
    // Throttled dispatch of unread messages
    throttledDispatch(visibleMessagesRef.current);
  }, 1000); // Debounce time set to 300ms for visibility updates

  useEffect(() => {
    // Create an IntersectionObserver instance
    observer.current = new IntersectionObserver((entries) => {
      const currentlyVisibleMessages = new Set(visibleMessagesRef.current.map(msg => msg.messageId));

      // Use debounced function to handle the visibility updates
      debouncedUpdateVisibility(entries, messages, currentlyVisibleMessages, userId);
    }, {
      rootMargin: '0px',
      threshold: 0.1,
    });

    // Observe message elements
    Object.keys(messageRefs.current).forEach((messageId) => {
      const messageElement = messageRefs.current[messageId];
      if (messageElement) {
        observer.current.observe(messageElement);
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
      }
    };
  }, [messages, userId, chatroomName]); // `messageRefs` is excluded from the dependency array

  return visibleMessagesRef.current; // Returning the ref value
};
