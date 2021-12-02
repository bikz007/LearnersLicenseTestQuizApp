import React from "react";
import Question from "./question";
const NEXT_QUESTION_INTERVAL = 30;
class GenerateRandomQuesionIdx extends React.Component {
  //constructor
  constructor(props) {
    super(props);
    this.randomQuestionIdx = 0;
    this.state = {
      totalNumQues: 0,
      DataIsLoaded: false,
    };
  }
  // componentDidMount is used
  // to fetch the data while the
  // component finished mounting
  componentDidMount() {
    fetch(`http://localhost:4000/totalitems`)
      .then((res) => res.json())
      .then((resJson) => {
        this.setState({ totalNumQues: parseInt(resJson), DataIsLoaded: true });
      })
      .catch((err) => console.error(`Error: ${err}`));
    this.updateTimer = setInterval(
      () => this.updateQuestion(),
      NEXT_QUESTION_INTERVAL * 1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.updateTimer);
  }

  updateQuestion() {
    const { totalNumQues, DataIsLoaded } = this.state;
    if (DataIsLoaded) {
      this.randomQuestionIdx = Math.floor(Math.random() * totalNumQues);
    } else {
      this.randomQuestionIdx = 0;
    }
    this.forceUpdate();
  }

  render() {
    const { DataIsLoaded } = this.state;
    if (!DataIsLoaded) {
      return <div>Loading questions...</div>;
    } else {
      return (
        <Question
          qIdx={this.randomQuestionIdx}
          updateInterVal={NEXT_QUESTION_INTERVAL}
        />
      );
    }
  }
}

export default GenerateRandomQuesionIdx;
