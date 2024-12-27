import { useState } from "react"
//import LivestreamList from "../../Components/LivestreamList.js" */
import Navbar from "../../Components/Navbar/Navbar";
import { useNavigate } from "react-router-dom"

import "./Home.css";

export default function Home (props) {
  return (
    <div className="home">
      <Navbar/>
      <div className="mainContent">
        <label className="labelLivestreamSession">Đang phát sóng trực tiếp:</label>
        {/* <LivestreamList/> */}
      </div>
    </div>
  )
}