import React from "react";
import "../styles/common.css";
import ImageRender from "./imagerender";
class Question extends React.Component {
  //constructor
  constructor(props) {
    super(props);
    this.state = {};
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {}

  render() {
    const { ques,disableOptions } = this.props;
    return (
      <div className="question">
        <div className="question-body">
          <main>
            <p className="question-text">
              Q-{ques.qNumber}: {ques.question}
            </p>
            <ImageRender imgUrl={ques.imageUrl} />
            <form onSubmit={this.handleSubmit} className="question-options">
              <legend>Choose one of these three options:</legend>
              <input
                id="option-one"
                type="radio"
                name="answer"
                value={1}
                disabled={disableOptions}
                onClick={this.props.onOptionSelect}
              />
              <label htmlFor="option-one">{ques.options[1]}</label>
              <br />
              <input
                id="option-two"
                type="radio"
                name="answer"
                value={2}
                disabled={disableOptions}
                onClick={this.props.onOptionSelect}
              />
              <label htmlFor="option-two">{ques.options[2]}</label>
              <br />
              <input
                id="option-three"
                type="radio"
                name="answer"
                value={3}
                disabled={disableOptions}
                onClick={this.props.onOptionSelect}
              />
              <label htmlFor="option-three">{ques.options[3]}</label>
            </form>
          </main>
        </div>
      </div>
    );
  }
}

export default Question;
