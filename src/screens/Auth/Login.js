import { useState, useEffect } from "react";
import {
  SingleLabelText,
  DisableButton,
  TransparentButton,
} from "../../Components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL, checkError } from "../../Resource";

import "./Auth.css";

export default function Login(props) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isAbleToLogin, setIsAbleToLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    !userName || !password ? setIsAbleToLogin(false) : setIsAbleToLogin(true);
  }, [userName, password]);

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
        setIsAbleToLogin(false)
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
          <SingleLabelText
            title={"Tên người dùng"}
            type={"text"}
            value={userName}
            setValue={setUserName}
          />
          <SingleLabelText
            title={"Mật khẩu"}
            type={"password"}
            value={password}
            setValue={setPassword}
          />
        </div>
        <label className="loginForm-errorMessage">{errorMessage}</label>
        <DisableButton
          label={"Đăng nhập"}
          customCondition={isAbleToLogin}
          onClick={() => authenticate()}
        />
        <TransparentButton
          label={"Bạn không có tài khoản? Đăng ký"}
          onClick={() => navigate("/registration")}
        />
      </div>
    </div>
  );
}
