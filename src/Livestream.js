import React, { useEffect, useRef, useState } from "react";
import SockJS from 'sockjs-client';
import { Client } from "@stomp/stompjs";

export default function Livestream() {
  const [inputUserName, setInputUserName] = useState("livestream");
  const [numberOfViewer, setNumberOfViewer] = useState("livestream");
  const screenVideo = useRef(null);
  const cameraVideo = useRef(null);
  let sharingScreenStream = null;
  let candidate = [];
  let viewer = [];
  let socket = null;
  let stompClient = null;
  //let rtcPeerConnection;
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
    stompClient.subscribe("/user/" + inputUserName + "/sendOfferAndCandidate", (data) => sendOfferAndIceCandidate(data.body));
    stompClient.subscribe("/user/" + inputUserName + "/receiveAnswerAndCandidate", (data) => receiveAnswerAndCandidate(data.body));
  };

  const onError = async (error) => {
    console.error("Error while connecting to websocket server", error);
  };

  const sendOfferAndIceCandidate = async (PayloadData) => {
    const rtcPeerConnection = new RTCPeerConnection(iceServers);

    sharingScreenStream.getTracks().forEach(track => {
      rtcPeerConnection.addTrack(track, sharingScreenStream);
    });

    const offer = await rtcPeerConnection.createOffer();
    await rtcPeerConnection.setLocalDescription(offer);

    rtcPeerConnection.onicecandidate = (event) => {
      console.log(event)
      if (event.candidate) {
        candidate.push(event.candidate);
      }
    };

    const viewerName = JSON.parse(PayloadData);
    
    const offerAndCandidateData = {
      offer: JSON.stringify(rtcPeerConnection.localDescription),
      candidate: JSON.stringify(candidate),
      viewerName: viewerName,
    }

    const newViewer = {
      viewerName: viewerName,
      peerConnection: rtcPeerConnection,
    }

    viewer.push(newViewer)
    console.log(offerAndCandidateData)

    stompClient.publish({ destination: "/app/sendOfferAndCandidate", body: JSON.stringify(offerAndCandidateData) });
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
      const remoteAnswer = JSON.parse(PayloadData.answer)
      await currentPeerConnection.setRemoteDescription(remoteAnswer)

      const remoteCandidate = JSON.parse(PayloadData.candidate)
      for (const candidate of remoteCandidate) {
        console.log(candidate)
        const iceCandidate = new RTCIceCandidate({
          sdpMid: candidate.sdpMid,
          sdpMLineIndex: candidate.sdpMLineIndex,
          candidate: candidate.candidate,
        });

        await currentPeerConnection.addIceCandidate(iceCandidate)
      }
    } else {
      console.error("Network Issue !")
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