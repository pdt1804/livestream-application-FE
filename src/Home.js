import LivestreamList from "./Components/LivestreamList.js"

export default function Home (props) {
  return (
    <div className="home">
      <div className="mainContent">
        <div className="optionBar">
          <input className="inputLivestream"/>
          <button className="createLivestreamButton" onClick={() => {}}>Start Livestream</button>
        </div>
        <label className="labelLivestreamSession">Livestream Session</label>
        <LivestreamList/>
      </div>
    </div>
  )
}
