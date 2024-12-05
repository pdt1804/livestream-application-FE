import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../Login";
import Livestream from "../Livestream";
import ViewerLivestream from "../ViewerLivestream";

export default function RouterConfiguration() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/livestream" element={<Livestream />} />
        <Route path="/viewer" element={<ViewerLivestream />} />
      </Routes>
    </Router>
  );
}
