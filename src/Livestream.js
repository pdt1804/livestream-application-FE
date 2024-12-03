import { useEffect, useRef } from "react";
import "./index.css"

let isRun = false;

export default function Livestream() {
  const screenVideo = useRef(null);
  const cameraVideo = useRef(null);

  useEffect(() => {
    const setupVideo = async () => {
      if (!cameraVideo.current.srcObject) {
        const cameraStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        console.log(cameraStream)
        cameraVideo.current.srcObject = cameraStream;
      }

      if (!screenVideo.current.srcObject) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ audio: true, video: true });
        screenVideo.current.srcObject = screenStream;
      }
    };

    setupVideo();
  }, []);

  return (
    <div className="video-section">
      <div className="video-display">
        <div className="areaForScreenVideo">
          <video className="screenVideo" ref={screenVideo} autoPlay />
        </div>
        <div className="interact-section">
          <div className="areaForCameraVideo">
            <video className="cameraVideo" ref={cameraVideo} autoPlay/>
          </div>
          <div className="areaForChatting">

          </div>
        </div>
      </div>
    </div>
  );
}