import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import axios from "../../Api/axiosConfig";
import { useState } from "react";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import "./QuestionCard.css";

function QuestionCard({ Questions }) {
  const { title, description, username, questionid, vote_count, user_vote, reputation, is_bookmarked } = Questions;
  const [currentVoteCount, setCurrentVoteCount] = useState(vote_count || 0);
  const [currentUserVote, setCurrentUserVote] = useState(user_vote || 0);
  const [isBookmarked, setIsBookmarked] = useState(is_bookmarked || false);

  const handleVote = async (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) return;

    // Optimistic Update
    const originalVote = currentUserVote;
    const originalCount = currentVoteCount;

    let newVote = 0;
    let newCount = originalCount;

    if (originalVote === 1) {
      newVote = 0;
      newCount = originalCount - 1;
    } else {
      newVote = 1;
      newCount = originalCount + 1;
    }

    setCurrentUserVote(newVote);
    setCurrentVoteCount(newCount);

    try {
      await axios.post(
        `/vote/question/${questionid}`,
        { vote_type: 1 }, // Always send 1 for 'Like' toggle logic
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Backend handles toggle internally (Vote added/removed)
    } catch (error) {
      console.error("Voting error:", error);
      // Revert on error
      setCurrentUserVote(originalVote);
      setCurrentVoteCount(originalCount);
    }
  };

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) return;

    const original = isBookmarked;
    setIsBookmarked(!original);

    try {
      await axios.post(
        `/bookmark/toggle/${questionid}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Bookmark error:", error);
      setIsBookmarked(original);
      toast.error("Failed to update bookmark");
    }
  };

  const getBadge = (rep) => {
    if (rep >= 100) return { label: "Gold", color: "#ffd700" };
    if (rep >= 50) return { label: "Silver", color: "#c0c0c0" };
    if (rep >= 10) return { label: "Bronze", color: "#cd7f32" };
    return null;
  };

  const badge = getBadge(reputation || 0);

  return (
    <div className="question_card_wrapper">
      <div className="vote_container">
        <button 
          className={`like_btn ${currentUserVote === 1 ? 'active' : ''}`}
          onClick={(e) => handleVote(e, 1)}
          title={currentUserVote === 1 ? "Unlike" : "Like"}
        >
          <span className="heart_icon">{currentUserVote === 1 ? "❤️" : "🤍"}</span>
          <span className="vote_count">{currentVoteCount}</span>
        </button>
        <button 
          className={`bookmark_btn ${isBookmarked ? 'active' : ''}`}
          onClick={handleBookmark}
          title={isBookmarked ? "Remove Bookmark" : "Save Question"}
        >
          {isBookmarked ? <BsBookmarkFill /> : <BsBookmark />}
        </button>
      </div>
      
      <div className="user_container">
        <Link to={`/answer/${questionid}`} className="link">
          <div className="profile_container">
            <div className="user_icon">
              <AccountCircleIcon />
              <p>{username}</p>
              <div className="rep_badge_container">
                <span className="reputation_score">{reputation || 0} pts</span>
                {badge && (
                  <span 
                    className={`badge ${badge.label.toLowerCase()}`}
                    title={`${badge.label} Badge`}
                  >
                    ●
                  </span>
                )}
              </div>
            </div>
            <p className="question">{title}</p>
            <div className="angle_icon">
              <ChevronRightIcon />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default QuestionCard;
