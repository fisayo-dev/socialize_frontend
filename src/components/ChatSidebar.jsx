import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  ArrowRightCircleIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  EllipsisHorizontalIcon,
  XMarkIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import NoFriends from "../assets/no_friends.svg";
import RequestFriends from "../assets/request_friends.svg";
import NoRequest from "../assets/no_requests.svg";
import { Button } from "../components";
import { FaCircleDot } from "react-icons/fa6";
import Swal from "sweetalert2";

const ChatSidebar = ({ setShow }) => {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const userId = user.userId;
  const [loggedUser, setLoggedUser] = useState();
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const res = await fetch(`/api/users/${userId}`);
      const data = await res.json();
      setLoggedUser(data);
    } catch (err) {
      console.log(err);
    }
  };
  // Actual
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [requestingRequests, setRequestingRequests] = useState([]);
  // Filtered
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [filteredSentRequests, setFilteredSentRequests] = useState([]);
  const [filteredRequestingRequests, setFilteredRequestingRequests] = useState(
    []
  );
  const [usersRender, setUsersRender] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [searchRequestValue, setSearchRequestValue] = useState("");
  const [searchRequestingRequestValue, setSearchRequestingRequestValue] =
    useState("");
  const [isSentRequestOpenId, setIsSentRequestOpenId] = useState();

  
  const fetchFriendRequests = async () => {
    try {
      const res = await fetch("/api/users/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
        }),
      });
      const data = await res.json();
      const friendRequests = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setRequests(friendRequests);

      setTimeout(fetchFriendRequests, 100);
    } catch (err) {
      console.error(err);
      setTimeout(fetchFriendRequests, 2000);
    }
  };
  const fetchRequestingFriendRequests = async () => {
    try {
      const res = await fetch("/api/users/requests/requesting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
        }),
      });
      const data = await res.json();
      const friendRequests = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setRequestingRequests(friendRequests);

      setTimeout(fetchRequestingFriendRequests, 100);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFriends = async () => {
    try {
      const res = await fetch("/api/users/friends", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personID: userId,
        }),
      });
      const data = await res.json();
      const friends = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setFriends(friends);

      setTimeout(fetchFriends, 100);
    } catch (err) {
      console.error(err);
      setTimeout(fetchFriends, 2000);
    }
  };

  const unsendRequest = async (requestingToFriendID) => {
    try {
      const res = await fetch("/api/users/requests/unsend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personID: requestingToFriendID,
          requestingPersonID: userId,
        }),
      });
      const data = await res.json();
      Swal.fire({
        text: data.message,
        toast: true,
        position: "top-end",
        timer: 2000,
        timerProgressBar: true,
        icon: "success",
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        text: "Unable to reach server",
        toast: true,
        position: "top-end",
        timer: 2000,
        timerProgressBar: true,
        icon: "success",
        showConfirmButton: false,
      });
    }
    setIsSentRequestOpenId();
  };

  const declineRequest = async (requestingFriendID) => {
    try {
      const res = await fetch("/api/users/request/decline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestingFriendID,
          personID: userId,
        }),
      });
      const data = await res.json();
      Swal.fire({
        text: data.message,
        toast: true,
        position: "top-end",
        timer: 2000,
        timerProgressBar: true,
        icon: "success",
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        text: "Unable to reach server",
        toast: true,
        position: "top-end",
        timer: 2000,
        timerProgressBar: true,
        icon: "error",
        showConfirmButton: false,
      });
    }
    setIsSentRequestOpenId();
  };
  const acceptRequest = async (requestingFriendID) => {
    try {
      const res = await fetch("/api/users/request/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestingFriendID,
          personID: userId,
        }),
      });
      const data = await res.json();
      Swal.fire({
        text: data.message,
        toast: true,
        position: "top-end",
        timer: 2000,
        timerProgressBar: true,
        icon: "success",
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        text: "Unable to reach server",
        toast: true,
        position: "top-end",
        timer: 2000,
        timerProgressBar: true,
        icon: "error",
        showConfirmButton: false,
      });
    }
    setIsSentRequestOpenId();
  };

  const toggleSentRequestsMenu = (id) => {
    if (!isSentRequestOpenId) {
      setIsSentRequestOpenId(id);
    } else {
      setIsSentRequestOpenId();
    }
  };

  // New useEffect to handle filtering of sent requests
  useEffect(() => {
    if (searchRequestValue.trim() === "") {
      setFilteredSentRequests(requests);
    } else {
      const filtered = requests.filter((request) =>
        request.first_name
          .toLowerCase()
          .includes(searchRequestValue.toLowerCase())
      );
      setFilteredSentRequests(filtered);
    }
  }, [requests, searchRequestValue]);

  useEffect(() => {
    if (searchValue.trim() === "") {
      setFilteredFriends(friends);
    } else {
      const filtered = friends.filter((friend) =>
        friend.first_name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredFriends(filtered);
    }
  }, [friends, searchValue]);

  // New useEffect to handle filtering of requesting requests
  useEffect(() => {
    if (searchRequestingRequestValue.trim() === "") {
      setFilteredRequestingRequests(requestingRequests);
    } else {
      const filtered = requestingRequests.filter((request) =>
        request.first_name
          .toLowerCase()
          .includes(searchRequestingRequestValue.toLowerCase())
      );
      setFilteredRequestingRequests(filtered);
    }
  }, [requestingRequests, searchRequestingRequestValue]);

  useEffect(() => {
    fetchUser();
    fetchFriends();
    fetchFriendRequests();
    fetchRequestingFriendRequests();
  }, []);

  return (
    <div className="app-dark-bg-color relative side-bar-grid overflow-x-hidden h-[100vh] ">
      <div className="px-5 py-5 grid gap-2">
        <div className="grid w-full">
          <div className="flex py-3 items-center">
            <Link to="/chats" className="w-full ">
              <h2 className="font-bold text-[1.1rem]">Socialize</h2>
              <p className="text-sm">{loggedUser && loggedUser.first_name}</p>
            </Link>
            <div className="flex items-center gap-2">
              <div onClick={() => setShow(true)} className="cursor-pointer">
                <PlusIcon className="w-6 h-6" />
              </div>
              <div
                onClick={() => {
                  logout();
                  navigate("/chats");
                }}
                className="cursor-pointer"
              >
                <ArrowRightCircleIcon className="h-6 w-6" />
              </div>
            </div>
          </div>
          {usersRender === 0 && (
            <div className="bg-slate-800 rounded-lg p-3 text-[0.87rem]">
              <div className="flex items-center gap-2">
                <MagnifyingGlassIcon className="w-6 h-6" />
                <input
                  type="text"
                  className="w-full"
                  placeholder="Search friends by name"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
            </div>
          )}
          {usersRender === 1 && (
            <div className="bg-slate-800 rounded-lg p-3 text-[0.87rem]">
              <div className="flex items-center gap-2">
                <MagnifyingGlassIcon className="w-6 h-6" />
                <input
                  type="text"
                  className="w-full"
                  placeholder="Search your sent requests"
                  value={searchRequestValue}
                  onChange={(e) => setSearchRequestValue(e.target.value)}
                />
              </div>
            </div>
          )}
          {usersRender === 2 && (
            <div className="bg-slate-800 rounded-lg p-3 text-[0.87rem]">
              <div className="flex items-center gap-2">
                <MagnifyingGlassIcon className="w-6 h-6" />
                <input
                  type="text"
                  className="w-full"
                  placeholder="Search your requesting requests"
                  value={searchRequestingRequestValue}
                  onChange={(e) =>
                    setSearchRequestingRequestValue(e.target.value)
                  }
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-start gap-5 items-center py-1">
          <h2
            className={`cursor-pointer ${
              usersRender === 0 && "border-b-2 border-slate-200 font-bold"
            } hover:font-bold`}
            onClick={() => setUsersRender(0)}
          >
            Friends
          </h2>
          <h2
            className={`cursor-pointer ${
              usersRender === 1 && "border-b-2 border-slate-200 font-bold"
            } hover:font-bold`}
            onClick={() => setUsersRender(1)}
          >
            Sent
          </h2>
          <h2
            className={`cursor-pointer ${
              usersRender === 2 && "border-b-2 border-slate-200 font-bold"
            } hover:font-bold`}
            onClick={() => setUsersRender(2)}
          >
            Requesting
          </h2>
        </div>
      </div>

      <div className="overflow-y-scroll ">
        {usersRender === 0 && friends.length === 0 ? (
          <div className="grid gap-5 text-center py-5 font-bold">
            <img
              src={NoFriends}
              className="w-4/5 mx-auto"
              alt="No Friends"
              draggable={false}
            />
            <p>You have no friends.</p>
            <div onClick={() => setShow(true)}>
              <Button>Create friends</Button>
            </div>
          </div>
        ) : (
          usersRender === 0 &&
          filteredFriends.length === 0 && (
            <div className="text-center py-5 font-bold">
              Couldn't find friend
            </div>
          )
        )}
        {usersRender === 1 && requests.length === 0 ? (
          <div className="grid gap-5 text-center py-5 font-bold">
            <img
              src={RequestFriends}
              className="w-2/6 mx-auto"
              alt="Request Friends"
              draggable={false}
            />
            <p>No friend request available</p>
            <div onClick={() => setShow(true)}>
              <Button>Send request</Button>
            </div>
          </div>
        ) : (
          usersRender === 1 &&
          filteredSentRequests.length === 0 && (
            <div className="grid gap-5 text-center py-5 font-bold">
              <img
                src={NoRequest}
                className="w-3/5 mx-auto"
                alt="No Request"
                draggable={false}
              />
              <p>Couldn't find request</p>
            </div>
          )
        )}
        {usersRender === 2 && requestingRequests.length === 0 ? (
          <div className="grid gap-5 text-center py-5 font-bold">
            <img
              src={RequestFriends}
              className="w-2/6 mx-auto"
              alt="Request Friends"
              draggable={false}
            />
            <p>No requests from anyone</p>
          </div>
        ) : (
          usersRender === 2 &&
          filteredRequestingRequests.length === 0 && (
            <div className="grid gap-5 text-center py-5 font-bold">
              <img
                src={NoRequest}
                className="w-3/5 mx-auto"
                alt="No Request"
                draggable={false}
              />
              <p>Couldn't find request</p>
            </div>
          )
        )}

        {usersRender === 0 &&
          filteredFriends.length !== 0 &&
          filteredFriends.map((friend) => (
            <Link key={friend.id} to={`chats/${friend._id}`}>
              <div
                className={`cursor-pointer  px-3 py-4 ${
                  id === friend.id ? "bg-slate-800" : "hover:bg-slate-900"
                } `}
              >
                <div className="flex gap-2 items-center">
                  <div>
                    <UserCircleIcon className="w-[3rem] h-[3rem]" />
                  </div>
                  <div className="grid w-full">
                  <h2 className="text-[1.2rem] font-bold">
                    {friend.first_name}
                  </h2>
                  <p className="text-[0.82rem]">{friend.email}</p>
                  </div>
                  <div
                  className="bg-slate-800 hover:bg-slate-600 w-7 h-7 rounded-full cursor-pointer"
                >
                  <EllipsisHorizontalIcon className="w-7 h-7" />
                </div>
                </div>
              </div>
            </Link>
          ))}
        {usersRender === 1 &&
          filteredSentRequests.length !== 0 &&
          filteredSentRequests.map((request) => (
            <div
              key={request._id}
              className="cursor-pointer grid gap-1 hover:bg-gray-900 px-3 py-4"
            >
              <div className="flex gap-2 items-center">
                <div>
                  <UserCircleIcon className="w-[3rem] h-[3rem]" />
                </div>
                <div className="grid w-full">
                  <h2 className="text-[1.2rem] font-bold">
                    {request.first_name}
                  </h2>
                  <p className="text-[0.82rem]">{request.email}</p>
                </div>
                <div
                  className="bg-slate-800 hover:bg-slate-600 w-7 h-7 rounded-full cursor-pointer"
                  onClick={toggleSentRequestsMenu.bind(this, request._id)}
                >
                  <EllipsisHorizontalIcon className="w-7 h-7" />
                </div>
                {isSentRequestOpenId == request._id && (
                  <div className="absolute right-0 mt-20 w-48 app-bg-color border border-slate-700 rounded-lg overflow-hidden shadow-lg z-10">
                    <ul className="">
                      <li
                        onClick={unsendRequest.bind(this, request._id)}
                        className="flex items-center gap-1 px-4 py-2 hover:bg-slate-800 cursor-pointer"
                      >
                        <XMarkIcon className="w-6 h-6" />
                        <p>Unsend</p>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        {usersRender === 2 &&
          filteredRequestingRequests.length !== 0 &&
          filteredRequestingRequests.map((request) => (
            <div
              key={request._id}
              className="cursor-pointer grid gap-1 hover:bg-gray-900 px-3 py-4"
            >
              <div className="flex gap-2 items-center">
                <div>
                  <UserCircleIcon className="w-[3rem] h-[3rem]" />
                </div>
                <div className="grid w-full">
                  <h2 className="text-[1.2rem] font-bold">
                    {request.first_name}
                  </h2>
                  <p className="text-[0.82rem]">{request.email}</p>
                </div>
                <div
                  className="bg-slate-800 hover:bg-slate-600 w-7 h-7 rounded-full cursor-pointer"
                  onClick={toggleSentRequestsMenu.bind(this, request._id)}
                >
                  <EllipsisHorizontalIcon className="w-7 h-7" />
                </div>
                {isSentRequestOpenId == request._id && (
                  <div className="absolute right-0 mt-[7.5rem] w-48 app-bg-color border border-slate-700 rounded-lg overflow-hidden shadow-lg z-10">
                    <ul className="">
                      <li onClick={acceptRequest.bind(this, request._id)} className="flex items-center gap-1 px-4 py-2 hover:bg-slate-800 cursor-pointer">
                        <CheckIcon className="w-6 h-6" />
                        <p>Accept</p>
                      </li>
                      <li
                        onClick={declineRequest.bind(this, request._id)}
                        className="flex items-center gap-1 px-4 py-2 hover:bg-slate-800 cursor-pointer"
                      >
                        <XMarkIcon className="w-6 h-6" />
                        <p>Decline</p>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
