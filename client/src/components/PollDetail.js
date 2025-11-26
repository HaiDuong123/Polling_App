import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { API_URL } from '../apiConfig';

// Đăng ký ChartJS
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const socket = io.connect(API_URL);

function PollDetail() {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [hasVoted, setHasVoted] = useState(false); // Trạng thái đã vote hay chưa
  const chartRef = useRef(null); // Dùng để tham chiếu đến biểu đồ phục vụ tính năng Download

  useEffect(() => {
    // 1. Kiểm tra xem người dùng này đã vote poll này chưa (Lưu trong trình duyệt)
    const votedLocal = localStorage.getItem(`voted_${id}`);
    if (votedLocal) {
      setHasVoted(true);
    }

    // 2. Lấy dữ liệu
    axios.get(`${API_URL}/api/polls/${id}`)
      .then(res => setPoll(res.data))
      .catch(err => console.error(err));

    socket.on('update_poll', (updatedPoll) => {
      if (updatedPoll._id === id) {
        setPoll(updatedPoll);
      }
    });

    return () => {
      socket.off('update_poll');
    };
  }, [id]);

  if (!poll) return <div style={{textAlign: 'center', marginTop: '50px'}}>Loading poll data...</div>;

  // Xử lý Vote
  const handleVote = (index) => {
    if (hasVoted) return alert("Bạn đã bỏ phiếu cho cuộc thăm dò này rồi!");
    
    socket.emit('vote', { pollId: id, optionIndex: index });
    
    // Lưu trạng thái đã vote vào LocalStorage để chặn vote lần 2
    localStorage.setItem(`voted_${id}`, 'true');
    setHasVoted(true);
  };

  const handleLike = () => {
    socket.emit('like', id);
  };

  // Tính năng 1: Chia sẻ lên Mạng xã hội
  const shareUrl = window.location.href; // Lấy URL hiện tại
  const shareText = `Hãy tham gia bình chọn: ${poll.question}`;

  const handleShare = (platform) => {
    let url = '';
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
        break;
      default: return;
    }
    window.open(url, '_blank', 'width=600,height=400');
  };

  // Tính năng 2: Tải xuống biểu đồ
  const handleDownload = () => {
    if (chartRef.current) {
      const link = document.createElement('a');
      link.download = `ket-qua-tham-do-${id}.png`;
      link.href = chartRef.current.toBase64Image();
      link.click();
    }
  };

  // Cấu hình dữ liệu biểu đồ
  const chartData = {
    labels: poll.options.map(opt => opt.text),
    datasets: [
      {
        label: 'Số phiếu bầu',
        data: poll.options.map(opt => opt.votes),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ maxWidth: '800px', margin: '30px auto', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
      <h1 style={{ color: '#333' }}>{poll.question}</h1>
      
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button onClick={handleLike} style={{ padding: '8px 15px', background: '#ff4757', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
           ❤️ Like Poll ({poll.likes})
        </button>
        <span style={{ fontSize: '14px', color: '#666' }}>ID: {id}</span>
      </div>

      <div style={{ display: 'flex', gap: '40px', flexDirection: 'row', flexWrap: 'wrap' }}>
        {/* Cột Trái: Danh sách Vote */}
        <div style={{ flex: 1, minWidth: '300px' }}>
            <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>🗳️ Bình chọn của bạn</h3>
            {hasVoted ? (
              <div style={{ padding: '15px', background: '#dff9fb', color: '#130f40', borderRadius: '5px' }}>
                ✅ Cảm ơn bạn đã bỏ phiếu! Kết quả đang được hiển thị bên cạnh.
              </div>
            ) : (
              poll.options.map((opt, index) => (
              <button 
                  key={index} 
                  onClick={() => handleVote(index)}
                  style={{ 
                    display: 'block', 
                    margin: '10px 0', 
                    padding: '12px', 
                    width: '100%',
                    background: '#f1f2f6',
                    border: '1px solid #ced6e0',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontWeight: 'bold',
                    transition: '0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.background = '#eccc68'}
                  onMouseOut={(e) => e.target.style.background = '#f1f2f6'}
              >
                  {opt.text}
              </button>
              ))
            )}
        </div>
        
        {/* Cột Phải: Biểu đồ & Tiện ích */}
        <div style={{ flex: 1.5, minWidth: '300px' }}>
            <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>📊 Kết quả trực tiếp</h3>
            <div style={{ background: '#fff', padding: '10px' }}>
              <Bar ref={chartRef} data={chartData} />
            </div>

            <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
              <h4>Công cụ:</h4>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button onClick={handleDownload} style={{ padding: '8px', background: '#2ed573', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  📥 Tải biểu đồ
                </button>
                <button onClick={() => handleShare('facebook')} style={{ padding: '8px', background: '#3b5998', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Facebook
                </button>
                <button onClick={() => handleShare('twitter')} style={{ padding: '8px', background: '#1DA1F2', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Twitter
                </button>
                <button onClick={() => handleShare('linkedin')} style={{ padding: '8px', background: '#0077b5', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  LinkedIn
                </button>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default PollDetail;