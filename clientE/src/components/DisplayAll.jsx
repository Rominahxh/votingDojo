import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const DisplayAll = () => {
  const [allPolls, setAllPolls] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8007/api/poll")
      .then((response) => {
        const pollsWithVoteCount = response.data.map((poll) => ({
          ...poll,
          voteCount: 0, // Initialize vote count to 0 for each poll
        }));

        setAllPolls(pollsWithVoteCount);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }, []);

  const handlePollVote = (pollId) => {
    // Increment the vote count for the voted poll
    setAllPolls((prevPolls) =>
      prevPolls.map((poll) =>
        poll._id === pollId ? { ...poll, voteCount: poll.voteCount + 1 } : poll
      )
    );
  };

  const calculateMinutesDifference = (timestamp) => {
    const currentDate = new Date();
    const creationDate = new Date(timestamp);
  
    if (isNaN(creationDate)) {
      // Handle invalid date format
      return 'Invalid date';
    }
  
    const timeDifferenceInMilliseconds = currentDate - creationDate;
    const minutesDifference = Math.floor(timeDifferenceInMilliseconds / (1000 * 60));
  
    return minutesDifference > 0 ? `${minutesDifference} minutes ago` : 'Just now';
  };
  

  // Sort polls based on vote count in descending order and display top 3
  const top3Polls = allPolls
    .sort((a, b) => b.voteCount - a.voteCount)
    .slice(0, 3);

  return (
    <div>
      <Link to="/new">
        <button className="btn">Create your own Poll</button>
      </Link>
      <div className="d-flex">
        <div className="box">
          <h2>Top 3 Polls</h2>
          <ul>
            {top3Polls.map((poll) => (
              <li key={poll._id} className="box">
                <Link to={`/poll/${poll._id}`} onClick={() => handlePollVote(poll._id)}>
                  {poll.question}
                </Link>
                <p>Votes: {poll.voteCount}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="box">
          <h2>Recent Polls</h2>
          {/* Display all polls here */}
          <ul>
            {allPolls.map((poll) => (
              <li key={poll._id} className="box">
                <Link to={`/poll/${poll._id}`} onClick={() => handlePollVote(poll._id)}>
                  {poll.question}
                </Link>
                <p>Created {calculateMinutesDifference(poll.createdAt)} minutes ago</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DisplayAll;
