import React, { useState, useEffect, useCallback, useContext } from "react";
import styles from "./ask.module.css";
import axios from "../../axiosConfig.js";
import KeywordExtractor from "keyword-extractor";
import { useNavigate } from "react-router-dom";
import QuestionList_homepage from "../Home/QuestionList_homepage";
import { AppState } from "../../App";

function Askquestion() {
  const { user } = useContext(AppState);
  const token = localStorage.getItem("token");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tag, setTag] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  // Fetch questions from API
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

  // Check authentication on component mount and fetch questions
  useEffect(() => {
    if (!token) {
      navigate("/login", { state: { from: "/ask" } });
    } else {
      fetchQuestions();
    }
  }, [token, navigate]);

  // Generate tag from title whenever title changes
  useEffect(() => {
    if (title.trim().length > 3) {
      const generatedTag = generateTag(title);
      setTag(generatedTag);
    } else {
      setTag("");
    }
  }, [title]);

  // Function to generate tags using keyword-extractor
  const generateTag = (title) => {
    try {
      const extractionResult = KeywordExtractor.extract(title, {
        language: "english",
        remove_digits: true,
        return_changed_case: true,
        remove_duplicates: true,
      });

      // Filter out very short keywords and use the most relevant one
      const validKeywords = extractionResult.filter(
        (keyword) => keyword.length > 2
      );

      return validKeywords.length > 0
        ? validKeywords[0].toLowerCase()
        : "general";
    } catch (error) {
      console.error("Error generating tag:", error);
      return "general";
    }
  };

  // Validate form inputs
  const validateForm = () => {
    const errors = {};

    if (!title.trim()) {
      errors.title = "Title is required";
    } else if (title.trim().length < 10) {
      errors.title = "Title must be at least 10 characters long";
    } else if (title.trim().length > 200) {
      errors.title = "Title cannot exceed 200 characters";
    }

    if (!description.trim()) {
      errors.description = "Description is required";
    } else if (description.trim().length < 20) {
      errors.description = "Description must be at least 20 characters long";
    } else if (description.trim().length > 5000) {
      errors.description = "Description cannot exceed 5000 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setError(null);
    setFormErrors({});

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "/question",
        {
          title: title.trim(),
          description: description.trim(),
          tag: tag || "general",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Refresh questions list to show the new question
      await fetchQuestions();

      // Show success message
      alert("Your question has been posted successfully!");

      // Reset form
      setTitle("");
      setDescription("");
      setTag("");

      // Navigate to home page
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error posting question:", error);

      if (error.response) {
        // Server responded with an error status
        if (error.response.status === 401) {
          setError("Your session has expired. Please login again.");
          localStorage.removeItem("token");
          navigate("/login");
        } else if (error.response.status === 400) {
          setError("Invalid input. Please check your question and try again.");
        } else if (error.response.status === 429) {
          setError(
            "Too many requests. Please wait a moment before trying again."
          );
        } else {
          setError(
            error.response.data?.message ||
              "Failed to post question. Please try again."
          );
        }
      } else if (error.request) {
        // Request was made but no response received
        setError("Network error. Please check your connection and try again.");
      } else {
        // Other errors
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  // Handle input changes with debounced validation
  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);

    // Clear title error when user starts typing
    if (formErrors.title && value.trim().length >= 10) {
      setFormErrors((prev) => ({ ...prev, title: "" }));
    }
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setDescription(value);

    // Clear description error when user starts typing
    if (formErrors.description && value.trim().length >= 20) {
      setFormErrors((prev) => ({ ...prev, description: "" }));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.steps_toFollow}>
        <h2>Steps for writing a good question</h2>
        <ul>
          <li>Summarize your question in a one-line title.</li>
          <li>Describe your problem in more detail.</li>
          <li>Describe what you tried and what you expected to happen.</li>
          <li>Review your question and post it to the site.</li>
        </ul>
      </div>

      <div className={styles.question_form}>
        <div className={styles.question_title}>
          <h2>Ask Your Question to the Community</h2>
        </div>

        {error && (
          <div className={styles.error_message}>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.form_group}>
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              placeholder="Be specific and imagine you're asking another person"
              value={title}
              onChange={handleTitleChange}
              className={formErrors.title ? styles.error_input : ""}
              disabled={loading}
            />
            {formErrors.title && (
              <span className={styles.error_text}>{formErrors.title}</span>
            )}
            <div className={styles.input_help}>
              {title.length > 0 && (
                <span className={title.length < 10 ? styles.warning : ""}>
                  {title.length}/200 characters
                </span>
              )}
            </div>
          </div>

          <div className={styles.form_group}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder="Include all the information someone would need to answer your question"
              value={description}
              onChange={handleDescriptionChange}
              className={formErrors.description ? styles.error_input : ""}
              disabled={loading}
              rows="10"
            />
            {formErrors.description && (
              <span className={styles.error_text}>
                {formErrors.description}
              </span>
            )}
            <div className={styles.input_help}>
              {description.length > 0 && (
                <span className={description.length < 20 ? styles.warning : ""}>
                  {description.length}/5000 characters
                </span>
              )}
            </div>
          </div>

          <div className={styles.form_group}>
            <label htmlFor="tag">Suggested Tag</label>
            <input
              id="tag"
              type="text"
              value={tag}
              readOnly
              className={styles.tag_input}
            />
            <div className={styles.input_help}>
              This tag is auto-generated from your title.
            </div>
          </div>

          <div className={styles.form_actions}>
            <button
              type="submit"
              disabled={loading}
              className={loading ? styles.loading_button : ""}
            >
              {loading ? "Posting..." : "Post Your Question"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={loading}
              className={styles.cancel_button}
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Display all questions using QuestionList_homepage component */}
        <div className={styles.questions_section}>
          <h3>Community Questions</h3>
          <QuestionList_homepage
            questions={questions}
            user={user}
          />
        </div>
      </div>
    </div>
  );
}

export default Askquestion;
