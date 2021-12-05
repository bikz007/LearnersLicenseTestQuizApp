import React from "react";
import Question from "./question";
import "../styles/question.css";
import CheckAnswer from "./checkanswer";
import DisplayResult from "./displayresult";
const TIME_FOR_EACH_QUESTION = 30;
const TOTAL_NUM_QUESTIONS_PER_TEST = 10;
class GenerateRandomQuesionIdx extends React.Component {
  //constructor
  constructor(props) {
    super(props);
    this.state = {
      totalNumQues: 0,
      randomQuestionIdx: undefined,
      ques: [],
      results: [],
      QuestionLoaded: false,
      DataIsLoaded: false,
      numOfQuesAppeared: 1,
      selectedAnswer: null,
      secondsCount: 0,
      disableOptions: false,
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
    document.title = "Drivers Licence Quiz";
    this.fetchAllData();
    this.timerUpdateInterval = setInterval(
      () =>
        this.setState({
          secondsCount: (this.state.secondsCount + 1) % TIME_FOR_EACH_QUESTION,
        }),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerUpdateInterval);
  }

  updateQuestion() {
    const oldIdx = this.state.randomQuestionIdx;
    var newIdx = this.state.randomQuestionIdx;
    while (oldIdx === newIdx) {
      newIdx = Math.floor(Math.random() * this.state.totalNumQues);
      if (oldIdx !== newIdx) {
        break;
      }
    }
    // eslint-disable-next-line
    this.state.randomQuestionIdx = newIdx;
    this.fetchQuestion(this.state.randomQuestionIdx);
    this.setState({
      secondsCount: 0,
      numOfQuesAppeared: this.state.numOfQuesAppeared + 1,
      disableOptions: false,
      selectedAnswer: null,
    });
  }

  startNewQuiz() {
    // eslint-disable-next-line
    this.state.numOfQuesAppeared = 0;
    // eslint-disable-next-line
    this.state.results.length = 0;
    this.setState({
      secondsCount: 0,
    });
    this.updateQuestion();
  }

  selectedAnswerChange(evt) {
    const answerObj = {
      qNumber: this.state.ques.qNumber,
      answerSelected: evt.target.value,
      correctAnswer: this.state.ques.answer,
      isCorrect:
        parseInt(evt.target.value) === parseInt(this.state.ques.answer),
    };
    this.setState({
      results: [...this.state.results, answerObj],
      disableOptions: true,
      selectedAnswer: evt.target.value,
    });
  }

  handleSaveToPC() {
    const jsonData = this.state.results;
    const currDate = new Date();
    const filename =
      "results_" +
      currDate.getFullYear() +
      "_" +
      (currDate.getMonth() + 1) +
      "_" +
      currDate.getDate() +
      "_" +
      currDate.getHours() +
      "_" +
      currDate.getMinutes();
    const fileData = JSON.stringify(jsonData, null, 4);
    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `${filename}.json`;
    link.href = url;
    link.click();
  }

  render() {
    const { QuestionLoaded, numOfQuesAppeared } = this.state;
    if (!QuestionLoaded) {
      return <div>Loading Question...</div>;
    } else {
      if (numOfQuesAppeared === TOTAL_NUM_QUESTIONS_PER_TEST + 1) {
        return (
          <div>
            <DisplayResult results={this.state.results} />
            <button onClick={this.handleSaveToPC.bind(this)}>
              Save results
            </button>
            <button onClick={this.startNewQuiz.bind(this)}>
              Start next quiz
            </button>
          </div>
        );
      } else {
        return (
          <div className="GenerateRandomQuesionIdx container">
            <div>
              <button onClick={this.updateQuestion.bind(this)}>
                Next question
              </button>
            </div>
            <div>
              <p>Num of questions so far: {numOfQuesAppeared}</p>
            </div>
            <h1>Timer: {TIME_FOR_EACH_QUESTION - this.state.secondsCount}</h1>
            <Question
              ques={this.state.ques}
              disableOptions={this.state.disableOptions}
              onOptionSelect={this.selectedAnswerChange.bind(this)}
            />
            <CheckAnswer
              selectedAnswer={this.state.selectedAnswer}
              correctAnswer={this.state.ques.answer}
            />
          </div>
        );
      }
    }
  }
}

export default GenerateRandomQuesionIdx;
