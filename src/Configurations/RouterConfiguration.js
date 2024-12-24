import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../Login";
import Livestream from "../Livestream";
import ViewerLivestream from "../ViewerLivestream";
import Registration from "../Registration";
import Home from "../Home";

export default function RouterConfiguration() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/livestream" element={<Livestream />} />
        <Route path="/viewer" element={<ViewerLivestream />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}
