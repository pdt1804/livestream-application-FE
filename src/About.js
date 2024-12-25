import { useEffect, useState } from "react"
import LivestreamList from "./Components/LivestreamList.js"
import Navbar from "./Components/Navbar.js"
import { useNavigate } from "react-router-dom"
import IntroductionCard from "./Components/IntroductionCard.js"
import axios from "axios"
import { BASE_URL, checkError } from "./Resource.js"
import { Bounce, ToastContainer, toast } from 'react-toastify';

export default function About (props) {

  const [nickName, setNickName] = useState(localStorage.getItem("nickName"))
  const [password, setPassword] = useState(null)
  const [newPassword, setNewPassword] = useState(null)
  const [reEnterPassword, setReEnterPassword] = useState(null)
  const [totalLivestreamSessions, setTotalLivestreamSessions] = useState(null)
  const [totalLivestreamHours, setTotalLivestreamHours] = useState(null)
  const [availableDaysOfUser, setAvailableDaysOfUser] = useState(null)

  useEffect(() => {
    const getInformationAboutUser = async () => {
      const userName = localStorage.getItem("userName")
      const request = await axios.get(BASE_URL + "/api/v1/user/getInformationAboutUser?userName=" + userName)
      if (request.status === 200) {
        if (request.data !== null) {
          setTotalLivestreamHours(request.data.totalOfHourLivestreamSessions)
          setAvailableDaysOfUser(request.data.daysOfAvailableUser)
          setTotalLivestreamSessions(request.data.totalLivestreamSessions)
        } else {
          errorNotify("Error while getting date about user !")
        }
      }
    }

    getInformationAboutUser()
  }, [])

  const successfulNotify = (message) => {
    toast.success(message, {
      position: "top-center",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  }

  const errorNotify = (message) => {
    toast.error(message, {
      position: "top-center",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  }

  const updateNickName = async () => {
    const userName = localStorage.getItem("userName")
    const request = await axios.put(BASE_URL + "/api/v1/user/updateNickName?userName=" + userName + "&newNickName=" + nickName);
    if (request.status === 200) {
      const errorMessage = checkError(request.data) 
      if (errorMessage === null) {
        localStorage.setItem("nickName", nickName)
        successfulNotify("Update nickname successfully")
      } else {
        console.error(errorMessage)
      }
    }
  }

  const changePassword = async () => {
    if (reEnterPassword === newPassword) {
      const userName = localStorage.getItem("userName")
      const request = await axios.put(BASE_URL + "/api/v1/user/changePassword?userName=" + userName + "&currentPassword=" + password + "&newPassword=" + newPassword);
      if (request.status === 200) {
        const errorMessage = checkError(request.data) 
        if (errorMessage === null) {
          successfulNotify("Change password successfully")
          clearInput()
        } else {
          console.error(errorMessage)
          errorNotify(errorMessage)
          clearInput()
        }
      }
    } else {
      errorNotify("New Password and Re-enter Password are not correct !")
      clearInput()
    }
  }

  const clearInput = () => {
    setPassword("")
    setNewPassword("")  
    setReEnterPassword("")
  }

  return (
    <div className="about">
      <Navbar/>
      <div className="briefIntroduction">
        <IntroductionCard number={totalLivestreamSessions} content="Livestream Sessions"/>
        <IntroductionCard number={totalLivestreamHours} content="Livestream Hours"/>
        <IntroductionCard number={availableDaysOfUser} content="Active Days"/>
      </div>
      <div className="informationAboutUs">
        <div className="publicInformationArea">
          <label className="informationLabel">Public Information</label>
          <div className="publicInformation">
            <label className="labelAboutUs">NickName: </label>
            <input className="inputAboutUs" value={nickName} onChange={(e) => setNickName(e.target.value)}/>
            <button className="updatePublicInformation" onClick={() => updateNickName()}>Update</button>
          </div>
        </div>
        <div className="privateInformationArea">
          <label className="informationLabel">Private Information</label>
          <div className="rowInformation">
            <label className="labelAboutUs">Current Password: </label>
            <input className="inputAboutUs" value={password} onChange={(e) => setPassword(e.target.value)}/>
          </div>
          <div className="rowInformation">
            <label className="labelAboutUs">New Password: </label>
            <input className="inputAboutUs" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
          </div>
          <div className="rowInformation">
            <label className="labelAboutUs">Re-enter New Password: </label>
            <input className="inputAboutUs" value={reEnterPassword} onChange={(e) => setReEnterPassword(e.target.value)}/>
          </div>
          <button className="updatePrivateInformation" onClick={() => changePassword()}>Save</button>
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}/>    
    </div>
  )
}

