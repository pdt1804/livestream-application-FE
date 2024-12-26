import { useState } from "react"
import LivestreamList from "../../Components/LivestreamList.js"
import Navbar from "../../Components/Navbar.js"
import { useNavigate } from "react-router-dom"

export default function Home (props) {

  const [userName, setUserName] = useState(localStorage.getItem("userName"))
  const navigate = useNavigate()

  return (
    <div className="home">
      <Navbar/>
      <div className="mainContent">
        <div className="optionBar">
          <input className="inputLivestream"/>
          <button className="createLivestreamButton" onClick={() => navigate("createLivestream")}>Start Livestream</button>
        </div>
        <label className="labelLivestreamSession">Livestream Session</label>
        <LivestreamList/>
      </div>
    </div>
  )
}