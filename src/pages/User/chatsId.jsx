import {  useParams } from "react-router-dom";
import { FaUser, FaExclamation, FaImage } from "react-icons/fa6";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import {UserCircleIcon, PhotoIcon, PaperAirplaneIcon} from '@heroicons/react/24/outline'

// const testing_id = 66f35df2be7529d05112a81a

const ChatsId = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const userId = user.userId;
  const [currentChattingUser, setCurrentChattingUser] = useState();

  const fetchUser = async () => {
    try {
      const res = await fetch(`/api/users/${id}`);
      const data = await res.json();
      setCurrentChattingUser(data);
    } catch (err) {
      console.log(err)
    }
  };

  useEffect(() => {
    fetchUser()
  }, [id,userId]);

  return (
    <>
      <div className="chats-msg-grid h-[100vh]">
        <div className="bg-transparent border-b border-slate-500 px-8 py-3">
          <div className="flex justify-between items-center">
            <div className="flex gap-1 items-center">
              <div className="text-2xl ">
                <UserCircleIcon className="h-10 w-10"/>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{currentChattingUser && currentChattingUser.first_name}</h2>
              </div>
                <p className="text-sm">{currentChattingUser && currentChattingUser.email}</p>
            </div>
            <div className="flex gap-2 items-center">
              <FaExclamation />
            </div>
          </div>
        </div>
        <div className="bg-transparent  overflow-x-hidden overflow-y-scroll py-2 px-4">
          <div className="hidden text-center py-20 gap-2">
            <h2 className="text-2xl">No chats to show</h2>
            <p className="text-sm">Start a conversation</p>
          </div>
          <div className="p-4 ">
            <div className="grid gap-3">
              <div className="left">
               <p> Hi - {id}</p>
              </div>
              <div className="right">
                <p>Hello - {id}</p>
              </div>
              <div className="left">
                <p>Wow, It's been a while.</p>
              </div>
              <div className="left">
                <p>I would really love to see you.</p>
              </div>
              <div className="right">
                <div className="flex flex-col gap-3">
                  <img draggable={false} src="/vite.svg" alt="" />
                  <p>Of course you can come to my house. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Blanditiis, eligendi!</p>
                  <div className="gap-1 place-items-center flex rounded-full  cursor-pointer hover:font-extrabold">
                    <div>. . .</div>
                  </div>
                </div>
              </div>
              <div className="right">
                <p>Ok</p>
              </div>
              <div className="left">
                <p>Lol</p>
              </div>
              <div className="right">
                <p>Of course you can come to my house.</p>
              </div>
              <div className="left">
                <p>Can you give us so more info.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-transparent px-8 py-4">
          <div className="flex text-[0.98rem] items-center chat-input-field  rounded-lg py-3 text-slate-400 bg-slate-800">
            <div className="px-4 hover:text-slate-200  cursor-pointer">
              <PhotoIcon className="w-7 h-7"/>
            </div>
            <div className="w-full">
              <input
                type="text"
                placeholder="Type a message."
                className="text-slate-200 w-full"
              />
            </div>
            <div className="px-4 hover:text-slate-200 cursor-pointer">
              <PaperAirplaneIcon className="w-7 h-7"/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatsId;
