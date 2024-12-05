import React, { useEffect, useRef, useState } from "react";
import "./index.css";
import SockJS from 'sockjs-client';
import { Client } from "@stomp/stompjs";

export default function Livestream() {
  const screenVideo = useRef(null);
  const cameraVideo = useRef(null);
  const [offer, setOffer] = useState(null);
  const [candidate, setCandidate] = useState(null);
  let socket;
  let stompClient;
  const iceServers = {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302"
      }
    ]
  };
  const rtcPeerConnection = new RTCPeerConnection(iceServers);

  useEffect(() => {
    const setupVideo = async () => {
      const cameraStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      cameraVideo.current.srcObject = cameraStream;

      const screenStream = await navigator.mediaDevices.getDisplayMedia({ audio: true, video: true });
      screenVideo.current.srcObject = screenStream;

      screenStream.getTracks().forEach(track => {
        rtcPeerConnection.addTrack(track, screenStream);
      });

      rtcPeerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          setCandidate(JSON.stringify(event.candidate));
        }
      };

      const offer = await rtcPeerConnection.createOffer();
      await rtcPeerConnection.setLocalDescription(offer);
      setOffer(JSON.stringify(offer));
    };

    setupVideo();
  }, []);

  useEffect(() => {
    const configureWebSocket = async () => {
      console.log(offer);
      console.log(candidate);

      socket = new SockJS("http://localhost:8080/ws");
      stompClient = new Client({
        webSocketFactory: () => socket,
        debug: (str) => console.log(str),
      });
      stompClient.onConnect = onConnect;
      stompClient.onStompError = onError;
      stompClient.activate();
    };

    const isValid = offer && candidate;
    if (isValid) configureWebSocket();
  }, [candidate, offer]);

  const onConnect = async () => {
    stompClient.subscribe("/user/livestream", (data) => sendDataForViewer(data.body));
  };

  const onError = async (error) => {
    console.error("Error while connecting to websocket server", error);
  };

  const sendDataForViewer = async (data) => {
    data = JSON.parse(data);
    const payloadData = {
      offer: offer,
      candidate: candidate,
      userName: data.userName,
    };

    stompClient.publish({ destination: "/app/sendCandidate", body: JSON.stringify(payloadData) });
  };

  return (
    <div className="video-section">
      <div className="video-display">
        <div className="areaForScreenVideo">
          <video className="screenVideo" ref={screenVideo} autoPlay />
        </div>
        <div className="interact-section">
          <div className="areaForCameraVideo">
            <video className="cameraVideo" ref={cameraVideo} autoPlay />
          </div>
          <div className="areaForChatting">
            {/* Area for chatting from viewers */}
          </div>
        </div>
      </div>
    </div>
  );
}