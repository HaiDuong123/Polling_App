const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');
const Poll = require('./models/poll');

const app = express();
app.use(cors());
app.use(express.json());

// --- 1. KẾT NỐI DATABASE ---
// Lưu ý: Thay 'mongodb://localhost:27017/pollingDB' bằng URL MongoDB của bạn nếu dùng Cloud
// Dùng IP cụ thể thay vì localhost để tránh lỗi trên Node.js mới
// ĐÚNG (Xóa ngoặc, chỉ để lại mật khẩu)
mongoose.connect('mongodb+srv://nq2020ngohoanghaiduong200104_db_user:duong123@cluster0.rf9r0wt.mongodb.net/?appName=Cluster0')  .then(() => console.log('MongoDB Connected ✅'))
  .catch(err => console.log('Lỗi kết nối MongoDB:', err));

// --- 2. REST API (Tạo & Lấy danh sách) ---
// Lấy tất cả Polls
app.get('/api/polls', async (req, res) => {
  const polls = await Poll.find().sort({ createdAt: -1 });
  res.json(polls);
});

// Lấy chi tiết 1 Poll
app.get('/api/polls/:id', async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    res.json(poll);
  } catch (error) {
    res.status(404).json({ message: "Poll not found" });
  }
});

// Tạo Poll mới 
app.post('/api/polls', async (req, res) => {
  const { question, options } = req.body;
  // Chuyển mảng string options thành object {text, votes}
  const formattedOptions = options.map(opt => ({ text: opt, votes: 0 }));
  const newPoll = new Poll({ question, options: formattedOptions });
  await newPoll.save();
  res.json(newPoll);
});

// --- 3. REAL-TIME SOCKET (Xử lý Vote & Like) [cite: 10] ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    // Thêm cổng 3001 vào danh sách cho phép
    origin: ["http://localhost:3000", "http://localhost:3001"], 
    methods: ["GET", "POST"]
  }
});
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Lắng nghe sự kiện 'vote' từ client [cite: 11]
  socket.on('vote', async ({ pollId, optionIndex }) => {
    try {
      const poll = await Poll.findById(pollId);
      if (poll) {
        poll.options[optionIndex].votes += 1; // Tăng phiếu bầu
        await poll.save();
        // Gửi dữ liệu mới nhất cho TẤT CẢ mọi người đang xem
        io.emit('update_poll', poll); 
      }
    } catch (e) {
      console.error(e);
    }
  });

  // Lắng nghe sự kiện 'like' [cite: 12]
  socket.on('like', async (pollId) => {
    try {
      const poll = await Poll.findById(pollId);
      if (poll) {
        poll.likes += 1;
        await poll.save();
        io.emit('update_poll', poll);
      }
    } catch (e) {
      console.error(e);
    }
  });
});

server.listen(5000, () => console.log('Server running on port 5000'));