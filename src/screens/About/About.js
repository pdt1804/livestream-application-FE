import { useEffect, useState } from "react";
import {
  Navbar,
  IntroductionCard,
  SingleLabelText,
  DisableButton,
} from "../../Components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL, checkError } from "../../Resource.js";
import { Bounce, ToastContainer, toast } from "react-toastify";

import "./About.css";

export default function About(props) {
  const currentNickName = localStorage.getItem("nickName");
  const [nickName, setNickName] = useState(localStorage.getItem("nickName"));
  const [password, setPassword] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [reEnterPassword, setReEnterPassword] = useState(null);
  const [totalLivestreamSessions, setTotalLivestreamSessions] = useState(null);
  const [totalLivestreamHours, setTotalLivestreamHours] = useState(null);
  const [availableDaysOfUser, setAvailableDaysOfUser] = useState(null);
  const [isAbleToUpdate, setIsAbleToUpdate] = useState(false);
  const [isAbleToSave, setIsAbleToSave] = useState(false);

  useEffect(() => {
    !nickName && nickName != currentNickName ? setIsAbleToUpdate(false) : setIsAbleToUpdate(true);
  }, [nickName]);

  useEffect(() => {
    !password || !newPassword || !reEnterPassword ? setIsAbleToSave(false) : setIsAbleToSave(true);
  }, [password, newPassword, reEnterPassword]);

  useEffect(() => {
    const getInformationAboutUser = async () => {
      const userName = localStorage.getItem("userName");
      const request = await axios.get(
        BASE_URL + "/api/v1/user/getInformationAboutUser?userName=" + userName
      );
      if (request.status === 200) {
        if (request.data !== null) {
          setTotalLivestreamHours(request.data.totalOfHourLivestreamSessions);
          setAvailableDaysOfUser(request.data.daysOfAvailableUser);
          setTotalLivestreamSessions(request.data.totalLivestreamSessions);
        } else {
          errorNotify("Error while getting date about user !");
        }
      }
    };

    getInformationAboutUser();
  }, []);

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
  };

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
  };

  const updateNickName = async () => {
    const userName = localStorage.getItem("userName");
    const request = await axios.put(
      BASE_URL +
        "/api/v1/user/updateNickName?userName=" +
        userName +
        "&newNickName=" +
        nickName
    );
    if (request.status === 200) {
      const errorMessage = checkError(request.data);
      if (errorMessage === null) {
        localStorage.setItem("nickName", nickName);
        successfulNotify("Update nickname successfully");
      } else {
        console.error(errorMessage);
      }
    }
  };

  const changePassword = async () => {
    if (reEnterPassword === newPassword) {
      const userName = localStorage.getItem("userName");
      const request = await axios.put(
        BASE_URL +
          "/api/v1/user/changePassword?userName=" +
          userName +
          "&currentPassword=" +
          password +
          "&newPassword=" +
          newPassword
      );
      if (request.status === 200) {
        const errorMessage = checkError(request.data);
        if (errorMessage === null) {
          successfulNotify("Change password successfully");
          clearInput();
        } else {
          console.error(errorMessage);
          errorNotify(errorMessage);
          clearInput();
        }
      }
    } else {
      errorNotify("New Password and Re-enter Password are not correct !");
      clearInput();
    }
  };

  const clearInput = () => {
    setPassword("");
    setNewPassword("");
    setReEnterPassword("");
  };

  return (
    <div className="about">
      <Navbar />
      <div className="briefIntroduction">
        <IntroductionCard
          number={totalLivestreamSessions}
          content="Livestream Sessions"
        />
        <IntroductionCard
          number={totalLivestreamHours}
          content="Livestream Hours"
        />
        <IntroductionCard number={availableDaysOfUser} content="Active Days" />
      </div>
      <div className="informationAboutUs">
        <div className="publicInformationArea">
          <label className="informationLabel">Public Information</label>
          <SingleLabelText
            title={"Biệt danh"}
            type={"text"}
            value={nickName}
            setValue={setNickName}
          />
          <DisableButton
            label={"Cập nhật biệt danh"}
            customCondition={isAbleToUpdate}
            onClick={() => updateNickName()}
          />
        </div>
        <div className="privateInformationArea">
          <label className="informationLabel">Private Information</label>
          <div className="rowInformation">
            <SingleLabelText
              title={"Mật khẩu hiện tại"}
              type={"text"}
              value={password}
              setValue={setPassword}
            />
            <SingleLabelText
              title={"Mật khẩu mới"}
              type={"text"}
              value={newPassword}
              setValue={setNewPassword}
            />
            <SingleLabelText
              title={"Xác nhận mật khẩu mới"}
              type={"text"}
              value={reEnterPassword}
              setValue={setReEnterPassword}
            />
          </div>
          <DisableButton
            label={"Lưu mật khẩu mới"}
            customCondition={isAbleToSave}
            onClick={() => changePassword()}
          />
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
        transition={Bounce}
      />
    </div>
  );
}
