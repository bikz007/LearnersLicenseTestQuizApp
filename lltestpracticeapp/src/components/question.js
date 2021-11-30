import React from "react";
import "../styles/question.css";

class Question extends React.Component {
  //constructor
  constructor(props) {
    super(props);
    this.state = {
      ques: [],
      DataIsLoaded: false,
    };
  }
  // componentDidMount is used
  // to fetch the data while the
  // component finished mounting
  componentDidMount() {
    const { qIdx } = this.props;
    fetch(`http://localhost:4000/qna/${qIdx}`)
      .then((res) => res.json())
      .then((resJson) => {
        this.setState({ ques: resJson, DataIsLoaded: true });
      })
      .catch((err) => console.error(`Error: ${err}`));
  }

  render() {
    const { ques, DataIsLoaded } = this.state;
    if (!DataIsLoaded) {
      return <div>Loading question...</div>;
    } else {
      return (
        <div className="question container">
          <div className="question-body">
            <main>
              <p className="question-text">
                Q-{ques.qNumber}: {ques.question}
              </p>
              <ul className="question-options">
                <li>{ques.options["1"]}</li>
                <li>{ques.options["2"]}</li>
                <li>{ques.options["3"]}</li>
              </ul>
            </main>
          </div>
        </div>
      );
    }
  }
}

export default Question;
