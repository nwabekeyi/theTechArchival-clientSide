import { io } from "socket.io-client";

// Base URL for the API
const baseURL = "http://localhost:3001/api";

// Mock current user (replacing useAuth)
const mockCurrentUser = {
  uid: "mockUserId123", // Mock user ID
  displayName: "Mock User", // Mock display name
  email: "mockuser@example.com", // Mock email
};

// Helper function to get the user token
const getUserToken = async () => {
  const token = mockCurrentUser ? "mockToken" : null; // Use mock token for the mock user
  return token;
};

// Function to initiate the socket connection
export const initiateSocketConnection = async () => {
  const token = await getUserToken();

  const socket = io("http://localhost:3001", {
    auth: {
      token,
    },
  });

  return socket;
};

// Helper function to create headers with authorization token
const createHeader = async () => {
  const token = await getUserToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// GET all users
export const getAllUsers = async () => {
  const headers = await createHeader();

  try {
    const response = await fetch(`${baseURL}/user`, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (e) {
    console.error(e);
  }
};

// GET a specific user
export const getUser = async (userId) => {
  const headers = await createHeader();

  try {
    const response = await fetch(`${baseURL}/user/${userId}`, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (e) {
    console.error(e);
  }
};

// GET multiple users
export const getUsers = async (users) => {
  const headers = await createHeader();

  try {
    const response = await fetch(`${baseURL}/user/users`, {
      method: "GET",
      headers: headers,
      body: JSON.stringify(users),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (e) {
    console.error(e);
  }
};

// GET chat rooms of a specific user
export const getChatRooms = async (userId) => {
  const headers = await createHeader();

  try {
    const response = await fetch(`${baseURL}/room/${userId}`, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (e) {
    console.error(e);
  }
};

// GET a chat room between two users
export const getChatRoomOfUsers = async (firstUserId, secondUserId) => {
  const headers = await createHeader();

  try {
    const response = await fetch(
      `${baseURL}/room/${firstUserId}/${secondUserId}`,
      {
        method: "GET",
        headers: headers,
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (e) {
    console.error(e);
  }
};

// POST request to create a chat room
export const createChatRoom = async (members) => {
  const headers = await createHeader();

  try {
    const response = await fetch(`${baseURL}/room`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(members),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (e) {
    console.error(e);
  }
};

// GET messages of a specific chat room
export const getMessagesOfChatRoom = async (chatRoomId) => {
  const headers = await createHeader();

  try {
    const response = await fetch(`${baseURL}/message/${chatRoomId}`, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (e) {
    console.error(e);
  }
};

// POST request to send a message
export const sendMessage = async (messageBody) => {
  const headers = await createHeader();

  try {
    const response = await fetch(`${baseURL}/message`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(messageBody),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (e) {
    console.error(e);
  }
};
