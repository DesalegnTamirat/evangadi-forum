// Search input component
import classes from "./home.module.css";

const SearchBar_homepage = ({ value, onChange }) => {
  return (
    <input
      className={classes.search}
      type="text"
      placeholder="Search questions or users..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default SearchBar_homepage;
