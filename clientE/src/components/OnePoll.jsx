import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useHistory } from "react-router-dom";
import Results from "./Results";

const OnePoll = () => {
  const { id } = useParams();
  const [pollDetails, setPollDetails] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [voted, setVoted] = useState(false);
  const history = useHistory();

  useEffect(() => {
    axios.get(`http://localhost:8007/api/poll/${id}`)
      .then((response) => {
        console.log(response.data);
        setPollDetails(response.data);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }, [id]);

  const handleVote = async () => {
    try {
      // Make a request to your backend API to store the vote
      await axios.post(`http://localhost:8007/api/vote`, {
        pollId: id,
        selectedOption: selectedOption,
      });

      // Update the local state to indicate that the user has voted
      setVoted(true);

      // Redirect to the Results component
      history.push(`/results/${id}`);
    } catch (error) {
      console.error("Error while submitting vote:", error);
      // Handle error if the vote submission fails
    }
  };

  return (
    <div>
      {pollDetails && (
        <div>
          <h2>{pollDetails.question}</h2>
          {voted ? (
            <Results pollDetails={pollDetails} selectedOption={selectedOption} />
          ) : (
            <div>
              <ul>
                {pollDetails.options.map((option, index) => (
                  <li key={index}>
                    {option}
                    <button onClick={() => { setSelectedOption(index); handleVote(); }}>Vote</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OnePoll;