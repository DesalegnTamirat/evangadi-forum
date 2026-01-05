// List of questions
import QuestionItem from "./QuestionItem";

const QuestionList_homepage = ({ questions, user, onDelete }) => {
  if (!questions.length) {
    return <p>No questions found.</p>;
  }

  return (
    <>
      {questions.map((q) => (
        <QuestionItem
          key={q.questionid}
          questions={q}
          user={user}
          onDelete={onDelete}
        />
      ))}
    </>
  );
};

export default QuestionList_homepage;
