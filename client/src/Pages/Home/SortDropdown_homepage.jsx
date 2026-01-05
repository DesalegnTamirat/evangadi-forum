// Sorting dropdown component
import classes from "../home.module.css";

const SortDropdown_homepage = ({ value, onChange }) => {
  return (
    <select
      className={classes.sort}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="Most Recent">Most Recent</option>
      <option value="Most Popular">Most Popular</option>
    </select>
  );
};

export default SortDropdown_homepage;
