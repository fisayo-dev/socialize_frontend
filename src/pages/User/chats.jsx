import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";

const Chats = () => {
  const { user } = useAuth();
  const userId = user.userId;
  const [loggedUser, setLoggedUser] = useState();
  
  const fetchUser = async () => {
    try {
      const res = await fetch(`/api/users/${userId}`);
      const data = await res.json();
      setLoggedUser(data);
    } catch (err) {
      console.log(err)
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  
  return (
    <div className="grid place-items-center h-[100vh]">
      <div className="grid gap-1 text-center">
        <div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            Socialize
          </h2>
        </div>
        <p className="text-md text-slate-400">
          Choose a friend to start chatting, <b>{loggedUser && loggedUser.first_name}</b>
        </p>
      </div>
    </div>
  );
};

export default Chats;
