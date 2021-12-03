import React from "react";
import Question from "./question";
import "../styles/question.css";
import CheckAnswer from "./checkanswer";
const NEXT_QUESTION_INTERVAL = 30;
class GenerateRandomQuesionIdx extends React.Component {
  //constructor
  constructor(props) {
    super(props);
    this.state = {
      totalNumQues: 0,
      randomQuestionIdx: undefined,
      ques: [],
      QuestionLoaded: false,
      DataIsLoaded: false,
      numOfQuesAppeared: 1,
      selectedAnswer: null,
      secondsCount: 0,
    };
  }

  async fetchAllData() {
    await fetch(`http://localhost:4000/totalitems`)
      .then((res) => res.json())
      .then((resJson) => {
        this.setState({
          totalNumQues: parseInt(resJson),
          DataIsLoaded: true,
        });
        this.setState({
          randomQuestionIdx: Math.floor(
            Math.random() * this.state.totalNumQues
          ),
        });
        this.fetchQuestion(this.state.randomQuestionIdx);
      })
      .catch((err) => console.error(`Error: ${err}`));
  }

  async fetchQuestion(qIdx) {
    await fetch(`http://localhost:4000/qna/${qIdx}`)
      .then((res) => res.json())
      .then((resJson) => {
        this.setState({ ques: resJson, QuestionLoaded: true });
      })
      .catch((err) => console.error(`Error: ${err}`));
  }

  // componentDidMount is used
  // to fetch the data while the
  // component finished mounting
  componentDidMount() {
    this.fetchAllData();
    this.timerUpdateInterval = setInterval(
      () => this.setState({ secondsCount: (this.state.secondsCount + 1) % NEXT_QUESTION_INTERVAL }),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerUpdateInterval);
  }

  updateQuestion() {
    this.setState({
      randomQuestionIdx: Math.floor(Math.random() * this.state.totalNumQues),
    });
    this.fetchQuestion(this.state.randomQuestionIdx);
    this.setState({
      secondsCount: 0,
      numOfQuesAppeared: this.state.numOfQuesAppeared + 1,
      selectedAnswer: null,
    });
  }

  selectedAnswerChange(evt) {
    this.setState({
      selectedAnswer: evt.target.value,
    });
  }

  render() {
    const { QuestionLoaded } = this.state;
    if (!QuestionLoaded) {
      return <div>Loading Question...</div>;
    } else {
      return (
        <div className="GenerateRandomQuesionIdx container">
          <p>Num of questions so far: {this.state.numOfQuesAppeared}</p>
          <h1>{this.state.secondsCount}</h1>
          <Question
            ques={this.state.ques}
            onOptionSelect={this.selectedAnswerChange.bind(this)}
          />
          <CheckAnswer
            selectedAnswer={this.state.selectedAnswer}
            correctAnswer={this.state.ques.answer}
          />
          <button onClick={this.updateQuestion.bind(this)}>
            Next question
          </button>
        </div>
      );
    }
  }
}

export default GenerateRandomQuesionIdx;
