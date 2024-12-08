import React, { useEffect, useRef, useState } from "react";
import SockJS from 'sockjs-client';
import { Client } from "@stomp/stompjs";

export default function Livestream() {
  const screenVideo = useRef(null);
  const cameraVideo = useRef(null);
  let candidate = [];
  let socket = null;
  let stompClient = null;
  let rtcPeerConnection;
  const iceServers = {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302"
      }
    ]
  };

  useEffect(() => {
    const setupVideo = async () => {
      const cameraStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      cameraVideo.current.srcObject = cameraStream;

      const screenStream = await navigator.mediaDevices.getDisplayMedia({ audio: true, video: true });
      screenVideo.current.srcObject = screenStream;

      rtcPeerConnection = new RTCPeerConnection(iceServers);

      screenStream.getTracks().forEach(track => {
        rtcPeerConnection.addTrack(track, screenStream);
      });

      const offer = await rtcPeerConnection.createOffer();
      await rtcPeerConnection.setLocalDescription(offer);

      rtcPeerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          candidate.push(event.candidate);
        }
      };
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
    stompClient.subscribe("/user/livestream/sendOfferAndCandidate", (data) => sendOfferAndIceCandidate(data.body));
    stompClient.subscribe("/user/livestream/receiveAnswerAndCandidate", (data) => receiveAnswerAndCandidate(data.body));
  };

  const onError = async (error) => {
    console.error("Error while connecting to websocket server", error);
  };

  const sendOfferAndIceCandidate = async (PayloadData) => {
    const viewerName = JSON.parse(PayloadData);
    
    console.log(rtcPeerConnection.localDescription)

    const offerAndCandidateData = {
      offer: JSON.stringify(rtcPeerConnection.localDescription),
      candidate: JSON.stringify(candidate),
      viewerName: viewerName,
    }

    console.log(offerAndCandidateData)
    stompClient.publish({ destination: "/app/sendOfferAndCandidate", body: JSON.stringify(offerAndCandidateData) });
  };

  const receiveAnswerAndCandidate = async (PayloadData) => {
    PayloadData = JSON.parse(PayloadData);
    const remoteAnswer = JSON.parse(PayloadData.answer)
    await rtcPeerConnection.setRemoteDescription(remoteAnswer)

    const remoteCandidate = JSON.parse(PayloadData.candidate)
    for (const candidate of remoteCandidate) {
      console.log(candidate)
      const iceCandidate = new RTCIceCandidate({
        sdpMid: candidate.sdpMid,
        sdpMLineIndex: candidate.sdpMLineIndex,
        candidate: candidate.candidate,
      });

      await rtcPeerConnection.addIceCandidate(iceCandidate)
    }
  }

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
          
          </div>
        </div>
      </div>
    </div>
  );
}