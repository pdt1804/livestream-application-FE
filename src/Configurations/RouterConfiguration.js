import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  Login,
  Registration,
  Home,
  /* Livestream,
  ViewerLivestream,
  CreateLivestream,
  About, */
} from "../screens";


export default function RouterConfiguration() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/home" element={<Home />} />
        {/* <Route path="/home/livestream" element={<Livestream />} />
        <Route path="/home/viewer" element={<ViewerLivestream />} />
        <Route path="/home/createLivestream" element={<CreateLivestream />} />
        <Route path="/about" element={<About />} /> */}
      </Routes>
    </Router>
  );
}
