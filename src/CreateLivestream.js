import { useNavigate } from "react-router-dom";
import ImageList from "./Components/ImageList";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import axios from "axios";
import { BASE_URL, checkError } from "./Resource";
import { useState } from "react";

export default function CreateLivestream() {
  const [title, setTitle] = useState(null)
  const [description, setDescription] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const navigate = useNavigate()

  const createLivestreamSession = async () => {
    const userName = localStorage.getItem("userName")
    const session = {
      title: title,
      description: description,
      backgroundImage: selectedImage,
    }

    const request = await axios.post(BASE_URL + "/api/v1/livestream/createSession?userName=" + userName, session)
    if (request.status === 200) {
      const errorMessage = checkError(request.data)
      if (errorMessage === null) {
        localStorage.setItem("id", request.data)
        localStorage.setItem("title", title)
        navigate("/home/livestream")
      } else {
        console.error(errorMessage)
      }
    }
  }

  return (
    <div className="createLivestream">
      <div className="formCreateLivestream">
        <div className="positionTitleLivestream">
          <FaArrowAltCircleLeft color="aliceblue" className="backIcon" onClick={() => navigate("/home")}/>
          <label className="titleLivestream">CREATING LIVESTREAM</label>
        </div> 
        <div className="inputLivestreamInformation">
          <label className="labelLivestream">Title</label>
          <input className="inputLivestream" type="text" placeholder="Enter title for livestream session" value={title} onChange={(e) => setTitle(e.target.value)}/>
        </div>
        <div className="inputLivestreamInformation">
          <label className="labelLivestream">Background Livestream</label>
          <ImageList selectedImage={selectedImage} setSelectedImage={setSelectedImage}/>
        </div>
        <div className="positionButtonCreateLivestream">
          <button className="buttonCreateLivestream" onClick={() => createLivestreamSession()}>Create</button>
        </div>
        <br/>
        <br/>
        <br/>
      </div>
    </div>
  )
}