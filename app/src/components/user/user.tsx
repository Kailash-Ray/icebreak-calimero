import UserList from './usersList';
import CreateUserPopup from './createUserPopup';
import translations from '../../constants/en.global.json';
import Button from '../button/button';
import { User } from '../../types/types';

interface UserProps {
  users:User[],
  createUser: (name: string, bio: string, image: string) => void;
  openCreateUser: boolean;
  setOpenCreateUser: (open: boolean) => void;
}

export default function User({
  users,
  createUser,
  openCreateUser,
  setOpenCreateUser,
}: UserProps) {
  const t = translations.feedPage;
  return (
    <div className="flex justify-center pt-4">
      <div className="w-1/5" />
      <div className="w-3/5">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold text-white">Users</h2>

          <Button
            title={'Register User'}
            onClick={() => setOpenCreateUser(true)}
            backgroundColor="border-gray-400"
            backgroundColorHover="hover:border-white"
          />
        </div>
        {users.length === 0 ? (
          <div className="text-white text-lg border-t-2 border-[#1c2123] text-center mt-4 pt-4">
            Users
          </div>
        ) : (
          <div  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">

            {users.map((user, id) => (
              <UserList user={user} key={id} />
            ))}
          </div>
        )}
        <div className="w-1/5" />

        {openCreateUser && (
          <CreateUserPopup
            createUser={createUser}
            open={openCreateUser}
            setOpen={setOpenCreateUser}
          />
        )}
      </div>
      <div className="w-1/5" />
    </div>
  );
}
