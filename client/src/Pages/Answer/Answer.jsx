import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../Api/axiosConfig";
import styles from "./answer.module.css";

function Answer() {
  // How React knows WHICH question to load
  const { question_id } = useParams();
  // for use of redirecting
  const navigate = useNavigate();
  //
  const token = localStorage.getItem("token");

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [answerText, setAnswerText] = useState("");
  const [error, setError] = useState(null);
  const [aiSummary, setAiSummary]= useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login", { state: { from: `/question/${question_id}` } });
    }
  }, [token, navigate, question_id]);
//    // Fetch question, answers, and AI summary
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Fetch question
        const resQuestion = await axios.get(`/question/${question_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuestion(resQuestion.data);
        // 2. Fetch answers
        const resAnswers = await axios.get(`/answer/${question_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnswers(resAnswers.data.answers);
        // 3. Fetch AI summary
        const resSummary = await axios.get(`/answer/summary/${question_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAiSummary(resSummary.data.summary);
        setError(null);
      } catch (err) {
        if (err.response?.status === 404) {
          setError("Question not found.");
        } else {
          setError("Failed to load answers.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [question_id, token]);

  //   2. Submit/post answer
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!answerText.trim()) {
      setError("Please provide an answer.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        "/answer",
        {
          question_id: Number(question_id),
          answer: answerText.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh answers and AI summary
      const [resAnswers, resSummary] = await Promise.all([
        axios.get(`/answer/${question_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`/answer/summary/${question_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setAnswers(resAnswers.data.answers);
      setAiSummary(resSummary.data.summary);
      setAnswerText("");
      setError(null);
    } catch (err) {
      setError("Failed to post answer. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  if (!question) return <p>Loading question...</p>;

  return (
    <div className={styles.container}>
      {/* Question Section */}
      <div className={styles.question_section}>
        <span className={styles.tag}>{question.tag}</span>
        <h2 className={styles.title}>{question.title}</h2>
        <p className={styles.description}>{question.description}</p>
      </div>

      {/* AI Summary */}
      {aiSummary && (
        <div className={styles.ai_summary}>
          <h3>Summary of Answers</h3>
          <p>{aiSummary}</p>
        </div>
      )}

      {/* Answers List */}
      <div className={styles.answers_section}>
        <h3>Answer From The Community</h3>
        {loading && <p>Loading answers...</p>}
        {error && <p className={styles.error}>{error}</p>}
        {!loading && answers.length === 0 && (
          <p>No answers yet. Be the first!</p>
        )}

        {answers.map((ans) => (
          <div key={ans.answer_id} className={styles.answer_card}>
            <div className={styles.user_info}>
              <div className={styles.avatar}>👤</div>
              <span>{ans.user_name}</span>
            </div>
            <p className={styles.content}>{ans.content}</p>
          </div>
        ))}
      </div>

      {/* Answer Form */}
      <form onSubmit={handleSubmit} className={styles.answer_form}>
        <textarea
          placeholder="Your answer ..."
          rows={6}
          value={answerText}
          onChange={(e) => {
            setAnswerText(e.target.value);
            if (error) setError(null);
          }}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Post Answer"}
        </button>
      </form>
    </div>
  );
}

export default Answer;
