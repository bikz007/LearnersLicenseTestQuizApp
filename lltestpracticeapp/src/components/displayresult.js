import React from "react";

const DisplayResult = (props) => {
  const { results } = props;
  document.title = "Results";
  if (results.length > 0) {
    return (
      <div>
        {results.map((item) => (
          <ol key={item.qNumber}>
            Question number: {item.qNumber}, Answer Selected:{" "}
            {item.answerSelected}, Correct Answer: {item.correctAnswer}
          </ol>
        ))}
      </div>
    );
  } else {
    return <div>No questions attempted!</div>;
  }
};
export default DisplayResult;
