import React, { useEffect, useRef, useState } from "react";
import SockJS from 'sockjs-client';
import { Client } from "@stomp/stompjs";
import ViewerMessage from "./Components/ViewerMessage";

export default function Livestream() {
  const [inputUserName, setInputUserName] = useState("livestream");
  const [numberOfViewer, setNumberOfViewer] = useState(0);
  const [messages, setMessages] = useState([])
  const chatArea = useRef(null);
  const screenVideo = useRef(null);
  const cameraVideo = useRef(null);
  let sharingScreenStream = null;
  let candidate = [];
  let viewer = [];
  let socket = null;
  let stompClient = null;
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
    stompClient.subscribe("/user/" + inputUserName + "/receiveMessage", (data) => receiveMessage(data.body));
    stompClient.subscribe("/user/" + inputUserName + "/receiveAnswerAndCandidate", (data) => receiveAnswerAndCandidate(data.body));
  };

  const onError = async (error) => {
    console.error("Error while connecting to websocket server", error);
  };

  const receiveMessage = async (PayloadData) => {
    PayloadData = JSON.parse(PayloadData);
    const newMessage = {
      content: PayloadData.content,
      viewerName: PayloadData.viewerName,
    }

    console.log(messages.length)
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const sendOfferAndIceCandidate = async (PayloadData) => {
    PayloadData = JSON.parse(PayloadData)
    const viewerName = PayloadData.viewerName;

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
        const candidateData = {
          viewerName: viewerName,
          candidate: JSON.stringify(event.candidate)
        }

        stompClient.publish({ destination: "/app/sendCandidate", body: JSON.stringify(candidateData) });
      }
    };
    
    const offerAndCandidateData = {
      offer: JSON.stringify(rtcPeerConnection.localDescription),
      viewerName: viewerName,
      livestreamUserName: inputUserName,
    }

    const newViewer = {
      viewerName: viewerName,
      peerConnection: rtcPeerConnection,
    }

    viewer.push(newViewer)
    console.log(offerAndCandidateData)

    stompClient.publish({ destination: "/app/sendOffer", body: JSON.stringify(offerAndCandidateData) });
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

  useEffect(() => {
    const interval = setInterval(() => {
      console.log(viewer)
      setNumberOfViewer(viewer.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [numberOfViewer]);

  useEffect(() => {
    if (chatArea.current) {
      chatArea.current.scrollTop = chatArea.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="video-section">
      <div className="displayTotalViewer">
        <label>Viewer: {numberOfViewer}</label>
      </div>
      <div className="video-display">
        <div className="areaForScreenVideo">
          <video className="screenVideo" ref={screenVideo} autoPlay />
        </div>
        <div className="interact-section">
          <div className="areaForCameraVideo">
            <video className="cameraVideo" ref={cameraVideo} autoPlay />
          </div>
          <div className="areaForChatting" ref={chatArea}>
            {messages.map((item, index) => <ViewerMessage key={index} message={item} />)}          
          </div>
        </div>
      </div>
    </div>
  );
}