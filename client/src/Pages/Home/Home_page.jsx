// ===================== Home Page =====================

// React hooks
import { useContext, useEffect, useState } from "react";

// Global app context
import { AppState } from "../../App";

// Axios instance
import axios from "../../axiosConfig";

// CSS module
import classes from "./home.module.css";

// Child components (use the same names everywhere)
import Header_homepage from "./Header_homepage";
import SearchBar_homepage from "./SearchBar_homepage";
import SortDropdown_homepage from "./SortDropdown_homepage";
import QuestionList_homepage from "./QuestionList_homepage";

const Home_page = () => {
  // ===================== CONTEXT =====================
  const { user } = useContext(AppState);

  // ===================== AUTH =====================
  const token = localStorage.getItem("token");

  // ===================== STATE =====================
  const [questions, setQuestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("Most Recent");

  // ===================== FETCH QUESTIONS =====================
  const fetchQuestions = async () => {
    try {
      const { data } = await axios.get("http://localhost:5500/api/QuestionList_homepage", {
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

  // ===================== FILTER & SORT =====================
  const filteredQuestions = questions
    .filter(
      (q) =>
        q.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.username?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === "Most Recent") {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      if (sortOption === "Most Popular") {
        return (b.views || 0) - (a.views || 0);
      }
      return 0;
    });

  // ===================== UI =====================
  return (
    <section className={classes.container}>
      <Header_homepage user={user} />

      <SearchBar_homepage
        value={searchQuery}
        onChange={setSearchQuery}
      />

      <SortDropdown_homepage
        value={sortOption}
        onChange={setSortOption}
      />

      <QuestionList_homepage
        questions={filteredQuestions}
        user={user}
      />
    </section>
  );
};

export default Home_page;