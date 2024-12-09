import React, { useState, useRef, useEffect } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const ViewerLivestream = () => {
  const [inputUserName, setInputUserName] = useState("viewer");
  const livestreamScreen = useRef(null);
  let candidate = [];
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
  }, []);

  const onConnect = async () => {
    stompClient.subscribe("/user/" + inputUserName, (data) => receiveOfferAndceCandidate(data.body));
  };

  const onError = async (error) => {
    console.error("Error while connecting to websocket server", error);
  };

  const receiveOfferAndceCandidate = async (PayloadData) => {
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
        candidate.push(event.candidate);
      }
    };

    const remoteCandidate = JSON.parse(PayloadData.candidate)
    console.log(remoteCandidate)

    for (const candidate of remoteCandidate) {
      console.log(candidate)
      const iceCandidate = new RTCIceCandidate({
        sdpMid: candidate.sdpMid,
        sdpMLineIndex: candidate.sdpMLineIndex,
        candidate: candidate.candidate,
      });

      await rtcPeerConnection.addIceCandidate(iceCandidate)
    }

    const answerAndCandidateData = {
      answer: JSON.stringify(answer),
      candidate: JSON.stringify(candidate),
      livestreamUserName: "livestream",
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

  // return (
  //   <div>
  //     <video ref={livestreamScreen} autoPlay clas></video>
  //     <button onClick={() => requestForOffer()}>Livestream Screen</button>
  //   </div>
  // );

  return (
    <div className="video-section">
      <input type="text" value={inputUserName} onChange={(e) => setInputUserName(e.target.value)}/>
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