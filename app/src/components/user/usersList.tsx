import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import { User } from '../../types/types';

export interface UserProps {
  user: User;
}

export default function UsersList({ user }: UserProps) {
  const router = useRouter();
  return (
    <div
      key={user.id}
      className="rounded-lg hover:bg-[rgba(144,155,158,0.09)] flex flex-col cursor-pointer p-4 transition-all duration-200 ease-in-out shadow-lg"
      // onClick={() => router.push(`/post/${user.id}`)}
    >
      <img
        className="rounded-full w-24 h-24 mx-auto mb-2"
        src={user.profile}
        alt={`${user.name}'s profile`}
      />
      <h4 className="text-white text-lg text-center font-semibold">
        {user.name}
      </h4>
      {/* Truncated bio with full bio on hover */}
      <div className="relative">
        <p className="text-white text-sm text-center font-light mb-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-full hover:whitespace-normal hover:overflow-visible">
          {user.bio}
        </p>
        <p className="absolute left-0 right-0 text-white text-sm text-center font-light mb-2 hidden hover:block">
          {user.bio}
        </p>
      </div>

      {/* Uncomment and customize the below section if comments functionality is needed */}
      {/* <div className="flex items-center gap-1 bg-[#142f37] rounded-2xl w-fit px-4 mt-2 mx-auto">
      <ChatBubbleLeftIcon className="h-7 w-5 text-white" />
      <span className="text-white text-md font-light">
        {post.comments.length}
      </span>
    </div> */}
    </div>
  );
}
