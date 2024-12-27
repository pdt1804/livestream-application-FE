import { useState } from "react";
import { InputLabelText } from "../../Components/CustomInput";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL, checkError } from "../../Resource";

import "./Auth.css";

export default function Login(props) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const authenticate = async () => {
    const request = await axios.get(
      BASE_URL +
        "/api/v1/user/authenticate?userName=" +
        userName +
        "&passWord=" +
        password
    );
    if (request.status === 200) {
      const getErrorMessage = checkError(request.data);
      if (getErrorMessage === null) {
        const splitData = request.data.split("-");
        localStorage.setItem("userName", splitData[0]);
        localStorage.setItem("nickName", splitData[1]);
        navigate("/home");
      } else {
        setErrorMessage(getErrorMessage);
      }
    }
  };

  return (
    <div className="loginBackground">
      <div className="loginForm">
        <div>
          <label className="loginForm-label">Đăng Nhập LiveStream</label>
        </div>
        <div>
          <InputLabelText
            title={"Tên người dùng"}
            type={"text"}
            value={userName}
            setValue={setUserName}
          />
          <InputLabelText
            title={"Mật khẩu"}
            type={"password"}
            value={password}
            setValue={setPassword}
          />
        </div>
        {/* <div>
          <a className="loginForm-a" onClick={() => navigate("/registration")}>
            click here to sign up account
          </a>
        </div> */}
        <div className="loginForm-errorMessage">
          <h2 className="loginForm-h2">{errorMessage}</h2>
        </div>
        <div className="loginForm-buttonArea">
          <button className="loginForm-button" onClick={() => authenticate()}>
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
