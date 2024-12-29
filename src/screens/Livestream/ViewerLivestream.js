import React, { useState, useRef, useEffect } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { ViewerMessage, Dropdown } from "../../Components";
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { IoIosSend } from "react-icons/io";
import { BsArrowsFullscreen } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";

const generateRandomString = (length) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export default function ViewerLivestream() {
  const location = useLocation();
  const { session } = location.state || {};
  const navigate = useNavigate();
  const [valid, setValid] = useState(true);
  const [inputUserName, setInputUserName] = useState(
    localStorage.getItem("userName")
  );
  const [livestreamUserName, setLivestreamUserName] = useState(
    session.user.userName
  );
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const livestreamScreen = useRef(null);
  const chatArea = useRef(null);
  const stompClientRef = useRef(null);
  let remoteCandidate = [];
  let localCandidate = [];
  let rtcPeerConnection;
  const iceServers = {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
    ],
  };

  useEffect(() => {
    const configureWebsocket = () => {
      const socket = new SockJS("http://localhost:8080/ws");
      const stompClient = new Client({
        webSocketFactory: () => socket,
        debug: (str) => console.log(str),
      });
      stompClient.onConnect = onConnect;
      stompClient.onStompError = onError;
      stompClient.activate();
      stompClientRef.current = stompClient; // Assign to useRef
    };

    configureWebsocket();
  }, []);

  const onConnect = async () => {
    const stompClient = stompClientRef.current;
    stompClient.subscribe("/user/" + inputUserName + "/receiveOffer", (data) =>
      receiveOffer(data.body)
    );
    stompClient.subscribe(
      "/user/" + inputUserName + "/receiveIceCandidate",
      (data) => receiveIceCandidate(data.body)
    );
    stompClient.subscribe(
      "/user/" + livestreamUserName + "/receiveMessage",
      (data) => receiveMessage(data.body)
    );
    stompClient.subscribe("/user/" + livestreamUserName + "/endSession", () =>
      navigate("/home")
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

    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const receiveIceCandidate = async (PayloadData) => {
    try {
      PayloadData = JSON.parse(PayloadData);
      const remoteIceCandidate = JSON.parse(PayloadData.candidate);
      remoteCandidate.push(remoteIceCandidate);

      const iceCandidate = new RTCIceCandidate({
        sdpMid: remoteIceCandidate.sdpMid,
        sdpMLineIndex: remoteIceCandidate.sdpMLineIndex,
        candidate: remoteIceCandidate.candidate,
      });

      await rtcPeerConnection.addIceCandidate(iceCandidate);
      console.log(stompClientRef.current.connected);
    } catch (e) {
      console.error(e);
    }
  };

  const receiveOffer = async (PayloadData) => {
    PayloadData = JSON.parse(PayloadData);
    const payloadOffer = JSON.parse(PayloadData.offer);
    console.log(PayloadData);

    const remoteOffer = new RTCSessionDescription(payloadOffer);
    await rtcPeerConnection.setRemoteDescription(remoteOffer);

    const answer = await rtcPeerConnection.createAnswer();
    await rtcPeerConnection.setLocalDescription(answer);

    rtcPeerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log(event);
        localCandidate.push(event.candidate);
      }
    };

    const answerAndCandidateData = {
      answer: JSON.stringify(answer),
      candidate: JSON.stringify(localCandidate),
      livestreamUserName: PayloadData.livestreamUserName,
      viewerName: inputUserName,
    };

    stompClientRef.current.publish({
      destination: "/app/sendAnswerAndCandidate",
      body: JSON.stringify(answerAndCandidateData),
    });
  };

  const requestForOffer = async () => {
    setValid(false);
    try {
      rtcPeerConnection = new RTCPeerConnection(iceServers);
      rtcPeerConnection.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          livestreamScreen.current.srcObject = event.streams[0];
        }
      };

      const userInfoData = {
        viewerName: inputUserName,
        livestreamUserName: livestreamUserName,
      };

      stompClientRef.current.publish({
        destination: "/app/requestForOffer",
        body: JSON.stringify(userInfoData),
      });
    } catch (error) {
      console.error("Error creating or setting local description", error);
    }
  };

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

  useEffect(() => {
    if (chatArea.current) {
      chatArea.current.scrollTop = chatArea.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    const sendingMessage = {
      content: message,
      viewerName: inputUserName,
      livestreamUserName: livestreamUserName,
    };
    console.log(sendingMessage);
    console.log(stompClientRef.current);

    stompClientRef.current.publish({
      destination: "/app/sendMessage",
      body: JSON.stringify(sendingMessage),
    });
    setMessage("");
  };

  const fullScreenIcon = (
    <BsArrowsFullscreen
      className="fullScreenIcon"
      onClick={() => handleFullScreen(livestreamScreen)}
    />
  );

  const options = [
    {
      id: 1,
      icon: <FullscreenIcon/>,
      title: "Mở toàn màn hình",
      onClick: () => handleFullScreen(livestreamScreen),
    },
  ];

  return (
    <div className="video-section">
      <div className="areaForScreenVideo">
        {valid ? (
            <div className="areaPlayButton">
              <button
                className={
                  valid == true
                    ? "playLivestream-valid"
                    : "playLivestream-invalid"
                }
                onClick={() => requestForOffer()}
              ></button>
            </div>
          ) : (
            <video className="screenVideo" ref={livestreamScreen} autoPlay />
          )}
        <div className="informationLivestream">
          <label className="titleSession">{session.title}</label>
          <Dropdown options={options} />
        </div>
      </div>
      <div className="interact-section">
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
        <div className="areaForTextingMessage">
            <div className="InputMessage">
              <input
                className="inputMessageComponent"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <div className="sendButton">
              <IoIosSend
                color="blue"
                className="sendButtonIcon"
                onClick={() => sendMessage()}
              />
            </div>
          </div>
      </div>
    </div>
  );
}
