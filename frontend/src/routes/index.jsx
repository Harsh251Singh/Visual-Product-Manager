import React from "react";
import { Routes, Route } from "react-router-dom";
import Auth from "../components/Auth";
import Interface from "../components/Interface";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Auth />} />        
      </Routes>
      <Routes>
        <Route path="/chats" element={<Interface />} />
      </Routes>
    </>
  )
}

export default AppRoutes;