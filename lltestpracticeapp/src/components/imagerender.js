import React from "react";

const ImageRender = (props) => {
  const { imgUrl } = props;
  if (imgUrl !== null) {
    return (
      <div>
        <img alt="traffic sign" src={imgUrl} height={200} width={200}></img>
      </div>
    );
  } else {
    return <div></div>;
  }
};
export default ImageRender;
