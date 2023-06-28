import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './QuestionsList.css'; // Create a separate CSS file for styling

const QuestionsList = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
   /* eslint-disable no-unused-vars */
  const [submissions, setSubmissions] = useState([]);
    /* eslint-enable no-unused-vars */
  const textareaRef = useRef(null);

  useEffect(() => {
    axios
      .get('http://localhost:9001/getQuestion')
      .then((response) => {
        console.log('Response:', response.data);
        setQuestions(response.data);
      })
      .catch((error) => {
        console.error('Error fetching questions:', error);
      });
  }, []);

  const handleAnswerChange = () => {
    const updatedQuestions = [...questions];
    const answer = textareaRef.current.value.trim() !== '' ? textareaRef.current.value : '';
    updatedQuestions[currentQuestionIndex].answer = answer;
    setQuestions(updatedQuestions);
  };

  const handleSubmit = () => {
    const submissionData = questions.map((question) => ({
      id: question.id,
      answer: question.answer || 'NULL',
    }));

    axios
      .post('http://localhost:9001/saveSubmission', { submissions: submissionData })
      .then(() => {
        setSubmissions(submissionData);
      })
      .catch((error) => {
        console.error('Error saving submission:', error);
      });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleQuestionSelection = (event) => {
    const selectedQuestionIndex = parseInt(event.target.value, 10);
    setCurrentQuestionIndex(selectedQuestionIndex);
  };

  console.log(questions);

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="container">
      <h3>{currentQuestion.question}</h3>
      <textarea
        ref={textareaRef}
        className="answer-textarea"
        value={currentQuestion.answer || ''}
        onChange={handleAnswerChange}
      />
      <div className="button-container">
        <button onClick={handlePrevQuestion} disabled={currentQuestionIndex === 0}>
          Previous
        </button>
        <button onClick={handleNextQuestion} disabled={currentQuestionIndex === questions.length - 1}>
          Next
        </button>
        {currentQuestionIndex === questions.length - 1 && (
          <button onClick={handleSubmit}>Submit</button>
        )}
      </div>
      <div className="pagination">
        <span>Go to question:</span>
        <select value={currentQuestionIndex} onChange={handleQuestionSelection}>
          {questions.map((question, index) => (
            <option key={question.id} value={index}>
              {index + 1}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default QuestionsList;
