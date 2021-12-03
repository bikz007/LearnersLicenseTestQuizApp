import React from "react";

const CheckAnswer = (props) => {
  const { selectedAnswer, correctAnswer } = props;
  if (selectedAnswer !== null) {
    if (selectedAnswer === correctAnswer) {
      return <div className="correct-answer">Correct answer</div>;
    } else {
      return (
        <div className="wrong-answer">
          Oops wrong answer! Correct answer: {correctAnswer}
        </div>
      );
    }
  } else {
    return <div className="un-answer">Answer not selected.</div>;
  }
};
export default CheckAnswer;
