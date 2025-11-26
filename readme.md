# 📊 Real-Time Polling App (MERN Stack)

Ứng dụng bình chọn trực tuyến thời gian thực, cho phép người dùng tạo các cuộc thăm dò ý kiến, chia sẻ với bạn bè và xem kết quả cập nhật tức thì mà không cần tải lại trang.

[cite_start]Dự án được xây dựng dựa trên ngăn xếp **MERN** (MongoDB, Express, React, Node.js) kết hợp với **Socket.io**[cite: 2].

## 🚀 Tính năng chính

* [cite_start]**Tạo cuộc thăm dò:** Người dùng có thể tạo câu hỏi và tùy chỉnh nhiều lựa chọn trả lời[cite: 9].
* [cite_start]**Cập nhật thời gian thực:** Kết quả bình chọn được cập nhật ngay lập tức cho tất cả người dùng đang xem nhờ công nghệ WebSocket[cite: 7, 10].
* [cite_start]**Trực quan hóa dữ liệu:** Hiển thị kết quả dưới dạng biểu đồ cột đẹp mắt bằng `Chart.js`[cite: 7].
* [cite_start]**Bình chọn an toàn:** Sử dụng LocalStorage để ngăn chặn việc spam vote (mỗi người chỉ được vote 1 lần)[cite: 11].
* [cite_start]**Chia sẻ dễ dàng:** Tính năng sao chép liên kết (Copy Link) để gửi qua Zalo/Messenger và nút chia sẻ lên Facebook, Twitter, LinkedIn[cite: 14].
* [cite_start]**Tải xuống kết quả:** Cho phép người dùng tải ảnh chụp biểu đồ kết quả về máy[cite: 15].
* [cite_start]**Thả tim:** Tính năng "Like" để yêu thích cuộc thăm dò[cite: 12].

## 🛠️ Công nghệ sử dụng

**Backend:**
* Node.js & Express
* Socket.io (Real-time communication)
* MongoDB & Mongoose (Database)
* Cors & Dotenv

**Frontend:**
* ReactJS (Hooks: useState, useEffect, useRef)
* Chart.js & React-chartjs-2 (Biểu đồ)
* Socket.io-client
* Axios

## 📂 Cấu trúc thư mục

```text
/
├── server/       # Mã nguồn Backend (Node.js)
├── client/       # Mã nguồn Frontend (ReactJS)
└── README.md     # Tài liệu hướng dẫn
⚙️ Hướng dẫn cài đặt và chạy (Localhost)
Để chạy dự án này trên máy cá nhân, bạn cần cài đặt Node.js và MongoDB.

1. Cài đặt Backend (Server)
Mở terminal tại thư mục server:

Bash

cd server
npm install
Cấu hình kết nối Database:

Mở file server/index.js.

Đảm bảo chuỗi kết nối MongoDB chính xác (Ví dụ: mongodb://127.0.0.1:27017/pollingDB hoặc MongoDB Atlas URL).

Chạy Server:

Bash

npm start
Server sẽ chạy tại: http://localhost:5000

2. Cài đặt Frontend (Client)
Mở một terminal mới tại thư mục client:

Bash

cd client
npm install
Chạy React App:

Bash

npm start