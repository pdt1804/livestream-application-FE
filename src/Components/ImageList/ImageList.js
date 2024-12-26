import { useState } from "react";
import { livestreamBackground } from "../../Resource"
import ImageItem from "./ImageItem";

export default function ImageList({selectedImage, setSelectedImage}) {
  const images = livestreamBackground;

  return (
    <div className="imageList">
      {images && images.map((item) => <ImageItem url={item} selectedImage={selectedImage} setSelectedImage={setSelectedImage}/>)}
    </div>
  )
}