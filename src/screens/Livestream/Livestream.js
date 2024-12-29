import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { ViewerMessage, Dropdown } from "../../Components";
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import BackspaceIcon from '@mui/icons-material/Backspace';
import axios from "axios";
import { BASE_URL, checkError } from "../../Resource";
import { useNavigate } from "react-router-dom";

import "./Livestream.css";

export default function Livestream() {
  const [inputUserName, setInputUserName] = useState(
    localStorage.getItem("userName")
  );
  const [numberOfViewer, setNumberOfViewer] = useState(0);
  const [messages, setMessages] = useState([]);
  const [title, setTitle] = useState(localStorage.getItem("title"));
  const chatArea = useRef(null);
  const screenVideo = useRef(null);
  const cameraVideo = useRef(null);
  const navigate = useNavigate();
  let sharingScreenStream = null;
  let candidate = [];
  let viewer = [];
  let socket = null;
  let stompClient = null;
  const iceServers = {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
    ],
  };

  useEffect(() => {
    if (title === "null") setTitle("This is title");

    const setupVideo = async () => {
      const cameraStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      cameraVideo.current.srcObject = cameraStream;

      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        audio: true,
        video: true,
      });
      screenVideo.current.srcObject = screenStream;

      sharingScreenStream = screenStream;
    };
    setupVideo();
  }, []);

  useEffect(() => {
    const configureWebSocket = async () => {
      socket = new SockJS("http://localhost:8080/ws");
      stompClient = new Client({
        webSocketFactory: () => socket,
        debug: (str) => console.log(str),
      });
      stompClient.onConnect = onConnect;
      stompClient.onStompError = onError;
      stompClient.activate();
    };

    configureWebSocket();
  }, []);

  const onConnect = async () => {
    stompClient.subscribe(
      "/user/" + inputUserName + "/sendOfferAndCandidate",
      (data) => sendOfferAndIceCandidate(data.body)
    );
    stompClient.subscribe(
      "/user/" + inputUserName + "/receiveMessage",
      (data) => receiveMessage(data.body)
    );
    stompClient.subscribe(
      "/user/" + inputUserName + "/receiveAnswerAndCandidate",
      (data) => receiveAnswerAndCandidate(data.body)
    );
  };

  const onError = async (error) => {
    console.error("Error while connecting to websocket server", error);
  };

  const receiveMessage = async (PayloadData) => {
    PayloadData = JSON.parse(PayloadData);
    const newMessage = {
      content: PayloadData.content,
      viewerName: PayloadData.viewerName,
    };

    console.log(messages.length);
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const sendOfferAndIceCandidate = async (PayloadData) => {
    PayloadData = JSON.parse(PayloadData);
    const viewerName = PayloadData.viewerName;

    const rtcPeerConnection = new RTCPeerConnection(iceServers);

    sharingScreenStream.getTracks().forEach((track) => {
      rtcPeerConnection.addTrack(track, sharingScreenStream);
    });

    const offer = await rtcPeerConnection.createOffer();
    await rtcPeerConnection.setLocalDescription(offer);

    rtcPeerConnection.onicecandidate = (event) => {
      console.log(event);
      if (event.candidate) {
        candidate.push(event.candidate);
        const candidateData = {
          viewerName: viewerName,
          candidate: JSON.stringify(event.candidate),
        };

        stompClient.publish({
          destination: "/app/sendCandidate",
          body: JSON.stringify(candidateData),
        });
      }
    };

    const offerAndCandidateData = {
      offer: JSON.stringify(rtcPeerConnection.localDescription),
      viewerName: viewerName,
      livestreamUserName: inputUserName,
    };

    const newViewer = {
      viewerName: viewerName,
      peerConnection: rtcPeerConnection,
    };

    viewer.push(newViewer);
    console.log(offerAndCandidateData);

    stompClient.publish({
      destination: "/app/sendOffer",
      body: JSON.stringify(offerAndCandidateData),
    });
  };

  const receiveAnswerAndCandidate = async (PayloadData) => {
    PayloadData = JSON.parse(PayloadData);
    const viewerName = PayloadData.viewerName;
    let currentPeerConnection = null;

    // Thuật toán này chưa tối ưu (TẠM THỜI)
    viewer.forEach((item) => {
      if (item.viewerName === viewerName) {
        currentPeerConnection = item.peerConnection;
        return currentPeerConnection;
      }
    });

    if (currentPeerConnection !== null) {
      const remoteAnswer = JSON.parse(PayloadData.answer);
      await currentPeerConnection.setRemoteDescription(remoteAnswer);

      const remoteCandidate = JSON.parse(PayloadData.candidate);
      for (const candidate of remoteCandidate) {
        console.log(candidate);
        const iceCandidate = new RTCIceCandidate({
          sdpMid: candidate.sdpMid,
          sdpMLineIndex: candidate.sdpMLineIndex,
          candidate: candidate.candidate,
        });

        await currentPeerConnection.addIceCandidate(iceCandidate);
      }
    } else {
      console.error("Network Issue !");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setNumberOfViewer(viewer.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [numberOfViewer]);

  useEffect(() => {
    if (chatArea.current) {
      chatArea.current.scrollTop = chatArea.current.scrollHeight;
    }
  }, [messages]);

  const handleFullScreen = (videoRef) => {
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    } else if (videoRef.current.mozRequestFullScreen) {
      videoRef.current.mozRequestFullScreen();
    } else if (videoRef.current.webkitRequestFullscreen) {
      videoRef.current.webkitRequestFullscreen();
    } else if (videoRef.current.msRequestFullscreen) {
      videoRef.current.msRequestFullscreen();
    }
  };

  const endSession = async () => {
    const id = localStorage.getItem("id");
    const request = await axios.put(
      BASE_URL + "/api/v1/livestream/endSession?id=" + id
    );
    if (request.status === 200) {
      const errorMessage = checkError(request.data);
      if (errorMessage === null) {
        //stompClient.publish({ destination: "/app/endSession", body: JSON.stringify(inputUserName) });
        navigate("/home");
      } else {
        console.error(errorMessage);
      }
    }
  };

  const options = [
    {
      id: 1,
      icon: <FullscreenIcon/>,
      title: "Mở toàn màn hình",
      onClick: () => handleFullScreen(screenVideo),
    },
    {
      id: 2,
      icon: <BackspaceIcon/>,
      title: "Kết thúc trực tiếp",
      onClick: () => endSession(),
    },
  ];

  return (
    <div className="video-section">
      <div className="areaForScreenVideo">
        <div>
          <video className="screenVideo" ref={screenVideo} autoPlay />
        </div>
        <div className="informationLivestream">
          <label className="titleSession">{title}</label>
          <Dropdown options={options}/>
        </div>
      </div>
      <div className="interact-section">
        <div className="areaForCameraVideo">
          <video className="cameraVideo" ref={cameraVideo} autoPlay />
        </div>
        <div className="areaForChatting" ref={chatArea}>
          {messages.map((item, index) => (
            <div className="viewerMessage">
              <span
                style={{
                  fontWeight: "bolder",
                  textDecoration: "underline",
                  color: "red",
                }}
              >
                {item.viewerName}:
              </span>{" "}
              {item.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
