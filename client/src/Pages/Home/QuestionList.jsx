import QuestionItem from './QuestionItem';

const QuestionList = ({ questions, onAskQuestion }) => {
  if (questions.length === 0) {
    return (
      <div className="no-questions">
        <p>No questions found.</p>
        <button onClick={onAskQuestion} className="ask-first-btn">
          Ask the First Question
        </button>
      </div>
    );
  }

  return (
    <div className="questions-list">
      {questions.map(question => (
        <QuestionItem
          key={question.questionid}
          question={question}
        />
      ))}
    </div>
  );
};

export default QuestionList;
