import { Outlet } from "react-router-dom";
import { ChatProfile, ChatSidebar, DarkBg, SearchUsersCard } from "../components";
import { useState } from "react";
const ChatLayout = () => {
  const [show,setShow ] = useState(false)
  return (
    <div className={`chats-app-flex`}>
      {show && <SearchUsersCard show={show} setShow={setShow} />}
      {show && <DarkBg />}
      <ChatSidebar setShow={setShow} />
      <Outlet />
      {/* <ChatProfile /> */}
    </div>
  );
};

export default ChatLayout;
