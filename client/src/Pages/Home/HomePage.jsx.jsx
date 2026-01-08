import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeHeader from './HomeHeader';
import SearchBar from './SearchBar';
import QuestionList from './QuestionList';
import './HomePage.css';

const HomePage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('http://localhost:5500/api/questions');
      const data = await response.json();
      setQuestions(data.questions || []);
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = () => {
    const token = localStorage.getItem('token');
    navigate(token ? '/ask' : '/login');
  };

  const filteredQuestions = questions.filter(q =>
    q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Loading questions...</div>;

  return (
    <div className="home-page">
      <HomeHeader onAskQuestion={handleAskQuestion} />

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {error && <div className="error-message">{error}</div>}

      <QuestionList
        questions={filteredQuestions}
        onAskQuestion={handleAskQuestion}
      />
    </div>
  );
};

export default HomePage;
