import Navbar from "./Components/Navbar.js"

export default function Home (props) {
  return (
    <div className="home">
      <Navbar/>
      <div className="mainContent">
        <div className="optionBar">
          <input className="inputLivestream"/>
          <button className="createLivestreamButton" onClick={() => {}}>Start Livestream</button>
        </div>
        <label className="labelLivestreamSession">Livestream Session</label>
      </div>
    </div>
  )
}
