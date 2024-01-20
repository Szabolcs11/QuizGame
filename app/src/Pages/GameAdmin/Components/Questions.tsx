import Correct from "../../../assets/svgs/Correct";
import Incorrect from "../../../assets/svgs/Incorrect";
import { QuestionType } from "../../../types";

interface QuestionProps {
  Questions: QuestionType[];
  CurrentQuestionID: number;
  Answers: AnswersType[];
}

type AnswersType = {
  PlayerID: number;
  PlayerName: string;
  QuestionID: number;
  AnswerID: number;
};

function Questions({ Questions, CurrentQuestionID, Answers }: QuestionProps) {
  console.log(Answers);
  return (
    <div className="apquestionscontainer">
      {Questions.map((question) => (
        <div
          className={`apquestioncontainer ${question.Status == "answered" ? "answered" : ""} ${
            question.ID == CurrentQuestionID ? "current" : ""
          }`}
          key={question.ID}
        >
          <div className="smalltitle">{question.OrderNum + "# " + question.Text}</div>
          {question.Answers.map((answer) => (
            <div key={answer.ID}>
              <div className="d-flex gap-2">
                <div className="question-answer-text">{answer.Text}</div>

                <div>{answer.IsCorrect ? <Correct /> : <Incorrect />}</div>

                {Answers.map((e) => {
                  if (e.AnswerID == answer.ID) {
                    return (
                      <div className="question-player-answered" key={e.PlayerID}>
                        {e.PlayerName}
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Questions;
