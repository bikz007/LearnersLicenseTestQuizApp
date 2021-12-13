import React from "react";
import Question from "./question";
import "../styles/common.css";
import CheckAnswer from "./checkanswer";
import DisplayResult from "./displayresult";
const TIME_FOR_EACH_QUESTION = 30;
const TOTAL_NUM_QUESTIONS_PER_TEST = 10;
const API_BASE_URL = "https://qadbapi.herokuapp.com"
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
      currentQuizQuesIdxs : [],
      disableOptions: false,
    };
  }

  async fetchAllData() {
    await fetch(`${API_BASE_URL}/totalitems`)
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
          currentQuizQuesIdxs : [...this.state.currentQuizQuesIdxs,this.state.randomQuestionIdx]
        });
        this.fetchQuestion(this.state.randomQuestionIdx);
      })
      .catch((err) => console.error(`Error: ${err}`));
  }

  async fetchQuestion(qIdx) {
    await fetch(`${API_BASE_URL}/qna/${qIdx}`)
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
    while ((oldIdx === newIdx) || (this.state.currentQuizQuesIdxs.includes(newIdx))) {
      newIdx = Math.floor(Math.random() * this.state.totalNumQues);
      if ((oldIdx !== newIdx) && !(this.state.currentQuizQuesIdxs.includes(newIdx))) {
        break;
      }
    }
    // eslint-disable-next-line
    this.state.randomQuestionIdx = newIdx;
    // eslint-disable-next-line
    this.state.currentQuizQuesIdxs.push(newIdx)
    console.info(newIdx);
    console.info(this.state.currentQuizQuesIdxs)
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
    // eslint-disable-next-line
    this.state.currentQuizQuesIdxs.length = 0;
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
    const jsonData = { "results" : this.state.results };
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
            <header className="container">
              <div className="save-results-btn">
                <button onClick={this.handleSaveToPC.bind(this)}>
                  Save results
                </button>
              </div>
              <div className="start-quiz-btn">
                <button onClick={this.startNewQuiz.bind(this)}>
                  Start next quiz
                </button>
              </div>
            </header>
          </div>
        );
      } else {
        return (
          <div>
            <header className="container">
              <div className="next-question-btn">
                <button onClick={this.updateQuestion.bind(this)}>
                  Next question
                </button>
              </div>
            </header>
            <div className="question-stat-container">
              <div className="container question-options-container">
                <Question
                  ques={this.state.ques}
                  disableOptions={this.state.disableOptions}
                  onOptionSelect={this.selectedAnswerChange.bind(this)}
                />
              </div>
              <div className="container stats-container">
                <div className="num-questions">
                  Question#
                  <hr />
                  <div>
                    {/*to pad zeroes as prefix*/}
                    <strong>{("0" + numOfQuesAppeared).slice(-2)}</strong>
                  </div>
                </div>
                <div className="timer">
                  Timer
                  <hr />
                  <div>
                    <strong>
                      {/*to pad zeroes as prefix*/}
                      {(
                        "0" +
                        (TIME_FOR_EACH_QUESTION - this.state.secondsCount)
                      ).slice(-2)}
                    </strong>
                  </div>
                </div>
                <CheckAnswer
                  selectedAnswer={this.state.selectedAnswer}
                  correctAnswer={this.state.ques.answer}
                />
              </div>
            </div>
          </div>
        );
      }
    }
  }
}

export default GenerateRandomQuesionIdx;
