import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../Api/axiosConfig";
import styles from "./answer.module.css";

function Answer() {
  // How React knows WHICH question to load
  const { question_id } = useParams();
  //   console.log("Question ID from URL:", question_id);

  // for use of redirecting
  const navigate = useNavigate();
  //
  const token = localStorage.getItem("token");

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [answerText, setAnswerText] = useState("");
  const [error, setError] = useState(null);
  const [aiSummary, setAiSummary] = useState("");

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
        const Question = await axios.get(`/question/${question_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuestion(Question.data);

        // 2. Fetch answers
        const Answers = await axios.get(`/answer/${question_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnswers(Answers.data.answers);

        // 3. Fetch AI summary
        const Summary = await axios.get(`/answer/summary/${question_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAiSummary(Summary.data.summary);
        setError(null);

        // // Navigate to home or question page
        // //   navigate("/", { replace: true });
        // // Alternatively, navigate to the question detail page:
        // navigate(`/question/${response.data.questionId}`);
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
      const [Answers, Summary] = await Promise.all([
        axios.get(`/answer/${question_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`/answer/summary/${question_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      //   console.log("Answers response:", Answers.data);

      setAnswers(Answers.data.answers);
      setAiSummary(Summary.data.summary);
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

// import React, { useEffect, useState } from "react";
// import styles from "./answer.module.css";
// import axios from "../../Api/axiosConfig";
// import { useParams, useNavigate } from "react-router-dom";

// function Answer() {
//   const { question_id } = useParams();
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   const [answers, setAnswers] = useState([]);
//   const [answerText, setAnswerText] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Redirect if not logged in
//   useEffect(() => {
//     if (!token) {
//       navigate("/login", { state: { from: `/question/${question_id}` } });
//     }
//   }, [token, navigate, question_id]);

//   // Fetch answers
//   useEffect(() => {
//     const fetchAnswers = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get(`/answer/${question_id}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setAnswers(res.data.answers);
//       } catch (err) {
//         if (err.response?.status === 404) {
//           setError("Question not found.");
//         } else {
//           setError("Failed to load answers.");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAnswers();
//   }, [question_id, token]);

//   // Submit answer
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!answerText.trim()) {
//       setError("Please provide an answer.");
//       return;
//     }

//     try {
//       setLoading(true);
//       await axios.post(
//         "/answer",
//         {
//           question_id: Number(question_id),
//           answer: answerText.trim(),
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       // Refresh answers
//       const res = await axios.get(`/answer/${question_id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setAnswers(res.data.answers);
//       setAnswerText("");
//       setError(null);
//     } catch (err) {
//       setError("Failed to post answer. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <h2>Answers</h2>

//       {error && <p className={styles.error}>{error}</p>}
//       {loading && <p>Loading...</p>}

//       {answers.length === 0 && !loading && (
//         <p className={styles.no_answers}>No answers yet. Be the first!</p>
//       )}

//       <div className={styles.answer_list}>
//         {answers.map((ans) => (
//           <div key={ans.answer_id} className={styles.answer_card}>
//             <p className={styles.content}>{ans.content}</p>
//             <div className={styles.meta}>
//               <span>{ans.user_name}</span>
//               <span>{new Date(ans.created_at).toLocaleDateString()}</span>
//             </div>
//           </div>
//         ))}
//       </div>

//       <form onSubmit={handleSubmit} className={styles.answer_form}>
//         <h3>Your Answer</h3>
//         <textarea
//           rows="6"
//           value={answerText}
//           onChange={(e) => setAnswerText(e.target.value)}
//           placeholder="Write your answer here..."
//           disabled={loading}
//         />
//         <button type="submit" disabled={loading}>
//           {loading ? "Posting..." : "Post Answer"}
//         </button>
//       </form>
//     </div>
//   );
// }

// export default Answer;
