// Input Component
import React from "react";
import PropTypes from "prop-types";

const Input = ({label,onInput,inputRef}) => {
  return <div  id = "input-box">
  <span id= "label">{label}</span>
  <input type ="text" onChange = {onInput} ref ={inputRef}/>
  </div>;
};

Input.propTypes ={
    label:PropTypes.string.isRequired,
    onInput:PropTypes.func,
    inputRef:PropTypes.object
}
export default Input;
