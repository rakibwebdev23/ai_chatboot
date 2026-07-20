const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface postData {
  userID: string;
  threadID: string;
  message: string;
  leadFormData?: {
    first_name: string;
    last_name: string;
    contuct_number: string;
    email_address: string;
    service_address: string;
    messege: string;
  };
}

export const createMessage = async (data: postData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("API Error (createMessage):", error);
    throw error;
  }
};

export const getMessages = async (thread_id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat-history/${thread_id}`);
    return await response.json();
  } catch (error) {
    console.error("API Error (getMessages):", error);
    return { messages: [] };
  }
};

export const deleteChatHistory = async (thread_id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat-thread/${thread_id}`, {
      method: "DELETE",
    });
    return await response.json();
  } catch (error) {
    console.error("API Error (deleteChatHistory):", error);
    throw error;
  }
};
