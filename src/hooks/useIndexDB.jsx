import { useState, useEffect } from 'react';
import { openDB } from 'idb'; // Make sure to install idb or use your IndexedDB handling package

// Custom hook to retrieve messages from IndexedDB
const useIndexedDB = (dbName, storeName, conversationName) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        // Open the IndexedDB database
        const db = await openDB(dbName, 1); // Use the dynamic dbName passed to the hook
        const store = db.transaction(storeName, 'readonly').objectStore(storeName);
        
        // Get the conversation by its name from the store
        const conversation = await store.get(conversationName);
        
        if (conversation) {
          // Assuming the first element is the chatroomName, exclude it from the messages array
          const conversationMessages = Object.values(conversation).slice(1); // Remove the first element
          setMessages(conversationMessages); // Set the remaining messages
          console.log(messages[0])
        } else {
          setMessages([]); // No messages found for the conversation
        }
      } catch (err) {
        console.error('Failed to retrieve messages from IndexedDB:', err);
        setError(err.message || 'Failed to retrieve messages');
      } finally {
        setLoading(false);
      }
    };

    if (conversationName) {
      fetchMessages(); // Fetch messages if conversationName is provided
    }
  }, [dbName, storeName, conversationName]); // Re-run when dbName, storeName, or conversationName changes

  return { messages, loading, error };
};

export default useIndexedDB;
