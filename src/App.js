import React from 'react';
import QuestionsList from './QuestionsList';
import './QuestionsList.css';

const App = () => {
  return (
    <div className="main-container">
      <h3>Answer the Questions</h3>
      <QuestionsList />
    </div>
  );
};

export default App;
