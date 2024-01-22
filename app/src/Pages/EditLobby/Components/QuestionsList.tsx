import React, { useEffect, useState } from "react";
import DraggableQuestion from "./DraggableQuestion";
import { QuestionType } from "../../../types";
import { handleDeleteQuestion } from "../EditLobby";

interface QuestionsListProps {
  questions: QuestionType[];
  onQuestionOrderChange: (updatedOrder: QuestionType[]) => void;
}

const QuestionsList: React.FC<QuestionsListProps> = ({ questions, onQuestionOrderChange }) => {
  const [orderedQuestions, setOrderedQuestions] = useState(questions);

  const moveQuestion = (fromIndex: number, toIndex: number) => {
    const updatedQuestions = [...orderedQuestions];
    const [movedQuestion] = updatedQuestions.splice(fromIndex, 1);
    updatedQuestions.splice(toIndex, 0, movedQuestion);
    setOrderedQuestions(updatedQuestions);
  };

  const deleteQuestion = (id: number, index: number) => {
    const updatedQuestions = [...orderedQuestions];
    updatedQuestions.splice(index, 1);
    setOrderedQuestions(updatedQuestions);
    handleDeleteQuestion(id);
    onQuestionOrderChange(updatedQuestions);
  };

  useEffect(() => {
    setOrderedQuestions(questions);
  }, [questions]);

  return (
    <div className="questionscontainer">
      <div className="subtitle">Kérdések:</div>
      {orderedQuestions.map((question, index) => {
        return (
          <DraggableQuestion
            deleteQuestion={(id: number) => {
              deleteQuestion(id, index);
            }}
            key={question.ID}
            id={question.ID}
            text={question.Text}
            index={index}
            moveQuestion={moveQuestion}
            onDrop={() => onQuestionOrderChange(orderedQuestions)}
          />
        );
      })}
    </div>
  );
};

export default QuestionsList;
