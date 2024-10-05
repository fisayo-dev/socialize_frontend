import {
  XMarkIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  PlusCircleIcon,
  UsersIcon,
  UserIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import Button from "./Button";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SearchUsersCard = ({ setShow }) => {
  const { id } = useParams();
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [friendCreateLoading, setFriendCreateLoading] = useState();
  const [currentUser, setCurrentUser] = useState(null);

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      const data = await res.json(res);
      setUsers(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }

    // Long polling with a delay of 5 seconds
    setTimeout(fetchAllUsers, 20);
  };

  const fetchCurrentUser = async () => {
    const res = await fetch(`/api/users/${user.userId}`);
    const data = await res.json();
    setCurrentUser(data);
  };

  const sendRequest = async (friendId) => {
    try {
      setFriendCreateLoading(friendId);
      await fetch("/api/users/friends/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.userId,
          friendId,
        }),
      });
      setFriendCreateLoading(null);
    } catch (err) {
      console.error(err);
      setFriendCreateLoading(null);
    }
    // const data = await res.json()
    // console.log(data)
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchAllUsers();
  }, []);
  return (
    <div className="z-50 grid gap-4 p-5 text-slate-400 bg-slate-900 rounded-xl middle-card">
      <div
        className="grid justify-end cursor-pointer "
        onClick={setShow.bind(this, false)}
      >
        <XMarkIcon className="hover:text-slate-200  w-7 h-7" />
      </div>
      <div className="flex items-center border-slate-700 p-3 border-2 rounded-lg gap-2">
        <MagnifyingGlassIcon className="w-6 h-6" />
        <input
          type="text"
          className="w-full"
          placeholder="Search for user by email"
        />
      </div>
      <div className=" grid gap-3 h-[50vh] overflow-scroll">
        {loading && users.length === 0 && (
          <div className="grid place-items-center">
            <div className="grid items-center gap-5 justify-center text-center ">
              <ArrowPathIcon className="h-12 w-12 mx-auto text-slate-200 animate-spin" />
              <p className="text-sm">Fetching Users</p>
            </div>
          </div>
        )}
        {users.length !== 0 &&
          users.map((thisUser) => (
            <div
              key={thisUser._id}
              className="shadow-md hover:bg-slate-800 cursor-pointer rounded-lg border-2 border-slate-700 p-3"
            >
              <div className="flex gap-3 items-center">
                <UserCircleIcon className="w-12 h-12" />
                <div className="grid w-full">
                  <h2 className="text-2xl">{thisUser.first_name}</h2>
                  <p className="text-sm">{thisUser.email}</p>
                </div>
                {thisUser.requests.includes(user.userId) && (
                  <Button styles="flex items-center gap-2 bg-transparent text-white hover:bg-transparent hover:text-white border-white border-2">
                    <CheckCircleIcon className="h-6 w-6 " />
                    <p>Sent</p>
                  </Button>
                )}
                {thisUser._id === user.userId && (
                  <Button styles="flex items-center  gap-2 bg-transparent text-white hover:bg-transparent hover:text-slate-200 border-slate-200 border-2">
                    <UserIcon className="h-6 w-6 " />
                    <p>You</p>
                  </Button>
                )}
                {currentUser && currentUser.requests.includes(thisUser._id) && (
                  <Button styles="flex items-center gap-2 bg-transparent text-white hover:bg-transparent hover:text-slate-200 border-slate-200 border-2">
                    <UsersIcon className="h-6 w-6 " />
                    <p>Requesting...</p>
                  </Button>
                )}
                {thisUser.friends.includes(user.userId) && (
                  <Button styles="flex items-center gap-2 bg-transparent text-white hover:bg-transparent hover:text-slate-200 border-slate-200 border-2">
                    <UserGroupIcon className="h-6 w-6 " />
                    <p>Friend</p>
                  </Button>
                )}
                {thisUser._id !== user.userId &&
                  !thisUser.requests.includes(user.userId) &&
                  !thisUser.friends.includes(user.userId) &&
                  currentUser &&
                  !currentUser.requests.includes(thisUser._id) && (
                    <Button
                      styles="flex items-cnter gap-2 "
                      onClick={sendRequest.bind(this, thisUser._id)}
                    >
                      {friendCreateLoading === thisUser._id ? (
                        <p>Adding...</p> // Show loading text for the specific user being added
                      ) : (
                        <>
                          <PlusCircleIcon className="h-6 w-6 " />
                          <p>Add</p>
                        </>
                      )}
                    </Button>
                  )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SearchUsersCard;
