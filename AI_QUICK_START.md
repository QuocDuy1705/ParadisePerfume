# 🤖 AI RECOMMENDATION - QUICK START

## ✅ HOÀN THÀNH 100%

### Files đã tạo:

```
Backend:
✅ server/services/aiRecommendation.service.js  (Core AI logic)
✅ server/controllers/aiController.js           (API handlers)
✅ server/routes/aiRoutes.js                    (Routes)
✅ server/server.js                              (Updated with AI routes)
✅ server/.env                                   (Added OPENAI_API_KEY)

Frontend:
✅ client/src/components/AIRecommendation.jsx   (Quiz + Results UI)
✅ client/src/assets/styles/aiRecommendation.css (Styling)
✅ client/src/App.jsx                            (Added /ai-recommend route)
✅ client/src/components/Header.jsx              (Added AI button)
✅ client/src/assets/styles/header.css           (AI button styling)

Documentation:
✅ AI_RECOMMENDATION_SETUP.md                   (Full guide)
```

---

## 🚀 CÁCH SỬ DỤNG NGAY

### Option 1: Với OpenAI API (Khuyến nghị)

1. **Lấy API Key**:

   - Đăng ký: https://platform.openai.com/signup
   - Nạp tiền $5: https://platform.openai.com/account/billing
   - Tạo key: https://platform.openai.com/api-keys
   - Copy key (format: `sk-proj-xxx...`)

2. **Cập nhật .env**:

   ```bash
   # File: server/.env
   OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
   ```

3. **Khởi động**:

   ```bash
   cd server
   npm start
   ```

4. **Truy cập**:
   - Click "🤖 AI TƯ VẤN" trên Header
   - Hoặc: http://localhost:5173/ai-recommend

---

### Option 2: Không cần OpenAI (Fallback Mode)

1. **Giữ nguyên .env** (không thay đổi gì)

2. **Khởi động server**:

   ```bash
   cd server
   npm start
   ```

3. **Hệ thống tự động chuyển sang fallback mode**:
   - Vẫn hoạt động bình thường
   - Gợi ý dựa trên rules (không dùng AI)
   - Kém chính xác hơn nhưng vẫn hữu ích

---

## 📊 API ENDPOINTS

```
GET  /api/ai/quiz          → Lấy câu hỏi quiz (7 câu hỏi)
POST /api/ai/recommend     → Nhận gợi ý AI (3 sản phẩm)
POST /api/ai/feedback      → Gửi feedback (TODO)
```

---

## 🎯 TÍNH NĂNG

### Quiz System:

- ✅ 7 câu hỏi về sở thích (giới tính, tuổi, dịp, phong cách...)
- ✅ Progress bar tracking
- ✅ Single & Multiple choice
- ✅ Validation & smooth navigation

### AI Analysis:

- ✅ GPT-4o-mini model (nhanh, rẻ, chính xác)
- ✅ Phân tích tính cách từ câu trả lời
- ✅ Match với database products
- ✅ Score độ phù hợp (0-100%)

### Results Display:

- ✅ 3 sản phẩm được gợi ý với ranking
- ✅ Giải thích lý do chi tiết
- ✅ Tips sử dụng
- ✅ Best occasions
- ✅ Link to product details

---

## 💰 CHI PHÍ (OpenAI Mode)

| Users  | Requests/tháng | Chi phí |
| ------ | -------------- | ------- |
| 100    | 500            | ~$0.75  |
| 1,000  | 5,000          | ~$7.50  |
| 10,000 | 50,000         | ~$75    |

**Mỗi recommendation**: ~$0.0015 (1.5 cent)

---

## 🎨 UI/UX

- **Design**: Chanel-inspired với gradient purple/blue
- **Button**: "🤖 AI TƯ VẤN" nổi bật trên Header
- **Loading**: Animated spinner với message
- **Results**: Card-based layout với badges
- **Responsive**: Mobile-friendly

---

## 🔧 TROUBLESHOOTING

**OpenAI không hoạt động?**
→ Hệ thống tự động fallback, vẫn dùng được

**"Rate limit exceeded"?**
→ Chờ 1 phút, hoặc nạp thêm tiền

**"No products found"?**
→ Chạy: `npm run seed` trong folder server

---

## 📈 NEXT FEATURES (Optional)

- [ ] Save recommendation history
- [ ] Learning from user feedback
- [ ] Image upload search
- [ ] Voice input quiz
- [ ] Chat với AI consultant

---

## ✅ CHECKLIST KIỂM TRA

- [x] OpenAI package installed
- [x] Service layer created
- [x] Controller & routes setup
- [x] Frontend component built
- [x] Styling complete
- [x] Header integration
- [x] Route added to App.jsx
- [x] .env configured
- [x] Fallback mode implemented
- [x] Documentation complete

---

## 🎉 READY TO USE!

**Truy cập ngay**: http://localhost:5173/ai-recommend

**Hoặc click**: Button "🤖 AI TƯ VẤN" trên Header

**Enjoy AI-powered perfume recommendations! 🌟**
