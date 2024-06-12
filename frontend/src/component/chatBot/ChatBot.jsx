import React, { useEffect, useMemo, useState } from "react";
import FloatingIcon from "./Float Icon/FloatingIcon";
import ChatModel from "./ChatModel/ChatModel";
import { io } from "socket.io-client";


function ChatBot() {
  const [showChatModel, setShowChatModel] = useState(false);
  const [ChatData, setChatData] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isRead,setIsRead] = useState(false);
  const [userIsTyping,setUserIsTyping] = useState(false);

  const showChatModelHandler = () => {
    setShowChatModel((prev) => !prev);
  };

  useEffect(() => {
    const userId = localStorage.getItem('chatBotUserId');
    const newSocket = io("http://localhost:4000", {
      query: {
        id: userId
      }
    });
    newSocket.on("Pre_Conversation",(allChat)=>{
      console.log(allChat);
      setChatData(allChat);
    })
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("client user connected", newSocket.id);
    });
    return () => {
      newSocket.disconnect();
    };
  }, []);
  
  useEffect(()=>{
    socket?.on("Greeting", (newMessage) => {
      setChatData((prev) => [...prev, newMessage]);
    });
    socket?.on("Assign_Id",(userId)=>{
      localStorage.setItem('chatBotUserId', userId);
    })
    socket?.on("Read_Message",(data)=>{
      setIsRead(true);
    })
    socket?.on("Is_Typing",(data)=>{
      setUserIsTyping(true);
    })
    socket?.on("Reply_Message",(newMessage)=>{
      setUserIsTyping(false);
      setIsRead(false);
      setChatData((prev) => [...prev, newMessage]);
    })

  },[socket])

  const countUnread = useMemo(() => {
    return ChatData.reduce((count, data) => count + (data.isUnread ? 1 : 0), 0);
  }, [ChatData]);

  useEffect(() => {
    if (showChatModel) {
      setChatData((prevData) =>
        prevData.map((data) => ({ ...data, isUnread: false }))
      );
    }
    }, [showChatModel]);

     
  const handleInputMessage = (newMessage) => {
    socket?.emit("New_Message", newMessage);
    setChatData((prev) => [...prev, newMessage]);
  };

  return (
    <div>
      {showChatModel && (
        <ChatModel
          chatData={ChatData}
          handleAddInputData={handleInputMessage}
          isRead={isRead}
          userIsTyping={userIsTyping}
        />
      )}
      <FloatingIcon
        onClickHandler={showChatModelHandler}
        unReadMsg={countUnread}
      />
    </div>
  );
}

export default ChatBot;
