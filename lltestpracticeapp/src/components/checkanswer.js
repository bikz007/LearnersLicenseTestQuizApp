import React from "react";

const CheckAnswer = (props) => {
  const { selectedAnswer, correctAnswer } = props;
  if (selectedAnswer !== null) {
    if (selectedAnswer === correctAnswer) {
      return <div className="answer correct-answer">Correct!</div>;
    } else {
      return <div className="answer wrong-answer">Oops!</div>;
    }
  } else {
    return <div></div>;
  }
};
export default CheckAnswer;
