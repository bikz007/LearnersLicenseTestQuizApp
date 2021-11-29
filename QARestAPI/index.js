const QUES_ANS_DB = require("../QuestionsAnswersDB.json");
const TOTAL_NUM_OF_QUESTIONS = QUES_ANS_DB.length;
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/totalitems", (req, res) => {
  res.status(200);
  res.json(`${TOTAL_NUM_OF_QUESTIONS}`);
});

app.get("/qna/:idx", (req, res) => {
  const idx = parseInt(req.params.idx);
  if (idx < TOTAL_NUM_OF_QUESTIONS && idx >= 0) {
    res.status(200);
    res.json(QUES_ANS_DB[idx]);
  } else {
    res.status(404);
    res.json({ message: "Invalid index, result not found." });
  }
});
// in unix export QNA_API_PORT=<value>
app.listen(process.env.QNA_API_PORT, () => {
  console.info("QNA API running");
});
