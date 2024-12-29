import { useState } from "react";
import { livestreamBackground } from "../../Resource";
import ImageItem from "./ImageListItem";

import "./ImageList.css";

export default function ImageList({ selectedImage, setSelectedImage }) {
  const images = livestreamBackground;

  return (
    <div className="imageList">
      {images &&
        images.map((item, index) => (
          <ImageItem
            key={index}
            url={item}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
          />
        ))}
    </div>
  );
}
