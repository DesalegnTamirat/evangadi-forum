import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../../Api/axiosConfig";
import { MdAdd, MdSearch, MdPeople, MdChatBubbleOutline } from "react-icons/md";
import QuestionCard from "../Home/QuestionCard";
import SkeletonLoader from "../../components/Skeleton/SkeletonLoader";
import styles from "./ForumDashboard.module.css";
import "../Home/Dashboard.css"; // Reuse card/search styles

const ForumDashboard = () => {
  const { id } = useParams();
  const [forum, setForum] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      
      // Fetch all categories to find details for this specific one
      const { data: categories } = await axios.get('/category/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const currentForum = categories.find(c => c.categoryid === parseInt(id));
      setForum(currentForum);

      // Fetch questions for this category
      const { data: qs } = await axios.get(`/category/${id}/questions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuestions(qs);
    } catch (error) {
      console.error("Error fetching forum data:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredQuestions = useMemo(() => {
    let result = questions.filter((q) => {
      const searchText = debouncedSearchQuery.toLowerCase();
      return (
        q.title.toLowerCase().includes(searchText) ||
        (q.user?.username || "").toLowerCase().includes(searchText) ||
        (q.tag || "").toLowerCase().includes(searchText)
      );
    });

    if (sortBy === 'oldest') {
      result.sort((a,b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (sortBy === 'views') {
      result.sort((a,b) => (b.views || 0) - (a.views || 0));
    } else {
      result.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
    }
    
    return result;
  }, [questions, debouncedSearchQuery, sortBy]);

  if (loading) {
    return (
      <div className="primary_container">
        <SkeletonLoader type="card" count={3} />
      </div>
    );
  }

  if (!forum) {
    return <div className="primary_container">Forum not found.</div>;
  }

  return (
    <div className="primary_container">
      <div className={styles.forumHeader}>
        <div className={styles.forumInfo}>
          <h1 className="neon-text">{forum.name}</h1>
          <p>{forum.description}</p>
          <div className={styles.stats}>
            <span><MdPeople /> {forum._count?.members || 0} Members</span>
            <span><MdChatBubbleOutline /> {forum._count?.questions || 0} Discussions</span>
          </div>
        </div>
        <Link to="/askquestion" className="primary_btn">
          <MdAdd size={20} /> Post to Space
        </Link>
      </div>

      <div className="recent-questions-container">
        <div className="recent-questions-header">
          <h2 className="recent-questions-title">Space Discussions</h2>
          <div className="filter-controls" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <div className="search-input-wrapper" style={{ flex: 1 }}>
              <MdSearch className="search-icon" />
              <input
                type="text"
                className="dashboard-search"
                placeholder={`Search in ${forum.name}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select 
              className="dashboard-search" 
              style={{ padding: '10px 15px', width: 'auto', borderRadius: '12px' }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
              <option value="views">Most Viewed</option>
            </select>
          </div>
        </div>

        <div className="questions-list">
          {filteredQuestions.map((q) => (
            <QuestionCard key={q.questionid} Questions={q} />
          ))}
          {filteredQuestions.length === 0 && (
            <p className="empty-message">No discussions found in this space.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForumDashboard;
