import React, { useState } from "react";
import "./InputBox.css";

function InputBox({ onClickHandler }) {
  const [inputText, setInputText] = useState("");
  const handleOnSendButtonClick = () => {
    const newMessage = {
      isUnread: false,
      user: "you",
      message: inputText
    }
    onClickHandler(newMessage);
    setInputText("");
  };
  return (
    <div className="container">
      <input
        type="text"
        className="inputStyle"
        placeholder="input your message"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleOnSendButtonClick();
          }
        }}
        onChange={(e) => {
          setInputText(e.target.value);
        }}
        value={inputText}
      />
      <button className="sendButtonStyle" onClick={handleOnSendButtonClick}>
        Send
      </button>
    </div>
  );
}

export default InputBox;
