import { Link } from 'react-router-dom';

const QuestionItem = ({ question }) => {
  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

  return (
    <div className="question-item">
      <div className="question-content">
        <Link
          to={`/question/${question.questionid}`}
          className="question-title"
        >
          {question.title}
        </Link>

        <p className="question-description">
          {question.description.length > 200
            ? `${question.description.slice(0, 200)}...`
            : question.description}
        </p>

        <div className="question-meta">
          <span>
            by {question.firstname} {question.lastname}
          </span>
          <span>
            {question.answer_count} answers
          </span>
          <span>{formatDate(question.created_at)}</span>
        </div>
      </div>
    </div>
  );
};

export default QuestionItem;
