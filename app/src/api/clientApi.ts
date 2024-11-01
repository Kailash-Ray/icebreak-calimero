import { Comment, Post, User, Conversation } from '../types/types';
import { ApiResponse } from './response';




export interface UsersRequest {
  // Consider defining this if needed
}
export interface FeedRequest {
  // Consider defining this if needed
}

export interface PostRequest {
  id: number; // Ensure this is a valid non-negative integer
}

export interface CreatePostRequest {
  title: string;
  content: string;
}

export interface CreateCommentRequest {
  post_id: number; // Ensure this is valid
  text: string;
  user: string;
}

export interface CreateUserRequest {
  name: string;
  profile: string;
  bio?: string; // Optional field if bio can be omitted
}

export interface CreateConversationRequest {
  title: string;
  content: string;
  user_id: number; // ID of the user creating the conversation
}

export interface AddUserToConversationRequest {
  conversation_id: number; // ID of the conversation to which to add the user
  user_id: number; // ID of the user to add
}

export interface GetConversationsForUserRequest {
  user_id: number; // ID of the user whose conversations to fetch
}

export enum ClientMethod {
  CREATE_COMMENT = 'create_comment',
  POST = 'post',
  users= 'users',
  CREATE_POST = 'create_post',
  POSTS = 'posts',
  CREATE_USER = 'create_user',
  GET_USER = 'get_user',
  CREATE_CONVERSATION = 'create_conversation',
  ADD_USER_TO_CONVERSATION = 'add_user_to_conversation',
  GET_CONVERSATIONS_FOR_USER = 'get_conversations_for_user',
}

export interface ClientApi {
  fetchFeed(params: FeedRequest): ApiResponse<Post[]>;
  fetchPost(params: PostRequest): ApiResponse<Post>;
  createPost(params: CreatePostRequest): ApiResponse<Post>;
  createUser(params: CreateUserRequest): ApiResponse<User>;
  createComment(params: CreateCommentRequest): ApiResponse<Comment>;
  createConversation(params: CreateConversationRequest): ApiResponse<Conversation>;
  addUserToConversation(params: AddUserToConversationRequest): ApiResponse<boolean>; // Assuming success returns a boolean
  getConversationsForUser(params: GetConversationsForUserRequest): ApiResponse<Conversation[]>; // Return array of conversations
  // Additional methods to implement based on your Rust code
  getUsers(params: UsersRequest): ApiResponse<User[]>; // To handle GET_USER request
}