import React from "react";
import { QuestionType } from "../../../types";

interface QuestionProps {
  Question: QuestionType;
  handleAnswer: (AnswerID: number) => void;
}

function Question({ Question, handleAnswer }: QuestionProps) {
  return (
    <div className="questioncontainer">
      <div className="question">
        <div className="question-title">{Question?.Text}</div>
        <div className="question-answers">
          {Question?.Answers.map((answer) => (
            <div onClick={() => handleAnswer(answer.ID)} key={answer.ID} className="question-answer">
              {answer.Text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Question;
