// Header section: Ask button + welcome message
import { Link } from "react-router-dom";
import classes from "../home.module.css";

const Header_homepage = ({ user }) => {
  return (
    <div className={classes.header}>
      <Link to="/ask" className={classes.askBtn}>
        Ask Question
      </Link>
      <p>
        Welcome : <strong>{user?.username}</strong>
      </p>
    </div>
  );
};

export default Header_homepage;
