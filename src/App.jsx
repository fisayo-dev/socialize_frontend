import {
  Route,
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { Landing, Login, Signup } from "./pages/App";
import { ChatLayout } from "./layouts";
import { PageNotFound } from "./pages";
import { Chats, ChatsId } from "./pages/User";
import PrivateRoutes from "./utils/PrivateRoutes";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Landing />} />
        <Route path="*" element={<PageNotFound />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="" element={<PrivateRoutes />}>
          <Route path="" element={<ChatLayout />}>
            <Route path="/chats" element={<Chats />} />
            <Route path="/chats/:id" element={<ChatsId />} />
          </Route>
        </Route>
      </>
    )
  );
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
