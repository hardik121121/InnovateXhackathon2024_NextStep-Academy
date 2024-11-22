import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

export const Resultshow = () => {
  const navigate = useNavigate();

  // States for marks and feedback
  const [count, setCount] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [answersWithStatus, setAnswersWithStatus] = useState([]);

  // Redux states
  const UserName = useSelector((state) => state.mernQuize.userName);
  const resultUser = useSelector((state) => state.mernQuize.result);
  const singleQuiz = useSelector((state) => state?.mernQuize.QuizData);

  // Get the user's quiz results from Redux and calculate correct answers
  let originalResult = [];
  const questionArr = singleQuiz[0]?.questionArray || [];

  // Function to extract correct answers from quiz data
  const filterActualAnswer = (questions) => {
    questions.forEach((q) => originalResult.push(q.correctAnswer));
  };

  useEffect(() => {
    if (questionArr.length > 0) {
      filterActualAnswer(questionArr);
    }
  }, [questionArr]);

  // Calculate marks, feedback, and answers with status
  useEffect(() => {
    const calculateResults = () => {
      let correctCount = 0;
      const answersStatus = questionArr.map((q, index) => {
        const userAnswer = resultUser[index];
        const correctAnswer = q.correctAnswer;

        // Check if the answer is unanswered
        if (userAnswer === undefined || userAnswer === null || userAnswer === "") {
          return { question: q.questions, status: "Not Answered" };
        }

        // Check if the answer is correct
        if (userAnswer === correctAnswer) {
          correctCount++;
          return { question: q.questions, status: "Correct" };
        } else {
          return { question: q.questions, status: "Incorrect" };
        }
      });

      const percentage = Math.round((correctCount / questionArr.length) * 100);

      // Set feedback based on percentage
      if (percentage > 90) {
        setFeedback(`Congratulations! You cleared the Test! ${UserName}`);
      } else if (percentage > 50) {
        setFeedback(`Good Job! You cleared the Test! Keep Practicing ${UserName}`);
      } else {
        setFeedback(`Sorry! You failed the Test! Keep Practicing ${UserName}`);
      }

      setCount(correctCount);
      setAnswersWithStatus(answersStatus);
    };

    calculateResults();
  }, [resultUser, originalResult, UserName, questionArr]);

  // Navigate back to the result page if the quiz timer expires
  useEffect(() => {
    const timerCheck = () => {
      const timerExpired = localStorage.getItem("timerExpired");
      if (timerExpired === "true") {
        navigate("/result"); // Redirect to result page
        localStorage.removeItem("timerExpired"); // Clear the timer flag after navigation
      }
    };

    timerCheck();
  }, [navigate]);

  return (
    <div className="w-11/12 shadow-2xl ml-16 mt-24">
      <h1 className="ml-72 pl-64 mt-8 text-3xl text-sky-700">Result Analysis</h1>
      <div className="flex -mt-24">
        <div className="w-2/5 ml-4">
          <img src="./resultAnalysis.gif" alt="resultAnalysis" />
        </div>
        <div className="w-2/5 mt-24 p-8">
          <h1 className="text-2xl text-red-600">{feedback}</h1>
          <strong className="text-xl italic text-teal-600">
            Total Marks: {count}/{questionArr.length}
          </strong>
        </div>
      </div>

      <div className="mt-8 ml-12">
        <h2 className="text-2xl text-gray-800">Detailed Analysis:</h2>
        <ul className="list-disc pl-6 mt-4">
          {answersWithStatus.map((answer, index) => (
            <li key={index} className="mb-2">
              <strong>Q{index + 1}:</strong> {answer.question}
              <span
                className={`ml-2 font-bold ${
                  answer.status === "Correct"
                    ? "text-green-500"
                    : answer.status === "Incorrect"
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
              >
                {answer.status}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="absolute bg-blue-300 rounded-2xl right-24 top-28 border-2 mb-8 p-2 pl-4 pr-4">
        <Link to="/">
          <button className="text-xl font-bold">Attempt More Quiz</button>
        </Link>
      </div>
    </div>
  );
};
