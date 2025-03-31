import React from "react";
import {
  TailSpin,
  BallTriangle,
  Circles,
  MutatingDots,
  ThreeDots,
  Oval,
} from "react-loader-spinner";
import "./FullScreenLoader.scss"; // Import CSS for styling

const FullScreenLoader = () => {
  return (
    <div className="fullscreen-loader">
      <ThreeDots
        height="110"
        width="110"
        color="#0000FF"
        radius="1"
        visible={true}
        strokeWidth={2}
      />
    </div>
  );
};

export default FullScreenLoader;
