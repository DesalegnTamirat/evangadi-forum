import React, {
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";

import { AppState } from "../../App";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../Api/axiosConfig";
import classes from "./home.module.css";
import { MdEdit, MdDelete } from "react-icons/md";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import QuestionCard from "./QuestionCard";
import SkeletonLoader from "../../components/Skeleton/SkeletonLoader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "../../Data/data";

import "./Dashboard.css";
import { 
  MdSearch, 
  MdAdd, 
  MdQuestionAnswer, 
  MdQuestionMark,
  MdThumbUp,
  MdStars
} from "react-icons/md";

const Home = () => {
  const { user } = useContext(AppState);
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [stats, setStats] = useState({ questions: 0, users: 0, answers: 0, likes: 0 });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [questionsRes, statsRes] = await Promise.all([
        axios.get(`/question?search=${debouncedSearchQuery}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/question/stats", {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);
      setQuestions(questionsRes.data?.questions || []);
      setStats(statsRes.data || { questions: 0, users: 0, answers: 0, likes: 0 });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [token, debouncedSearchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const searchText = debouncedSearchQuery.toLowerCase();
      return (
        q.title.toLowerCase().includes(searchText) ||
        q.username.toLowerCase().includes(searchText) ||
        (q.tag || "").toLowerCase().includes(searchText)
      );
    });
  }, [questions, debouncedSearchQuery]);

  return (
    <section className="primary_container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <Link to="/askquestion" className="neon-btn">
          <MdAdd style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Post Question
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass-panel">
          <div className="stat-header">
            <span className="stat-icon"><MdQuestionMark /></span>
            <span>Total Questions</span>
          </div>
          <div className="stat-value">{stats.questions}</div>
          <div className="stat-label">Community discussions</div>
        </div>
        
        <div className="stat-card glass-panel">
          <div className="stat-header">
            <span className="stat-icon"><MdQuestionAnswer /></span>
            <span>Total Answers</span>
          </div>
          <div className="stat-value">{stats.answers}</div>
          <div className="stat-label">Contributions made</div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-header">
            <span className="stat-icon"><MdThumbUp /></span>
            <span>Total Likes</span>
          </div>
          <div className="stat-value">{stats.likes}</div>
          <div className="stat-label">From the community</div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-header">
            <span className="stat-icon"><MdStars /></span>
            <span>Total Members</span>
          </div>
          <div className="stat-value neon-text">{stats.users.toLocaleString()}</div>
          <div className="stat-label">Global standing</div>
        </div>
      </div>

      <div className="reputation-section glass-panel">
        <h3 className="reputation-title">User Reputation</h3>
        <div className="badges-container">
          {user?.badges?.length > 0 ? (
            user.badges.map(badge => (
              <div key={badge} className="badge-item">
                <MdStars color="var(--neon-blue)" />
                {badge}
              </div>
            ))
          ) : (
            <p className="no-badges">Earn reputation to unlock badges!</p>
          )}
        </div>
      </div>

      <div className="recent-questions-container">
        <div className="recent-questions-header">
          <h2 className="recent-questions-title">Recent Questions</h2>
          <div className="filter-controls">
            <div className="search-input-wrapper">
              <MdSearch className="search-icon" />
              <input
                type="text"
                className="dashboard-search"
                placeholder="Search Community..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <SkeletonLoader type="card" count={3} />
        ) : (
          <div className="questions-list">
            {filteredQuestions.map((q) => (
              <QuestionCard key={q.questionid} Questions={q} />
            ))}
            {filteredQuestions.length === 0 && (
              <p className="empty-message">No questions found matching your search.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Home;
