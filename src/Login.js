import { useState } from "react";
import InputLogin from "./Components/InputLogin";
import "./index.css"
import { MdAccountCircle } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";


export default function Login (props) {

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const authenticate = () => {

  }

  const userNameIcon = <MdAccountCircle size={40} color="rgb(255, 197, 211)" style={{marginRight: "10px"}}/>
  const passwordIcon = <RiLockPasswordFill size={40} color="rgb(255, 197, 211)" style={{marginRight: "10px"}}/>

  return (
    <div className="loginBackground">
      <div className="loginForm">
        <div>
          <label className="loginForm-label">Sign In</label>
        </div>
        <div>
          <InputLogin title="Username (*)" icon={userNameIcon} value={userName} setValue={setUserName} type="text"/>
          <InputLogin title="Password (*)" icon={passwordIcon} value={password} setValue={setPassword} type="password"/>
        </div>
        <div>
          <a className="loginForm-a">click here to sign up account</a>
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