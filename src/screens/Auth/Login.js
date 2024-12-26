import { useState } from "react";
//import InputLogin from "../../Components/InputLogin";
import { MdAccountCircle } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL, checkError } from "../../Resource";

import "./Auth.css"

export default function Login (props) {

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const authenticate = async () => {
    const request = await axios.get(BASE_URL + "/api/v1/user/authenticate?userName=" + userName + "&passWord=" + password)
    if (request.status === 200) {
      const getErrorMessage = checkError(request.data);
      if (getErrorMessage === null) {
        const splitData = request.data.split("-")
        localStorage.setItem("userName", splitData[0])
        localStorage.setItem("nickName", splitData[1])
        navigate("/home")
      } else {
        setErrorMessage(getErrorMessage)
      }
    } 
  }

  const userNameIcon = <MdAccountCircle size={40} color="#9ec9ec" style={{marginRight: "10px"}}/>
  const passwordIcon = <RiLockPasswordFill size={40} color="#9ec9ec" style={{marginRight: "10px"}}/>

  return (
    <div className="loginBackground">
      <div className="loginForm">
        <div>
          <label className="loginForm-label">Sign In</label>
        </div>
        <div>
          {/* <InputLogin title="Username" icon={userNameIcon} value={userName} setValue={setUserName} type="text"/>
          <InputLogin title="Password" icon={passwordIcon} value={password} setValue={setPassword} type="password"/>*/}
        </div>
        <div>
          <a className="loginForm-a" onClick={() => navigate("/registration")}>click here to sign up account</a>
        </div>
        <div className="loginForm-errorMessage">
          <h2 className="loginForm-h2">{errorMessage}</h2>
        </div>
        <div className="loginForm-buttonArea">
          <button className="loginForm-button" onClick={() => authenticate()}>Sign In</button>
        </div>
      </div>
    </div>
  )
}