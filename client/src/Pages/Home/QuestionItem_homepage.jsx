// Single question card
import { Link, useNavigate } from "react-router-dom";
import { MdEdit, MdDelete } from "react-icons/md";
import { IoIosContact } from "react-icons/io";
import classes from "./home.module.css";

const QuestionItem_homepage = ({ question, user }) => {
  const navigate = useNavigate();

  return (
    <div className={classes.questionItem}>
      <Link to={`/question/${question.questionid}`}>
        <IoIosContact size={60} />
        <p>{question.username}</p>
        <h4>{question.title}</h4>
      </Link>

      {/* Show edit/delete only for owner */}
      {user?.username === question.username && (
        <div className={classes.actions}>
          <MdEdit
            onClick={() =>
              navigate(`/edit-question/${question.questionid}`)
            }
          />
          <MdDelete onClick={() => console.log('Delete:', question.questionid)} />
        </div>
      )}
    </div>
  );
};

export default QuestionItem_homepage;
