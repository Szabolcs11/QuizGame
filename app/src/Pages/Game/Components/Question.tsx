import { Fragment } from "react";
import { ENDPOINTS } from "../../../constans";
import { PlayerAnswers, QuestionType } from "../../../types";

interface QuestionProps {
  Question: QuestionType;
  handleAnswer: (AnswerID: number) => void;
  QuestionEnded: boolean;
  CorrectAnswerID?: number;
  PlayerAnswers: PlayerAnswers[];
  SelectedAnswerID?: number;
}

function Question({
  Question,
  handleAnswer,
  QuestionEnded,
  CorrectAnswerID,
  PlayerAnswers,
  SelectedAnswerID,
}: QuestionProps) {
  return (
    <div className="questioncontainer">
      <div className="question">
        <div className="question-title">{Question?.Text}</div>
        <div className="question-image">
          {Question?.AttachmentURL && (
            <img className="" src={ENDPOINTS.GET_FILE + Question?.AttachmentURL} alt="Question image" />
          )}
        </div>
        <div className="question-answers" style={{ marginTop: Question?.AttachmentURL ? 16 : 128 }}>
          {Question?.Answers.map((answer) => (
            <Fragment key={answer.ID}>
              <div
                onClick={() => handleAnswer(answer.ID)}
                key={answer.ID}
                className={`question-answer ${answer.ID == CorrectAnswerID ? "green" : QuestionEnded ? "red" : ""} ${
                  answer.ID == SelectedAnswerID ? "selected" : ""
                }`}
              >
                {answer.Text}
              </div>
              <div className="playeranswerscontainer">
                {PlayerAnswers?.map((playeranswer) => (
                  <>{playeranswer.AnswerID == answer.ID && <div>{playeranswer.PlayerName}</div>}</>
                ))}
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Question;
