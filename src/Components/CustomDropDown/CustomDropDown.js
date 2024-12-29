import React, { useState } from "react";
import "./CustomDropDown.css";

export default function Dropdown({options}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="dropdown-container">
      <button className="menu-icon" onClick={toggleDropdown}>
        ☰
      </button>
      {isOpen && (
        <ul className="dropdown-menu">
          {options.map((option) => (
            <li key={option.id} >
              <button className="dropdown-item" onClick={option.onClick}>
                <span className="item-icon">{option.icon}</span>
                <span className="item-title">{option.title}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};