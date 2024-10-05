import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { UserCircleIcon, UserMinusIcon, ShieldExclamationIcon } from "@heroicons/react/24/outline";

const ChatProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const userId = user.userId;
  const [loggedUser, setLoggedUser] = useState();

  const fetchUser = async () => {
    try {
      const res = await fetch(`${id ? `/api/users/${id}`: `/api/users/${userId}`}`);
      const data = await res.json();
      setLoggedUser(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <div className="app-dark-bg-color h-[100vh]">
      <div className="grid gap-10 py-10 justify-center">
        <div className="grid text-center gap-1">
          <UserCircleIcon className="w-24 h-24 mx-auto" />
          <h2 className="text-3xl font-bold">
            {loggedUser && loggedUser.first_name}
          </h2>
          <h2 className="text-sm">{loggedUser && loggedUser.email}</h2>
        </div>
        <div className="grid grid-cols-2 items-center gap-2">
          <div className="grid p-4 rounded-lg cursor-pointer hover:bg-slate-800 gap-2 place-items-center">
           <ShieldExclamationIcon className="w-7 h-7"/>
            <p className="text-sm">Block</p>
          </div>
          <div className="grid p-4 rounded-lg cursor-pointer hover:bg-slate-800 gap-2 place-items-center">
            <UserMinusIcon className="w-7 h-7"/>
            <p className="text-sm">Unfriend</p>
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm">Joined: 03/04/2024</p>
        </div>
      </div>
    </div>
  );
};

export default ChatProfile;
