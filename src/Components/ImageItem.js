import { useNavigate } from "react-router-dom"
import { IoIosCheckmark } from "react-icons/io";

export default function ImageItem({url, selectedImage, setSelectedImage}) {

  const navigate = useNavigate()

  const selectedImageItemStyle = {
    width: "220px",
    height: "190px",
    marginRight: "20px",
    marginBottom: "20px",
    opacity: "40%",
    backgroundImage: `url(${url})`,
    backgroundSize: "cover",
    backgroundPosition: "top",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "4px solid #ba43ff",
  }

  return (
    (url !== selectedImage) ? (
    <div className="imageItem" src={url} onClick={() => setSelectedImage(url)}>
      <img className="imageItem" src={url} onClick={() => setSelectedImage(url)}/>
    </div>) : (
    <div style={selectedImageItemStyle} onClick={() => setSelectedImage(null)}>
      <IoIosCheckmark className="checkedIcon"/>
      {/* <img className="selectedImageItem" src={url} onClick={() => setSelectedImage(null)}/>  */}
    </div>)
  )
}