import { Link } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "./QuestionCard.css";

function QuestionCard({ Questions }) {
  const { 
    title, 
    username, 
    questionid, 
    answer_count, 
    views, 
    created_at, 
    tag,
    profile_picture 
  } = Questions;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.abs(now - date) / 1000;
    
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <Link to={`/answer/${questionid}`} className="question-card glass-panel">
      <div className="question-main">
        <h3 className="question-title-link">{title}</h3>
        
        <div className="question-meta-row">
          <div className="avatars-row">
            <div className="avatar-mini">
              {profile_picture ? (
                <img src={profile_picture} alt={username} />
              ) : (
                <AccountCircleIcon style={{ color: 'var(--neon-blue)' }} />
              )}
            </div>
            {/* Placeholder for other contributors if available */}
            <div className="avatar-mini" style={{ background: 'rgba(255,255,255,0.05)', fontSize: '10px' }}>
              +{Math.floor(Math.random() * 5)}
            </div>
          </div>

          <div className="tags-row">
            {tag && tag.split(',').map(t => (
              <span key={t} className="tag-pill">#{t.trim()}</span>
            ))}
            {!tag && <span className="tag-pill">#Discussion</span>}
          </div>
        </div>
      </div>

      <div className="question-stats-right">
        <div className="stat-item-vertical">
          <span className="stat-item-value">{answer_count || 0}</span>
          <span className="stat-item-label">Replies</span>
        </div>
        <div className="stat-item-vertical">
          <span className="stat-item-value">{Questions.vote_count || 0}</span>
          <span className="stat-item-label">Votes</span>
        </div>
        <div className="stat-item-vertical">
          <span className="stat-item-value">{views || 0}</span>
          <span className="stat-item-label">Views</span>
        </div>
        <div className="time-ago-col">
          {formatDate(created_at)}
        </div>
      </div>
    </Link>
  );
}

export default QuestionCard;
