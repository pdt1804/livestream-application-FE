import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../Login";
import Livestream from "../Livestream";
import ViewerLivestream from "../ViewerLivestream";
import Registration from "../Registration";
import Home from "../Home";
import CreateLivestream from "../CreateLivestream";
import About from "../About";

export default function RouterConfiguration() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home/livestream" element={<Livestream />} />
        <Route path="/home/viewer" element={<ViewerLivestream />} />
        <Route path="/home/createLivestream" element={<CreateLivestream />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}
