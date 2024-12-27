import React from "react";
import "./buttons.css";

export default function DisableButton({
  label = "Click Me",
  isAbleToUse = true,
  onClick,
  customCondition = true,
}) {
  const isEnabled = isAbleToUse && customCondition;

  return (
    <button
      className={`disableButton-button ${isEnabled ? "" : "disabled"}`}
      onClick={isEnabled ? onClick : null}
      disabled={!isEnabled}
    >
      {label}
    </button>
  );
}
