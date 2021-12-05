import React from "react";

const CheckAnswer = (props) => {
  const { selectedAnswer, correctAnswer } = props;
  if (selectedAnswer !== null) {
    if (selectedAnswer === correctAnswer) {
      return <div className="correct-answer">Correct answer.</div>;
    } else {
      return <div className="wrong-answer">Oops! Wrong answer.</div>;
    }
  } else {
    return <div></div>;
  }
};
export default CheckAnswer;
