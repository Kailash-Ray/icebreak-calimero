export interface Comment {
  text: string;
  user: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  comments: Comment[];
}

export interface JsonWebToken {
  context_id: string;
  token_type: string;
  exp: number;
  sub: string;
  executor_public_key: string;
}



export interface User {
  id: string;
  name: string;
  profile: string;
  bio: string;
}

export interface Conversation {
  id: number; // Unique identifier for the conversation
  title: string; // Title of the conversation
  content: string; // Content or description of the conversation
  messages: Message[]; // Array of messages in the conversation
  users: number[]; // Array of user IDs participating in the conversation
}

export interface Message {
  id: number; // Unique identifier for the message
  text: string; // The content of the message
  user: string; // Username of the message sender
  link_drop_key: string; // Any associated link drop key (if applicable)
}