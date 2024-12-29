import { useNavigate } from "react-router-dom";
import { IoIosCheckmark } from "react-icons/io";

export default function ImageItem({ url, selectedImage, setSelectedImage }) {
  const isSelected = url === selectedImage;

  return (
    <div
      className={`imageItem ${isSelected ? "selected" : ""}`}
      style={{ backgroundImage: `url(${url})` }}
      onClick={() => setSelectedImage(isSelected ? null : url)}
    >
      {isSelected && <IoIosCheckmark className="checkedIcon" />}
    </div>
  );
}