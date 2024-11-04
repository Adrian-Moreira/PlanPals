//Creates a button which when clicked shows or hides the comment box for a given object
//objectId must be supplied to show the correct comment box

import React, { useState } from 'react';
import { BsChatFill } from "react-icons/bs";
import CommentBox from './commentBox';

//id is the objectId, type is the object type
const CommentButton = ({id, type}) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(prev => !prev);
  };

  return (
    <div id="comments" style={{display:"inline-block"}}>

        <button className="Icon-button" onClick={toggleVisibility}>
            <BsChatFill/>
        </button>

        <div id="commentVisibility" style={{display: isVisible ? "flex" : "none", float:"right"}}>
            <CommentBox objectId={id} objectType={type}/>
        </div>
    </div>
  );
};

export default CommentButton;