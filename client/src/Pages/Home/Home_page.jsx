// ===================== Home Page =====================

// React hooks
import { useContext, useEffect, useState } from "react";

// Global app context
import { AppState } from "../../App";

// Axios instance
import axios from "../../axiosConfig";

// CSS module
import classes from "./home.module.css";

const Home_page = () => {
  // ===================== CONTEXT =====================
  const { user } = useContext(AppState);

  // ===================== AUTH =====================
  const token = localStorage.getItem("token");

  // ===================== STATE =====================
  const [questions, setQuestions] = useState([]);

  // ===================== FETCH QUESTIONS =====================
  const fetchQuestions = async () => {
    try {
      const { data } = await axios.get("/question", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions(data?.questions || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  // Fetch on mount
  useEffect(() => {
    if (token) fetchQuestions();
  }, [token]);

  // ===================== UI =====================
  return (
    <section>
      <div className={classes["main-container"]}>
        {/* Welcome section */}
        <div className={classes["welcome-section"]}>
          <a href="/ask" className={classes["ask-question-btn"]}>
            Ask Question
          </a>
          <div className={classes["welcome-message"]}>
            Welcome: <span className={classes["username"]}>{user?.username || 'Guest'}</span>
          </div>
        </div>

        {/* Search bar */}
        <div className={classes["search-bar"]}>
          <input
            className={classes["search-input"]}
            type="text"
            placeholder="Search questions..."
          />
        </div>

        {/* Questions list */}
        <div>
          {questions.length > 0 ? (
            questions.map((question) => (
              <div key={question.questionid} className={classes["questions-list"]}>
                <div className={classes["question-item"]}>
                  <div className={classes["user-info"]}>
                    <div className={classes["user-avatar"]}>👤</div>
                    <div className={classes["user"]}>
                      <p>{question.username}</p>
                    </div>
                    <div className={classes["question-text"]}>{question.title}</div>
                  </div>
                  <div className={classes["arrow"]}>→</div>
                </div>
              </div>
            ))
          ) : (
            <p>No questions found. Be the first to ask a question!</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Home_page;