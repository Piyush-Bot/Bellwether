import React from "react";
import { Link } from "react-router-dom";

const IconButton = ({
  text,
  lextIcon,
  rightIcon,
  containerStyle,
  textStyle,
}) => {
  return (
    <Link
      style={{
        ...containerStyle,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <h1 style={{ ...textStyle }}>{text}</h1>
      <h1 style={{ ...textStyle }}>{text}</h1>
    </Link>
  );
};

export default IconButton;
