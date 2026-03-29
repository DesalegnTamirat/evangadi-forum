import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../Api/axiosConfig";
import styles from "./answer.module.css";
import { toast } from "react-toastify";
import { AppState } from "../../App";
import { MdEdit, MdDelete } from "react-icons/md";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { API_BASE_URL } from "../../Data/data";

function Answer() {
  const { question_id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { user } = useContext(AppState);

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [summary, setSummary] = useState("");
  const [summaryExpanded, setSummaryExpanded] = useState(false);
  const [answerText, setAnswerText] = useState("");
  const [expandedAnswerId, setExpandedAnswerId] = useState(null);

  const [answersLoading, setAnswersLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [confirmDeleteAnswerId, setConfirmDeleteAnswerId] = useState(null);
  const [error, setError] = useState(null);
  // ----------------------conditionality-------------------
  const MAX_LENGTH = 150;
  const ANSWER_LIMIT = 220;

  const shouldShowReadMore = () => summary.length > MAX_LENGTH;
  const getSummaryText = () =>
    summaryExpanded
      ? summary
      : summary.length > MAX_LENGTH
      ? summary.slice(0, MAX_LENGTH) + "..."
      : summary;

  const getAnswerText = (text, answerId) =>
    expandedAnswerId === answerId
      ? text
      : text.length > ANSWER_LIMIT
      ? text.slice(0, ANSWER_LIMIT) + "..."
      : text;

  const shouldShowAnswerReadMore = (text) => text.length > ANSWER_LIMIT;

  /* ---------------- AUTH CHECK ---------------- */
  useEffect(() => {
    if (!token) navigate("/login", { state: { from: "/ans" } });
  }, [token, navigate]);

  /* ---------------- FETCH QUESTION & ANSWERS ---------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setAnswersLoading(true);

        // Fetch question
        const questionRes = await axios.get(`/question/${question_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuestion(questionRes.data.question);

        // Fetch answers
        const answerRes = await axios.get(`/answer/${question_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnswers(answerRes.data.answers.reverse());
      } catch {
        setError("Failed to load question or answers.");
      } finally {
        setAnswersLoading(false);
      }
    };

    fetchData();
  }, [question_id, token]);

  /* ---------------- FETCH SUMMARY SEPARATELY ---------------- */
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const summaryRes = await axios.get(`/answer/${question_id}/summary`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSummary(summaryRes.data.summary || "");
        setSummaryExpanded(false);
      } catch {
        // Just ignore summary errors
        setSummary("");
      }
    };

    fetchSummary();
  }, [question_id, token]);

  /* ---------------- POST ANSWER ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answerText.trim()) return setError("Please provide an answer.");

    try {
      setPosting(true);

      await axios.post(
        "/answer",
        { question_id: Number(question_id), answer: answerText.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh answers
      const res = await axios.get(`/answer/${question_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnswers(res.data.answers.reverse());

      // Refresh summary separately
      try {
        const summaryRes = await axios.get(`/answer/${question_id}/summary`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSummary(summaryRes.data.summary || "");
        setSummaryExpanded(false);
      } catch {
        setSummary(""); // just remove summary if error
      }

      setAnswerText("");
      setError(null);
      toast.success("Answer Posted Successfully!");
    } catch {
      setError("Failed to post answer. Try again.");
    } finally {
      setPosting(false);
    }
  };

  /* ---------------- DELETE ANSWER ---------------- */
  const handleConfirmDeleteAnswer = async () => {
    try {
      await axios.delete(`/answer/${confirmDeleteAnswerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAnswers((prev) =>
        prev.filter((a) => a.answer_id !== confirmDeleteAnswerId)
      );

      // Refresh summary separately
      try {
        const summaryRes = await axios.get(`/answer/${question_id}/summary`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSummary(summaryRes.data.summary || "");
      } catch {
        setSummary("");
      }

      toast.success("Answer deleted");
    } catch {
      toast.error("Failed to delete answer");
    } finally {
      setConfirmDeleteAnswerId(null);
    }
  };

  /* ---------------- VOTING ---------------- */
  const handleQuestionVote = async (type) => {
    const originalQuestion = { ...question };
    
    // Optimistic Update
    const isLiked = question.user_vote === 1;
    const newVote = isLiked ? 0 : 1;
    const newCount = isLiked ? question.vote_count - 1 : question.vote_count + 1;

    setQuestion(prev => ({ ...prev, user_vote: newVote, vote_count: newCount }));

    try {
      await axios.post(
        `/vote/question/${question_id}`,
        { vote_type: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Voting error:", error);
      setQuestion(originalQuestion);
      toast.error("Failed to vote on question");
    }
  };

  const handleAnswerVote = async (answerId, type) => {
    const originalAnswers = [...answers];

    // Optimistic Update
    setAnswers(prev => prev.map(ans => {
      if (ans.answer_id === answerId) {
        const isLiked = ans.user_vote === 1;
        const newVote = isLiked ? 0 : 1;
        const newCount = isLiked ? ans.vote_count - 1 : ans.vote_count + 1;
        return { ...ans, user_vote: newVote, vote_count: newCount };
      }
      return ans;
    }));

    try {
      await axios.post(
        `/vote/answer/${answerId}`,
        { vote_type: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Voting error:", error);
      setAnswers(originalAnswers);
      toast.error("Failed to vote on answer");
    }
  };

  /* ---------------- JSX ---------------- */
  return (
    <div className={styles.container}>
      {question && (
        <div className={`${styles.question_summary_wrapper} glass-panel`}>
          <div className={styles.question_section}>
            <div className={styles.question_header_with_vote}>
              <div className={styles.vote_controls}>
                <button 
                  className={`${styles.ans_like_btn} ${question.user_vote === 1 ? styles.active_like : ''}`}
                  onClick={() => handleQuestionVote(1)}
                  title={question.user_vote === 1 ? "Unlike" : "Like"}
                >
                  <span className={styles.heart_icon}>{question.user_vote === 1 ? "❤️" : "🤍"}</span>
                  <span className={styles.ans_vote_count}>{question.vote_count || 0}</span>
                </button>
              </div>
              <div className={styles.question_content_main}>
                <h3 className={styles.big_title}>QUESTION</h3>
                <h2 className={styles.question}>
                  <span className={styles.arrow}>➤</span>
                  <span className={styles.text}>{question.title}</span>
                </h2>
                <div className={styles.author_rep_badge}>
                    <span className="reputation-badge gold">{question.reputation || 0} pts</span>
                    {question.badges?.map(b => (
                        <span key={b} className="reputation-badge silver" style={{ marginLeft: '5px' }}>{b}</span>
                    ))}
                </div>
              </div>
            </div>
            <p className={styles.description}>{question.description}</p>
          </div>

          {summary && (
            <div className={styles.summary_section}>
              <h3>Answer Summary (AI)</h3>
              <p className={styles.summaryText}>{getSummaryText()}</p>
              {shouldShowReadMore() && (
                <span
                  className={styles.readMore}
                  onClick={() => setSummaryExpanded((prev) => !prev)}
                >
                  {summaryExpanded ? "Show less" : "Read more..."}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      <div className={styles.answers_section}>
        <h3 className={styles.big_title}>Community Answers</h3>

        {answersLoading && <p>Loading answers...</p>}
        {error && <p className={styles.error}>{error}</p>}
        {!answersLoading && answers.length === 0 && <p>No answers yet!</p>}

        {answers.map((ans) => (
          <div key={ans.answer_id} className={`${styles.answer_card} glass-panel`}>
            <div className={styles.answer_main}>
              <div className={styles.user_info}>
                <div className={styles.avatar}>
                  {ans?.profile_picture ? (
                    <img
                      src={`${API_BASE_URL}${ans?.profile_picture}`}
                      alt="Profile"
                      className={styles.profile_image}
                    />
                  ) : (
                    ans.user_name?.[0]?.toUpperCase() || 'U'
                  )}
                </div>
                <span className={styles.user_name}>{ans.user_name}</span>
                <div className={styles.ans_author_rep}>
                  <span className="reputation-badge bronze">{ans.reputation || 0} pts</span>
                </div>
                <div className={styles.answer_votes}>
                  <button 
                    className={`${styles.ans_like_btn} ${ans.user_vote === 1 ? styles.active_like : ''}`}
                    onClick={() => handleAnswerVote(ans.answer_id, 1)}
                  >
                    <span className={styles.heart_icon}>{ans.user_vote === 1 ? "❤️" : "🤍"}</span>
                    <span className={styles.ans_vote_count}>{ans.vote_count || 0}</span>
                  </button>
                </div>
              </div>

              <div className={styles.content}>
                {getAnswerText(ans.content, ans.answer_id)}
                {shouldShowAnswerReadMore(ans.content) && (
                  <span
                    className={styles.readMore}
                    onClick={() =>
                      setExpandedAnswerId(
                        expandedAnswerId === ans.answer_id
                          ? null
                          : ans.answer_id
                      )
                    }
                  >
                    {expandedAnswerId === ans.answer_id
                      ? " Show less"
                      : " Read more..."}
                  </span>
                )}
              </div>
            </div>

            <div className={styles.answer_footer}>
              <span className={styles.timestamp}>
                {new Date(ans.created_at).toLocaleDateString()} at {new Date(ans.created_at).toLocaleTimeString()}
              </span>

              {user?.userid === ans.userid && (
                <div className={styles.action_icons}>
                  <MdEdit
                    size={22}
                    color="var(--neon-blue)"
                    title="Edit"
                    onClick={() => navigate(`/edit-answer/${ans.answer_id}`)}
                  />
                  <MdDelete
                    size={22}
                    color="var(--neon-pink)"
                    title="Delete"
                    onClick={() => setConfirmDeleteAnswerId(ans.answer_id)}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className={`${styles.answer_form} glass-panel`}>
        <h3 className={styles.big_title}>Post Your Answer</h3>
        <textarea
          placeholder="Your professional answer..."
          rows={6}
          value={answerText}
          onChange={(e) => {
            setAnswerText(e.target.value);
            if (error) setError(null);
          }}
          disabled={posting}
        />
        <div className={styles.form_actions}>
          <button type="submit" className="neon-btn" disabled={posting}>
            {posting ? "Posting..." : "Post Answer"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="neon-btn cancel"
          >
            Back to Home
          </button>
        </div>
      </form>
    </div>
  );
}

export default Answer;
