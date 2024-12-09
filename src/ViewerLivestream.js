import React, { useState, useRef, useEffect } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const generateRandomString = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const ViewerLivestream = () => {
  const [inputUserName, setInputUserName] = useState(generateRandomString(10));
  const livestreamScreen = useRef(null);
  let remoteCandidate = [];
  let localCandidate = [];
  const socket = new SockJS("http://localhost:8080/ws");
  const stompClient = new Client({
    webSocketFactory: () => socket,
    debug: (str) => console.log(str),
  });
  let rtcPeerConnection;
  const iceServers = {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302"
      }
    ]
  };

  useEffect(() => {
    const configureWebsocket = () => {
      stompClient.onConnect = onConnect;
      stompClient.onStompError = onError;
      stompClient.activate();
    };

    configureWebsocket();
  }, [inputUserName]);

  const onConnect = async () => {
    stompClient.subscribe("/user/" + inputUserName + "/receiveOffer", (data) => receiveOffer(data.body));
    stompClient.subscribe("/user/" + inputUserName + "/receiveIceCandidate", (data) => receiveIceCandidate(data.body));
  };

  const onError = async (error) => {
    console.error("Error while connecting to websocket server", error);
  };

  const receiveIceCandidate = async (PayloadData) => {
    try {
      PayloadData = JSON.parse(PayloadData)
      const remoteIceCandidate = JSON.parse(PayloadData.candidate);
      remoteCandidate.push(remoteIceCandidate)
  
      const iceCandidate = new RTCIceCandidate({
        sdpMid: remoteIceCandidate.sdpMid,
        sdpMLineIndex: remoteIceCandidate.sdpMLineIndex,
        candidate: remoteIceCandidate.candidate,
      });
  
      await rtcPeerConnection.addIceCandidate(iceCandidate)
    } catch (e) {
      console.error(e);
    }
  };

  const receiveOffer = async (PayloadData) => {
    PayloadData = JSON.parse(PayloadData)
    const payloadOffer = JSON.parse(PayloadData.offer);
    console.log(PayloadData)

    const remoteOffer = new RTCSessionDescription(payloadOffer);
    await rtcPeerConnection.setRemoteDescription(remoteOffer);

    const answer = await rtcPeerConnection.createAnswer();
    await rtcPeerConnection.setLocalDescription(answer);

    rtcPeerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log(event)
        localCandidate.push(event.candidate);
      }
    };

    const answerAndCandidateData = {
      answer: JSON.stringify(answer),
      candidate: JSON.stringify(localCandidate),
      livestreamUserName: PayloadData.livestreamUserName,
      viewerName: inputUserName,
    }

    stompClient.publish({ destination: "/app/sendAnswerAndCandidate", body: JSON.stringify(answerAndCandidateData) });
  };

  const requestForOffer = async () => {
    try {
      rtcPeerConnection = new RTCPeerConnection(iceServers);
      rtcPeerConnection.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          livestreamScreen.current.srcObject = event.streams[0];
        }
      };
      console.log(inputUserName)
      stompClient.publish({ destination: "/app/requestForOffer", body: JSON.stringify(inputUserName) });
    } catch (error) {
      console.error("Error creating or setting local description", error);
    }
  };

  return (
    <div className="video-section">
      <div className="video-display">
        <div className="areaForScreenVideo">
          <video className="screenVideo" ref={livestreamScreen} autoPlay />
        </div>
        <div className="interact-section">
          <div className="areaForChattingViewerSide">
          </div>
        </div>
      </div>
      <button onClick={() => requestForOffer()}>Livestream Screen</button>
    </div>
  )
};

export default ViewerLivestream;