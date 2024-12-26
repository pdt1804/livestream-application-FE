import { useState } from "react";
import { IoIosSend } from "react-icons/io";

export default function EnterMessageBar (props) {
  const [message, setMessage] = useState("")

  const sendMessage = () => {
    if (props.stompClient.connected) {
      const sendingMessage = {
        content: message,
        viewerName: props.viewerName,
        livestreamUserName: props.livestreamUserName,
      }

      props.stompClient.publish({ destination: "/app/sendMessage", body: JSON.stringify(sendingMessage) });
      setMessage("")
    } else {
      console.error("STOMP client is not connected");
    }
  }

  return (
    <div className="areaForTextingMessage">
      <div className="InputMessage">
        <input className="inputMessageComponent" value={message} onChange={(e) => setMessage(e.target.value)}/>  
      </div>
      <div className="sendButton">
        <IoIosSend color="blue" className="sendButtonIcon" onClick={() => sendMessage()}/>
      </div>
    </div>
  )
}