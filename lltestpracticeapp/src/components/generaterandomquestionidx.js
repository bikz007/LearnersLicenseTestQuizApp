import React from "react";
import Question from "./question";
class GenerateRandomQuesionIdx extends React.Component {
  //constructor
  constructor(props) {
    super(props);
    this.state = {
      totalNumQues : 0,
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
  }

  render() {
    const { totalNumQues, DataIsLoaded } = this.state;
    if (!DataIsLoaded) {
      return <div>Loading questions...</div>;
    } else {
        const randomQuestionIdx = Math.floor(Math.random() * totalNumQues);
      return (
        <Question qIdx={randomQuestionIdx} />
      );
    }
  }
}

export default GenerateRandomQuesionIdx;
