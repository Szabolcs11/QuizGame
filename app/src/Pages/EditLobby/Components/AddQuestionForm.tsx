import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { addQuestionSchema } from "../../../utils";

interface AddQuestionFormProps {
  handleAttachmentChange: React.ChangeEventHandler<HTMLInputElement>;
  handleAddQuestion: (data: any) => void;
  attachmentUrl: string;
}

interface FormData {
  question: string;
  answera: string;
  answerb: string;
  answerc: string;
  answerd: string;
  questiontype: string;
  correctanswer: string;
}

function AddQuestionForm({ handleAttachmentChange, handleAddQuestion, attachmentUrl }: AddQuestionFormProps) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(addQuestionSchema),
  });

  const fileRef = React.useRef<HTMLInputElement>(null);

  const handleSubmitQuestion = async (data: FormData) => {
    reset();
    if (fileRef.current) {
      const fileInput = fileRef.current as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
        handleAttachmentChange({
          target: fileInput,
        } as React.ChangeEvent<HTMLInputElement>);
      }
    }
    await handleAddQuestion(data);
  };
  return (
    <div className="addquestioncontainer">
      <div className="subtitle" style={{ marginTop: 8 }}>
        Add question
      </div>
      <div>
        <form onSubmit={handleSubmit(handleSubmitQuestion)} className="formcontainer">
          <Controller
            name="question"
            control={control}
            defaultValue=""
            render={({ field }) => <input {...field} type="text" className="input" placeholder="Question" />}
          />
          {errors.question?.message != undefined ? <p className="error">{errors.question?.message}</p> : <></>}
          <Controller
            name="answera"
            control={control}
            defaultValue=""
            render={({ field }) => <input {...field} type="text" className="input" placeholder="Answer A" />}
          />
          {errors.answera?.message != undefined ? <p className="error">{errors.answera?.message}</p> : <></>}
          <Controller
            name="answerb"
            control={control}
            defaultValue=""
            render={({ field }) => <input {...field} type="text" className="input" placeholder="Answer B" />}
          />
          {errors.answerb?.message != undefined ? <p className="error">{errors.answerb?.message}</p> : <></>}
          <Controller
            name="answerc"
            control={control}
            defaultValue=""
            render={({ field }) => <input {...field} type="text" className="input" placeholder="Answer C" />}
          />
          {errors.answerc?.message != undefined ? <p className="error">{errors.answerc?.message}</p> : <></>}
          <Controller
            name="answerd"
            control={control}
            defaultValue=""
            render={({ field }) => <input {...field} type="text" className="input" placeholder="Answer D" />}
          />
          {errors.answerd?.message != undefined ? <p className="error">{errors.answerd?.message}</p> : <></>}
          <Controller
            name="questiontype"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <select {...field} name="questiontype" className="input">
                <option value="none">Kérdés típus</option>
                <option value="text">Szöveg</option>
                <option value="image">Kép</option>
                <option value="sound">Hang</option>
              </select>
            )}
          />
          {errors.questiontype?.message != undefined ? <p className="error">{errors.questiontype?.message}</p> : <></>}
          <Controller
            name="correctanswer"
            control={control}
            defaultValue="none"
            render={({ field }) => (
              <select {...field} name="correctanswer" className="input">
                <option value="none">Helyes válasz</option>
                <option value={watch("answera")}>{watch("answera")}</option>
                <option value={watch("answerb")}>{watch("answerb")}</option>
                <option value={watch("answerc")}>{watch("answerc")}</option>
                <option value={watch("answerd")}>{watch("answerd")}</option>
              </select>
            )}
          />
          <input type="file" ref={fileRef} onChange={handleAttachmentChange} accept=".png, .jpg, .jpeg" />
          <input type="submit" placeholder="Kérdés hozzáadása" className="btnpr" />
        </form>
      </div>
    </div>
  );
}

export default AddQuestionForm;
