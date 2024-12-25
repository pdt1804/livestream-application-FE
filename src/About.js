import { useState } from "react";
import Navbar from "./Components/Navbar.js";
import axios from "axios";
import { BASE_URL, checkError } from "./Resource.js";
import { Bounce, ToastContainer, toast } from "react-toastify";

export default function About(props) {
  const [name, setName] = useState(localStorage.getItem("nickName"));
  const [pw, setPW] = useState(null);
  const [newPW, setNewPW] = useState(null);
  const [reEnterPW, setReEnterPW] = useState(null);

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
        name
    );
    if (request.status === 200) {
      const errorMessage = checkError(request.data);
      if (errorMessage === null) {
        localStorage.setItem("nickName", name);
        successfulNotify("Done");
      } else {
        console.error(errorMessage);
      }
    }
  };

  const changePassword = async () => {
    if (reEnterPW === newPW) {
      const userName = localStorage.getItem("userName");
      const request = await axios.put(
        BASE_URL +
          "/api/v1/user/changePassword?userName=" +
          userName +
          "&currentPassword=" +
          pw +
          "&newPassword=" +
          newPW
      );
      if (request.status === 200) {
        const errorMessage = checkError(request.data);
        if (errorMessage === null) {
          successfulNotify("Done");
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
    setPW("");
    setNewPW("");
    setReEnterPW("");
  };

  return (
    <div className="about">
      <Navbar />
      <div className="informationAboutUs">
        <div className="publicInformationArea">
          <label className="informationLabel">Public Information</label>
          <div className="publicInformation">
            <label className="labelAboutUs">NickName: </label>
            <input
              className="inputAboutUs"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button
              className="updatePublicInformation"
              onClick={() => updateNickName()}
            >
              Update
            </button>
          </div>
        </div>
        <div className="privateInformationArea">
          <label className="informationLabel">Private Information</label>
          <div className="rowInformation">
            <label className="labelAboutUs">Current Password: </label>
            <input
              className="inputAboutUs"
              value={pw}
              onChange={(e) => setPW(e.target.value)}
            />
          </div>
          <div className="rowInformation">
            <label className="labelAboutUs">New Password: </label>
            <input
              className="inputAboutUs"
              value={newPW}
              onChange={(e) => setNewPW(e.target.value)}
            />
          </div>
          <div className="rowInformation">
            <label className="labelAboutUs">Re-enter New Password: </label>
            <input
              className="inputAboutUs"
              value={reEnterPW}
              onChange={(e) => setReEnterPW(e.target.value)}
            />
          </div>
          <button
            className="updatePrivateInformation"
            onClick={() => changePassword()}
          >
            Save
          </button>
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
