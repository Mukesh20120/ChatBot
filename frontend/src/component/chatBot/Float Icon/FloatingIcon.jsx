import React from "react";
import './FloatingIcon.css';

function FloatingIcon({onClickHandler,unReadMsg}) {
  
  return (
    <div onClick={onClickHandler}>
      <div className="floatingCover">
        <div className="innerCircle">{unReadMsg===0?"":unReadMsg}</div>
      </div>
    </div>
  );
}

export default FloatingIcon;
