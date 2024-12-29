import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ImageList,
  SingleLabelText,
  DisableButton,
  TransparentButton,
} from "../../Components";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import axios from "axios";
import { BASE_URL, checkError } from "../../Resource";

import "./CreateLivestream.css";

export default function CreateLivestream() {
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAbleToContinue, setIsAbleToContinue] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    !title || !selectedImage
      ? setIsAbleToContinue(false)
      : setIsAbleToContinue(true);
  }, [title, selectedImage]);

  const createLivestreamSession = async () => {
    const userName = localStorage.getItem("userName");
    const session = {
      title: title,
      description: description,
      backgroundImage: selectedImage,
    };

    const request = await axios.post(
      BASE_URL + "/api/v1/livestream/createSession?userName=" + userName,
      session
    );
    if (request.status === 200) {
      const errorMessage = checkError(request.data);
      if (errorMessage === null) {
        localStorage.setItem("id", request.data);
        localStorage.setItem("title", title);
        navigate("/home/livestream");
      } else {
        console.error(errorMessage);
      }
    }
  };

  return (
    <div className="background">
      <div className="form">
        <label className="mainLabel">Tạo mới phát trực tiếp</label>
        <div>
          <SingleLabelText
            title={"Tiêu đề"}
            type={"text"}
            value={title}
            setValue={setTitle}
          />
        </div>
        <label className="subLabel">
          Thumbnail
          <span className="redDot">*</span>
        </label>
        <ImageList
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />
        <div className="fixSpace" />
        <DisableButton
          label={"Bắt đầu phát trực tiếp"}
          customCondition={isAbleToContinue}
          onClick={() => createLivestreamSession()}
        />
        <TransparentButton
          label={"Quay lại"}
          onClick={() => navigate("/home")}
        />
      </div>
    </div>
  );
}
