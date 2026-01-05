// Single questions card
import { Link, useNavigate } from "react-router-dom";
import { MdEdit, MdDelete } from "react-icons/md";
import { IoIosContact } from "react-icons/io";
import classes from "../home.module.css";

const questionsItem_homepage = ({ questions, user, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className={classes.questionsItem}>
      <Link to={`/questions/${questionss.questionsid}`}>
        <IoIosContact size={60} />
        <p>{questionss.username}</p>
        <h4>{questionss.title}</h4>
      </Link>

      {/* Show edit/delete only for owner */}
      {user?.username === questionss.username && (
        <div className={classes.actions}>
          <MdEdit
            onClick={() =>
              navigate(`/edit-questions/${questions.questionsid}`)
            }
          />
          <MdDelete onClick={() => onDelete(questions.questionsid)} />
        </div>
      )}
    </div>
  );
};

export default questionsItem_homepage;
