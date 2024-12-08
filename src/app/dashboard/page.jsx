"use client";
import React from "react";

import NavBar from "../components/NavBar";
import Home from "../components/Home";
import Notifications from "../components/Notifications";
import Chats from "../components/Chats";
import Menu from "../components/Menu";
import PusherProvider from "../Provider/PusherProvider";
import { useSelector } from "react-redux";

const page = () => {
 const {activeSection } = useSelector(state=>state.ui)
  return (
    <PusherProvider>
      {activeSection === "home" && <Home />}
      {activeSection === "chats" && <Chats />}
      {activeSection === "notifications" && <Notifications />}
      {activeSection === "menu" && <Menu />}
      <NavBar
       
      />
    </PusherProvider>
  );
};

export default page;
