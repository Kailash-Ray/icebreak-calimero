import {
  ClientApi,
  ClientMethod,
  CreateCommentRequest,
  CreatePostRequest,
  FeedRequest,
  PostRequest,
  CreateUserRequest,
  AddUserToConversationRequest,
  CreateConversationRequest,
  GetConversationsForUserRequest,
  UsersRequest
} from '../clientApi';
import { ApiResponse } from '../response';
import { Comment, Conversation, JsonWebToken, Post, User } from '../../types/types';
import {
  JsonRpcClient,
  RequestConfig,
  RpcError,
  handleRpcError,
} from '@calimero-is-near/calimero-p2p-sdk';
import { AxiosHeader, createJwtHeader } from '../../crypto/crypto';
import { getAppEndpointKey, getJWTObject } from '../../utils/storage';
import { getNodeUrl } from '../../utils/node';

export function getJsonRpcClient() {
  return new JsonRpcClient(
    getAppEndpointKey()?.toString(),
    process.env['NEXT_PUBLIC_RPC_PATH'],
  );
}

function getConfigAndJwt() {
  const jwtObject: JsonWebToken = getJWTObject();
  const headers: AxiosHeader = createJwtHeader();
  if (!jwtObject) {
    return {
      error: { message: 'Failed to get JWT token', code: 500 },
    };
  }
  if (jwtObject.executor_public_key === null) {
    return {
      error: { message: 'Failed to get executor public key', code: 500 },
    };
  }

  const config: RequestConfig = {
    headers: headers,
  };

  return { jwtObject, config };
}

export class ClientApiDataSource implements ClientApi {
  createConversation(params: CreateConversationRequest): ApiResponse<Conversation> {
    throw new Error('Method not implemented.');
  }
  addUserToConversation(params: AddUserToConversationRequest): ApiResponse<boolean> {
    throw new Error('Method not implemented.');
  }
  getConversationsForUser(params: GetConversationsForUserRequest): ApiResponse<Conversation[]> {
    throw new Error('Method not implemented.');
  }
  async getUsers(params: UsersRequest): ApiResponse<User[]> {
      const { jwtObject, config, error } = getConfigAndJwt();
      console.log("config==> fetchPost ===>>> ",config);
      if (error) {
        return { error };
      }
  
      const response = await getJsonRpcClient().query<UsersRequest, User[]>(
        {
          contextId: jwtObject.context_id,
          method: ClientMethod.users,
          argsJson: params,
          executorPublicKey: jwtObject.executor_public_key,
        },
        config,
      );
      const rpcError: RpcError | null = response?.error ?? null;
      if (rpcError && rpcError.code) {
        const response = await handleRpcError(rpcError, getNodeUrl);
        if (response.code === 403) {
          return await this.getUsers(params);
        }
        return {
          error: await handleRpcError(rpcError, getNodeUrl),
        };
      }
  
      return {
        data: response?.result?.output,
        error: null,
      };
    
  }
  async fetchFeed(params: FeedRequest): ApiResponse<Post[]> {
    const { jwtObject, config, error } = getConfigAndJwt();

    console.log(" this is the fetchFeed  --->>>>" , error)
    if (error) {
      return { error };
    }

    const response = await getJsonRpcClient().query<FeedRequest, Post[]>(
      {
        contextId: jwtObject.context_id,
        method: ClientMethod.POSTS,
        argsJson: params,
        executorPublicKey: jwtObject.executor_public_key,
      },
      config,
    );
    const rpcError: RpcError | null = response?.error ?? null;
    if (rpcError && rpcError.code) {
      const response = await handleRpcError(rpcError, getNodeUrl);
      if (response.code === 403) {
        return await this.fetchFeed(params);
      }
      return {
        error: await handleRpcError(rpcError, getNodeUrl),
      };
    }

    return {
      data: response.result?.output ?? [],
      error: null,
    };
  }

  async fetchPost(params: PostRequest): ApiResponse<Post> {
    const { jwtObject, config, error } = getConfigAndJwt();
    console.log("config==> fetchPost ===>>> ",config);
    if (error) {
      return { error };
    }

    const response = await getJsonRpcClient().query<PostRequest, Post>(
      {
        contextId: jwtObject.context_id,
        method: ClientMethod.POST,
        argsJson: params,
        executorPublicKey: jwtObject.executor_public_key,
      },
      config,
    );
    const rpcError: RpcError | null = response?.error ?? null;
    if (rpcError && rpcError.code) {
      const response = await handleRpcError(rpcError, getNodeUrl);
      if (response.code === 403) {
        return await this.fetchPost(params);
      }
      return {
        error: await handleRpcError(rpcError, getNodeUrl),
      };
    }

    return {
      data: response?.result?.output,
      error: null,
    };
  }

  async createPost(params: CreatePostRequest): ApiResponse<Post> {
    const { jwtObject, config, error } = getConfigAndJwt();
    if (error) {
      return { error };
    }

    const response = await getJsonRpcClient().mutate<CreatePostRequest, Post>(
      {
        contextId: jwtObject.context_id,
        method: ClientMethod.CREATE_POST,
        argsJson: params,
        executorPublicKey: jwtObject.executor_public_key,
      },
      config,
    );
    const rpcError: RpcError | null = response?.error ?? null;
    if (rpcError && rpcError.code) {
      const response = await handleRpcError(rpcError, getNodeUrl);
      if (response.code === 403) {
        return await this.createPost(params);
      }
      return {
        error: await handleRpcError(rpcError, getNodeUrl),
      };
    }

    return {
      data: response?.result?.output,
      error: null,
    };
  }

  async createComment(params: CreateCommentRequest): ApiResponse<Comment> {
    const { jwtObject, config, error } = getConfigAndJwt();
    if (error) {
      return { error };
    }

    const response = await getJsonRpcClient().mutate<
      CreateCommentRequest,
      Comment
    >(
      {
        contextId: jwtObject.context_id,
        method: ClientMethod.CREATE_COMMENT,
        argsJson: params,
        executorPublicKey: jwtObject.executor_public_key,
      },
      config,
    );
    const rpcError: RpcError | null = response?.error ?? null;
    if (rpcError && rpcError.code) {
      const response = await handleRpcError(rpcError, getNodeUrl);
      if (response.code === 403) {
        return await this.createComment(params);
      }
      return {
        error: await handleRpcError(rpcError, getNodeUrl),
      };
    }

    return {
      data: response?.result?.output,
      error: null,
    };
  }



  async createUser(params: CreateUserRequest): ApiResponse<User> {
    const { jwtObject, config, error } = getConfigAndJwt();
    if (error) {
      return { error };
    }

    const response = await getJsonRpcClient().mutate<CreateUserRequest, User>(
      {
        contextId: jwtObject.context_id,
        method: ClientMethod.CREATE_USER,
        argsJson: params,
        executorPublicKey: jwtObject.executor_public_key,
      },
      config,
    );
    const rpcError: RpcError | null = response?.error ?? null;
    if (rpcError && rpcError.code) {
      const response = await handleRpcError(rpcError, getNodeUrl);
      if (response.code === 403) {
        return await this.createUser(params);
      }
      return {
        error: await handleRpcError(rpcError, getNodeUrl),
      };
    }

    return {
      data: response?.result?.output,
      error: null,
    };
  }
}
