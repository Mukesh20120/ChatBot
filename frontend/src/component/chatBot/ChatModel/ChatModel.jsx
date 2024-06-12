import React, { useEffect, useRef } from "react";
import "./ChatModel.css";
import InputBox from "../InputBox/InputBox";

function ChatModel({ chatData, handleAddInputData, isRead,userIsTyping }) {
  const scrollToEnd = useRef(null);
  useEffect(()=>{
    if(scrollToEnd.current){
      scrollToEnd.current.scrollIntoView({ behavior: 'smooth' });
    }
  },[chatData])
  return (
    <div>
      <div className="chatCover">
        <div style={{ height: "100%",overflowX: 'scroll'}}>
          {chatData.map((data) => (
            <div
             key={`${Math.random().toString(36).substring(2,9)}-${Date.now()}`}
              style={{
                display: "flex",
                justifyContent: data.user === "you" ? "flex-end" : "flex-start",
              }}
              ref={scrollToEnd}
            >
              <p
                style={{
                  textAlign: "start",
                  backgroundColor: data.user === "you" ? "yellow" : "gray",
                  margin: "4px 2px",
                  padding: "2px 5px",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              >
                {data.message}
              </p>
            </div>
          ))}
        {isRead && <p style={{textAlign: 'end',fontSize: '10px',margin: 0,padding: 0}}>Read</p>}
         {userIsTyping && <div
             key={toString(Math.random)}
              style={{
                display: "flex",
                justifyContent: "flex-start",
              }}
              ref={scrollToEnd}
            >
              <p
                style={{
                  textAlign: "start",
                  backgroundColor: "gray",
                  margin: "1px 2px",
                  padding: "2px 5px",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              >
               typing...
              </p>
            </div>}
        </div>
        <InputBox onClickHandler={handleAddInputData} />
      </div>
    </div>
  );
}

export default ChatModel;
