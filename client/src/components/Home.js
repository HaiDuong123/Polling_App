import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Home() {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/polls')
      .then(res => setPolls(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h2>Available Polls</h2>
      <ul>
        {polls.map(poll => (
          <li key={poll._id} style={{ marginBottom: '10px' }}>
            <Link to={`/poll/${poll._id}`}>
              {poll.question}
            </Link> 
            <span> ({poll.likes} Likes)</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;