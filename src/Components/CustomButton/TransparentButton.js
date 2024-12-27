import React from "react";
import "./buttons.css";

export default function TransparentButton({ label = "Click Me", onClick }) {
  return (
    <button className={`transparentButton-button`} onClick={onClick}>
      {label}
    </button>
  );
}
