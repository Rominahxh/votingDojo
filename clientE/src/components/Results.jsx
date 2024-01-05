import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const Results = ({ pollDetails, selectedOption }) => {
  const [voteResults, setVoteResults] = useState(null);
  const [voteCounts, setVoteCounts] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Establish a WebSocket connection
    const socket = io("http://localhost:8007");

    // Fetch initial poll details, including vote counts
    axios.get(`http://localhost:8007/api/poll/${pollDetails._id}`)
      .then((response) => {
        console.log(response.data);
        setVoteResults(response.data);
        setVoteCounts(response.data.options.map(option => option.votes));
      })
      .catch((err) => {
        console.log(err.response.data);
      });

    // Listen for updates when new votes are cast
    socket.on("voteUpdate", (updatedVoteCounts) => {
      // Ensure that updatedVoteCounts is an array of vote counts for each option
      setVoteCounts(updatedVoteCounts);
    });

    // Clean up the WebSocket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, [pollDetails._id, selectedOption]);

  const goBackHome = () => {
    navigate("/");
  };

  return (
    <div>
      <h3>Results</h3>
      <ul>
        {voteResults && voteResults.options.map((option, index) => (
          <li key={index}>
            {option} {voteCounts[index]}
          </li>
        ))}
      </ul>
      <p>You voted for: {pollDetails.options[selectedOption]}</p>
      <button onClick={goBackHome}>Go Back Home</button>
    </div>
  );  
};

export default Results;
