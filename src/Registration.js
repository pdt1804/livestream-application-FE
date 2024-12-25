import { useState } from "react";
import InputLogin from "./Components/InputLogin";
import "./index.css"
import { MdAccountCircle } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { FaCakeCandles } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL, checkError } from "./Resource";


export default function Registration (props) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [nickName, setNickName] = useState("");
  const [yearOfBorn, setYearOfBorn] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const registerAccount = async () => {
    const user = {
      userName: userName,
      passWord: password,
      nickName: nickName,
      yearOfBorn: yearOfBorn,
    }

    const request = await axios.post(BASE_URL + "/api/v1/user/createAccount", user)
    console.log(request.data)

    if (request.status == 200) {
      const getErrorMessage = checkError(request.data);
      if (getErrorMessage === null) {
        navigate("/login")
      } else {
        setErrorMessage(getErrorMessage);
      }
    } else {
      setErrorMessage("Error orcurred, please check your network !")
    }
  }

  const userNameIcon = <MdAccountCircle size={40} color="#9ec9ec" style={{marginRight: "10px"}}/>
  const passwordIcon = <RiLockPasswordFill size={40} color="#9ec9ec" style={{marginRight: "10px"}}/>
  const nickNameIcon = <MdOutlineDriveFileRenameOutline size={40} color="#9ec9ec" style={{marginRight: "10px"}}/>
  const yearBornIcon = <FaCakeCandles size={40} color="#9ec9ec" style={{marginRight: "10px"}}/>

  return (
    <div className="RegistrationBackground">
      <div className="RegistrationForm">
        <div>
          <label className="RegistrationForm-label">Sign Up</label>
        </div>
        <div>
          <InputLogin title="Username" icon={userNameIcon} value={userName} setValue={setUserName} type="text"/>
          <InputLogin title="Password" icon={passwordIcon} value={password} setValue={setPassword} type="password"/>
          <InputLogin title="Nick name" icon={nickNameIcon} value={nickName} setValue={setNickName} type="text"/>
          <InputLogin title="Year of Birth" icon={yearBornIcon} value={yearOfBorn} setValue={setYearOfBorn} type="number"/>
        </div>
        <div>
          <a className="RegistrationForm-a" onClick={() => navigate("/login")}>Back to sign in</a>
        </div>
        <div className="RegistrationForm-errorMessage">
          <h2 className="RegistrationForm-h2">{errorMessage}</h2>
        </div>
        <div className="RegistrationForm-buttonArea">
          <button className="RegistrationForm-button" onClick={() => registerAccount()}>Sign Up</button>
        </div>
      </div>
    </div>
  )
}