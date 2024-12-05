import React, { useState, useRef, useEffect } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const ViewerLivestream = () => {
  const [inputUserName, setInputUserName] = useState("viewer");
  const livestreamScreen = useRef(null);
  const socket = new SockJS("http://localhost:8080/ws");
  const stompClient = new Client({
    webSocketFactory: () => socket,
    debug: (str) => console.log(str),
  });
  const iceServers = {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302"
      }
    ]
  };
  const rtcPeerConnection = new RTCPeerConnection(iceServers);

  useEffect(() => {
    const configureWebsocket = () => {
      stompClient.onConnect = onConnect;
      stompClient.onStompError = onError;
      stompClient.activate();
    };

    configureWebsocket();
  }, []);

  const onConnect = async () => {
    stompClient.subscribe("/user/" + inputUserName, (message) => receiveICECandidate(message.body));
  };

  const onError = async (error) => {
    console.error("Error while connecting to websocket server", error);
  };

  const receiveICECandidate = async (PayloadData) => {
    const payload = JSON.parse(PayloadData);
    const remoteOffer = new RTCSessionDescription(JSON.parse(payload.offer));
    const remoteCandidate = new RTCIceCandidate({
      sdpMid: JSON.parse(payload.candidate).sdpMid,
      sdpMLineIndex: JSON.parse(payload.candidate).sdpMLineIndex,
      candidate: JSON.parse(payload.candidate).candidate,
    });

    console.log(remoteOffer);
    console.log(remoteCandidate);

    // Thiết lập ontrack trước khi thêm các track
    rtcPeerConnection.ontrack = (event) => {
      console.log("Track event:", event);
      if (event.streams && event.streams[0]) {
        livestreamScreen.current.srcObject = event.streams[0];
      } else {
        console.log("No streams found in track event");
      }
    };

    await rtcPeerConnection.setRemoteDescription(remoteOffer);
    await rtcPeerConnection.addIceCandidate(remoteCandidate);
  };

  const requestGetICECandidate = () => {
    stompClient.publish({ destination: "/app/getLivestreamICECandidate", body: JSON.stringify({ userName: inputUserName }) });
  };

  return (
    <div>
      <video ref={livestreamScreen} autoPlay playsInline></video>
      <button onClick={() => requestGetICECandidate()}>Livestream Screen</button>
    </div>
  );
};

export default ViewerLivestream;