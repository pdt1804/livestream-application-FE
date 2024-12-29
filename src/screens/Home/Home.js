import { useState } from "react"
import {Navbar, LivestreamList} from "../../Components";
import { useNavigate } from "react-router-dom"

import "./Home.css";

export default function Home (props) {
  return (
    <div className="home">
      <Navbar/>
      <div className="mainContent">
        <label className="labelLivestreamSession">Đang phát sóng trực tiếp:</label>
        <LivestreamList/>
      </div>
    </div>
  )
}