import { useState, useEffect } from "react";
import {
  SingleLabelText,
  SingleLabelComboBox,
  DisableButton,
  TransparentButton,
} from "../../Components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL, checkError } from "../../Resource";

import "./Auth.css";

export default function Registration(props) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [nickName, setNickName] = useState("");
  const [yearOfBorn, setYearOfBorn] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isAbleToSignUp, setIsAbleToSignUp] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    !userName || !password || !nickName || !yearOfBorn
      ? setIsAbleToSignUp(false)
      : setIsAbleToSignUp(true);
  }, [userName, password, nickName, yearOfBorn]);

  //Lấy list năm
  const currentYear = new Date().getFullYear();
  const validYears = [];
  for (let year = currentYear; year >= currentYear - 150; year--) {
    validYears.push(year);
  }

  const registerAccount = async () => {
    const user = {
      userName: userName,
      passWord: password,
      nickName: nickName,
      yearOfBorn: yearOfBorn,
    };

    const request = await axios.post(
      BASE_URL + "/api/v1/user/createAccount",
      user
    );
    console.log(request.data);

    if (request.status == 200) {
      const getErrorMessage = checkError(request.data);
      if (getErrorMessage === null) {
        navigate("/login");
      } else {
        setErrorMessage(getErrorMessage);
      }
    } else {
      setErrorMessage("Error orcurred, please check your network !");
    }
  };

  return (
    <div className="authBackground">
      <div className="authForm">
        <label className="authForm-label">
          Tham gia LiveStream ngay hôm nay
        </label>
        <div>
          <SingleLabelText
            title={"Tên người dùng"}
            type={"text"}
            value={userName}
            setValue={setUserName}
          />
          <SingleLabelText
            title={"Password"}
            type={"password"}
            value={password}
            setValue={setPassword}
          />
          <SingleLabelText
            title={"Biệt danh"}
            type={"text"}
            value={nickName}
            setValue={setNickName}
          />
          <SingleLabelComboBox
            title={"Năm sinh"}
            placeholder={"Chọn năm sinh"}
            listOptions={validYears}
            value={yearOfBorn}
            setValue={setYearOfBorn}
          />
        </div>
        <label className="authForm-errorMessage">{errorMessage}</label>
        <DisableButton
          label={"Đăng ký"}
          customCondition={isAbleToSignUp}
          onClick={() => registerAccount()}
        />
        <TransparentButton
          label={"Bạn đã có tài khoản? Đăng nhập"}
          onClick={() => navigate("/login")}
        />
      </div>
    </div>
  );
}
