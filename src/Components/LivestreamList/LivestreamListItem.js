import { useNavigate } from "react-router-dom";

export default function LivestreamItem({ session }) {
  const navigate = useNavigate();

  return (
    <div
      className="livestreamItem"
      onClick={() => navigate("viewer", { state: { session } })}
    >
      <img className="imageLivestreamItem" src={session.backgroundImage} />
      <label className="headerLivestreamItem">{session.title}</label>
      <h7 className="nickNameLivestreamItem">{session.user.nickName}</h7>
    </div>
  );
}
