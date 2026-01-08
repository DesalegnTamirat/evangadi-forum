// List of questions
import QuestionItem_homepage from "./QuestionItem_homepage";

const QuestionList_homepage = ({ questions, user }) => {
  if (!questions.length) {
    return <p>No questions found.</p>;
  }

  return (
    <>
      {questions.map((q) => (
        <QuestionItem_homepage
          key={q.questionid}
          question={q}
          user={user}
        />
      ))}
    </>
  );
};

export default QuestionList_homepage;
