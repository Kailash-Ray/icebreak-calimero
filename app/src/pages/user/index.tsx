import { useCallback, useEffect, useState } from 'react';
import { Post, User } from '../../types/types';

import ErrorPopup from '../../components/error/errorPopup';
import Feed from '../../components/feed/feed';

import UserCreateComponents from '../../components/user/user';
import Header from '../../components/header/header';
import Loader from '../../components/loader/loader';
import { CreatePostRequest,CreateUserRequest, FeedRequest , UsersRequest } from '../../api/clientApi';
import { ClientApiDataSource } from '../../api/dataSource/ClientApiDataSource';

export default function UserPage() {
 
  const [openCreateUser, setOpenCreateUser] = useState(false);

 
  const [users, setUsers] = useState<User[]>([]);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);




  const fetchUsers = useCallback(async (request: UsersRequest) => {
    try {
      const response = await new ClientApiDataSource().getUsers(request);
      console.log(response);
      if (response.error) {
        setError(response.error.message);
        setLoading(false);
      }
       setUsers(response?.data?.slice().reverse());
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const signGetPostRequest = async () => {
      const feedRequest: FeedRequest = {};
      const usersRequest: UsersRequest = {};

      fetchUsers({usersRequest});
    };
    signGetPostRequest();
  }, [fetchUsers]);




  const createUser = async (name: string, bio: string,image: string) => {
    setError('');
    setLoading(true);


    const createUserRequest: CreateUserRequest = {
      name,
      profile:image,
      bio
    };

    const result = await new ClientApiDataSource().createUser(
      createUserRequest,
    );
    console.log(result);
    if (result.error) {
      setError(result.error.message);
      setLoading(false);
      setOpenCreateUser(false);
      return;
    }

    setOpenCreateUser(false);
    setLoading(false);
    //TODO solve pagination
    const userRequest: UsersRequest = {};
    fetchUsers({ userRequest });
  };

  return (
    <>
      <Header />
      {loading && <Loader />}
      {error && <ErrorPopup error={error} />}

      {/* {!loading && users && (
        <Feed
          posts={users}
          createPost={createPost}
          openCreatePost={openCreatePost}
          setOpenCreatePost={setOpenCreatePost}
        />
      )} */}

      {!loading && users && (
        <UserCreateComponents
          users={users}
          createUser={createUser}
          openCreateUser={openCreateUser}
          setOpenCreateUser={setOpenCreateUser}
        />
      )}
    </>
  );
}
