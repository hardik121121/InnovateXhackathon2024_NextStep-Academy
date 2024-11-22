// src/QuizTimer.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// import { setQuizResult } from "../redux/actions"; // Ensure this action saves results
// import { postQuizResult, postUserResult } from "../../Redux/action.js";
import { setQuizResult } from "../../Redux/action";


const QuizTimer = ({ totalTimeInSeconds, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(totalTimeInSeconds);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (timeLeft <= 0) {
      // Trigger the callback when time is up
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => Math.max(prevTime - 1, 0));
    }, 1000);

    // Cleanup the interval on unmount or when timeLeft changes
    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  // Format time as minutes:seconds (e.g., 09:30)
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="quiz-timer">
      <p style={{ fontSize: "24px", fontWeight: "bold", color: "red" }}>
        Time Left: {formatTime(timeLeft)}
      </p>
    </div>
  );
};

export default QuizTimer;
