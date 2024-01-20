import React from "react";
import { DragPreviewImage, useDrag, useDrop } from "react-dnd";
import IconTrashCan from "../../../assets/svgs/IconTrashCan";
import { handleDeleteQuestion } from "../EditLobby";

interface DraggedItem {
  id: number;
  index: number;
}

interface DraggableQuestionProps {
  id: number;
  text: string;
  index: number;
  moveQuestion: (fromIndex: number, toIndex: number) => void;
  onDrop: () => void;
  deleteQuestion: (id: number) => void;
}

const QuestionItemTypes = "QUESTION";

const DraggableQuestion: React.FC<DraggableQuestionProps> = ({
  id,
  text,
  index,
  moveQuestion,
  onDrop,
  deleteQuestion,
}) => {
  const [, ref, preview] = useDrag({
    type: QuestionItemTypes,
    item: { id, index },
  });

  const [, drop] = useDrop({
    accept: QuestionItemTypes,
    hover: (draggedItem: DraggedItem) => {
      if (draggedItem.index !== index) {
        moveQuestion(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
    drop: () => {
      onDrop();
    },
  });

  return (
    <>
      <DragPreviewImage connect={preview} src="/preview-image.png" />
      <div ref={(node) => ref(drop(node))} className="playercontainer">
        <div className="playername">{text}</div>
        <div className="trashcan" onClick={() => deleteQuestion(id)}>
          <IconTrashCan />
        </div>
      </div>
    </>
  );
};

export default DraggableQuestion;
