import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_URL } from '../apiConfig'; // Import API config
import { FaPoll, FaHeart, FaPlus, FaArrowRight, FaChartBar } from 'react-icons/fa'; // Import Icon

function Home() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/api/polls`)
      .then(res => {
        setPolls(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="app-container">
      {/* 1. THANH ĐIỀU HƯỚNG (NAVBAR) */}
      <nav className="navbar">
        <div className="logo">
          <FaChartBar className="logo-icon" />
          <span>Votely App</span>
        </div>
        <Link to="/create" className="btn-create">
          <FaPlus style={{ marginRight: '5px' }} /> Tạo Poll Mới
        </Link>
      </nav>

      {/* 2. NỘI DUNG CHÍNH */}
      <div className="main-content">
        <header className="page-header">
          <h1>Danh sách bình chọn</h1>
          <p>Tham gia và xem kết quả trực tiếp ngay lập tức!</p>
        </header>

        {loading ? (
          <div className="loading">⏳ Đang tải dữ liệu...</div>
        ) : (
          <div className="poll-grid">
            {polls.map(poll => (
              <Link to={`/poll/${poll._id}`} key={poll._id} className="poll-card">
                <div className="card-content">
                  <div className="card-icon">
                    <FaPoll />
                  </div>
                  <h3 className="card-title">{poll.question}</h3>
                  <div className="card-stats">
                    <span className="likes">
                      <FaHeart className="heart-icon" /> {poll.likes} Lượt thích
                    </span>
                    <span className="action-text">
                      Bình chọn ngay <FaArrowRight />
                    </span>
                  </div>
                </div>
              </Link> 
            ))}
          </div>
        )}
        
        {/* Nếu chưa có poll nào */}
        {!loading && polls.length === 0 && (
          <div className="empty-state">
            <p>Chưa có cuộc bình chọn nào.</p>
            <Link to="/create" className="btn-primary">Tạo cái đầu tiên ngay!</Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;