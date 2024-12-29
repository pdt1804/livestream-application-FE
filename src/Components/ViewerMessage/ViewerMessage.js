import "./ViewerMessage.css"

export default function ViewerMessage(props) {
  const viewerName = props.message.viewerName;
  const messageContent = props.message.content;

  return (
    <div className="viewerMessage">
      <span
        style={{
          fontWeight: "bolder",
          textDecoration: "underline",
          color: "red",
        }}
      >
        {viewerName}:
      </span>{" "}
      {messageContent}
    </div>
  );
}
