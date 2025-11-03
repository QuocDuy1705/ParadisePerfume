# 🤖 AI RECOMMENDATION ENGINE - HƯỚNG DẪN CÀI ĐẶT

## ✅ ĐÃ HOÀN THÀNH

### Backend Setup ✅

- [x] Cài đặt OpenAI SDK (`npm install openai`)
- [x] Tạo AI Recommendation Service (`server/services/aiRecommendation.service.js`)
- [x] Tạo AI Controller (`server/controllers/aiController.js`)
- [x] Tạo AI Routes (`server/routes/aiRoutes.js`)
- [x] Thêm route vào `server.js`
- [x] Thêm OPENAI_API_KEY vào `.env`

### Frontend Setup ✅

- [x] Tạo AIRecommendation Component (`client/src/components/AIRecommendation.jsx`)
- [x] Tạo CSS cho AI Component (`client/src/assets/styles/aiRecommendation.css`)
- [x] Thêm route `/ai-recommend` vào `App.jsx`
- [x] Thêm button "🤖 AI TƯ VẤN" vào Header
- [x] Styling cho AI nav button

---

## 🔑 BƯỚC QUAN TRỌNG: LẤY OPENAI API KEY

### Tùy chọn 1: Sử dụng OpenAI (Khuyến nghị) 💰

**Chi phí**: ~$0.002 - $0.02 per recommendation (rất rẻ với GPT-4o-mini)

1. **Đăng ký tài khoản OpenAI**:

   - Truy cập: https://platform.openai.com/signup
   - Đăng ký với email hoặc Google account

2. **Nạp tiền vào tài khoản**:

   - Vào: https://platform.openai.com/account/billing/overview
   - Click "Add payment details"
   - Nạp tối thiểu $5 (có thể dùng 2-3 tháng)
   - OpenAI chấp nhận: Visa, Mastercard (International cards)

3. **Tạo API Key**:

   - Vào: https://platform.openai.com/api-keys
   - Click "Create new secret key"
   - Đặt tên: "Paradise Perfume Recommendation"
   - Copy key (chỉ hiện 1 lần!)
   - Format: `sk-proj-xxxxxxxxxxxxxxxxxxxxxx`

4. **Thêm vào .env**:

   ```bash
   # File: server/.env
   OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxx
   ```

5. **Kiểm tra giới hạn**:
   - Usage limits: https://platform.openai.com/account/limits
   - Tài khoản mới: 200 requests/day
   - Sau nạp tiền: 500-10,000 requests/day

---

### Tùy chọn 2: Chạy không có OpenAI (Fallback Mode) 🆓

Nếu chưa có API key, hệ thống sẽ tự động chuyển sang **fallback mode**:

- Gợi ý dựa trên rules đơn giản (không dùng AI)
- Lọc theo gender, budget, category
- Vẫn hoạt động tốt nhưng kém chính xác hơn

**Để chạy fallback mode**: Giữ nguyên `.env` với:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

---

## 🚀 CÁCH SỬ DỤNG

### 1. Khởi động server (với OpenAI)

```bash
cd server
npm start
```

**Log khi thành công**:

```
✅ Server running on port 5000
✅ MongoDB Connected: cluster0.xijff.mongodb.net
✅ OpenAI API initialized
```

### 2. Truy cập AI Recommendation

**Các cách truy cập**:

- Click button "🤖 AI TƯ VẤN" trên Header
- Hoặc truy cập trực tiếp: http://localhost:5173/ai-recommend

**Quy trình**:

1. Trả lời 7 câu hỏi về sở thích
2. AI phân tích và gợi ý 3 sản phẩm phù hợp nhất
3. Xem lý do, tips sử dụng cho mỗi sản phẩm
4. Click "Xem Chi Tiết" để xem sản phẩm

---

## 📊 API ENDPOINTS

### 1. Get Quiz Questions

```http
GET /api/ai/quiz
```

**Response**:

```json
{
  "success": true,
  "data": {
    "questions": [
      {
        "id": "gender",
        "question": "Bạn đang tìm nước hoa cho?",
        "type": "single",
        "options": ["Nam", "Nữ", "Unisex"]
      }
      // ... 6 câu hỏi khác
    ],
    "totalQuestions": 7
  }
}
```

### 2. Get AI Recommendations

```http
POST /api/ai/recommend
Content-Type: application/json

{
  "preferences": {
    "gender": "Nam",
    "age": "20-30",
    "season": "Hè",
    "occasion": "Đi làm",
    "style": "Thanh lịch",
    "preferences": ["Tươi mát", "Cam chanh"],
    "budget": "1-3 triệu"
  }
}
```

**Response (AI Mode)**:

```json
{
  "success": true,
  "data": {
    "analysis": "Bạn là người trẻ tuổi, yêu thích sự tươi mát...",
    "recommendations": [
      {
        "productId": "507f1f77bcf86cd799439011",
        "productName": "Dior Sauvage EDT",
        "score": 95,
        "reason": "Hương tươi mát, nam tính phù hợp môi trường công sở...",
        "bestFor": "Sử dụng hàng ngày, đi làm, gặp gỡ đối tác",
        "tips": "Xịt vào cổ tay và cổ áo sau khi tắm",
        "product": {
          "_id": "507f1f77bcf86cd799439011",
          "name": "Dior Sauvage EDT",
          "price": 2500000,
          "image": "/uploads/dior-sauvage.jpg"
        }
      }
      // ... 2 sản phẩm khác
    ],
    "mode": "ai"
  }
}
```

**Response (Fallback Mode)**:

```json
{
  "success": true,
  "data": {
    "analysis": "Chúng tôi đã phân tích sở thích của bạn...",
    "recommendations": [...],
    "mode": "fallback"
  }
}
```

### 3. Submit Feedback (TODO)

```http
POST /api/ai/feedback

{
  "recommendationId": "...",
  "rating": 5,
  "selectedProducts": ["..."]
}
```

---

## 💡 PROMPT ENGINEERING

AI sử dụng prompt được tối ưu hóa cho nước hoa:

```javascript
THÔNG TIN KHÁCH HÀNG:
- Giới tính, độ tuổi, mùa, dịp sử dụng
- Phong cách, ngân sách, sở thích hương

DANH SÁCH SẢN PHẨM:
- Tất cả sản phẩm có sẵn với thông tin chi tiết

NHIỆM VỤ:
- Phân tích tính cách từ câu trả lời
- Match với notes, type, category
- Giải thích lý do cụ thể
- Score độ phù hợp 0-100
```

**Model sử dụng**: `gpt-4o-mini`

- Nhanh hơn GPT-4 (200ms vs 2s)
- Rẻ hơn 60 lần ($0.15/1M tokens vs $2.50/1M)
- Chất lượng tốt cho recommendation task

---

## 🎨 UI/UX FEATURES

### Quiz Interface

- 7 câu hỏi với progress bar
- Single choice & Multiple choice
- Smooth transitions giữa các bước
- Validation trước khi next

### Results Display

- AI Analysis card (gradient purple)
- 3 recommendation cards với:
  - Score badge (độ phù hợp %)
  - Rank badge (#1, #2, #3)
  - Product image & info
  - Detailed reasons & tips
  - "Xem Chi Tiết" button

### Loading State

- Animated spinner
- "AI đang phân tích..." message
- Smooth transition to results

---

## 🔧 TROUBLESHOOTING

### Lỗi: "Authentication error"

```
Error: Incorrect API key provided
```

**Giải pháp**:

1. Kiểm tra API key có đúng format `sk-proj-...`
2. Kiểm tra file `.env` có đúng tên biến `OPENAI_API_KEY`
3. Restart server sau khi sửa `.env`

### Lỗi: "Rate limit exceeded"

```
Error: Rate limit reached for requests
```

**Giải pháp**:

1. Chờ 1 phút rồi thử lại
2. Nâng cấp plan hoặc nạp thêm tiền
3. Check usage: https://platform.openai.com/usage

### Lỗi: "Insufficient credits"

```
Error: You exceeded your current quota
```

**Giải pháp**:

1. Nạp tiền vào tài khoản
2. Hoặc để hệ thống chạy fallback mode

### Lỗi: "No products found"

```
Không tìm thấy sản phẩm nào
```

**Giải pháp**:

1. Kiểm tra database có products chưa
2. Chạy seed: `npm run seed` (trong folder server)

---

## 📈 PERFORMANCE & COST

### Chi phí ước tính (GPT-4o-mini)

| Số lượng users | Requests/tháng | Chi phí/tháng |
| -------------- | -------------- | ------------- |
| 100            | 500            | ~$0.75        |
| 1,000          | 5,000          | ~$7.50        |
| 10,000         | 50,000         | ~$75          |

**Mỗi recommendation**:

- Input: ~1,000 tokens (user prefs + products)
- Output: ~500 tokens (analysis + 3 recommendations)
- Cost: ~$0.0015 per recommendation

### Response time

- Quiz load: < 100ms
- AI recommendation: 1-3 seconds
- Fallback recommendation: < 500ms

---

## 🚀 NEXT STEPS (Tùy chọn nâng cao)

### Phase 2: Cải thiện AI (Optional)

1. **Learning từ feedback**:

   - Lưu user feedback vào database
   - Fine-tune prompts dựa trên data thực
   - A/B testing các prompt khác nhau

2. **Personalization**:

   - Lưu lịch sử gợi ý của user
   - Gợi ý dựa trên purchase history
   - Collaborative filtering

3. **Advanced Features**:
   - Upload ảnh để tìm nước hoa tương tự
   - Voice input cho quiz
   - Chat với AI để tư vấn chi tiết

### Phase 3: Optimization

1. **Caching**:

   - Cache recommendations cho popular combinations
   - Reduce API calls

2. **Batch Processing**:
   - Xử lý nhiều recommendations cùng lúc
   - Giảm cost

---

## 📞 SUPPORT

Nếu gặp vấn đề:

1. Check console logs (F12)
2. Check server logs
3. Verify API key valid
4. Test với fallback mode trước

**Mode hiện tại**:

- Nếu có valid API key → AI Mode ✅
- Nếu không → Fallback Mode 🔄

---

## 🎉 KẾT LUẬN

AI Recommendation Engine đã được tích hợp hoàn chỉnh:

- ✅ Backend: Service + Controller + Routes
- ✅ Frontend: Quiz Component + Results Display
- ✅ Fallback Mode: Hoạt động ngay cả không có API key
- ✅ UI/UX: Chanel-inspired design với gradient effects

**Để bắt đầu sử dụng**:

1. Lấy OpenAI API key (hoặc skip để dùng fallback)
2. Thêm vào `.env`
3. Restart server
4. Truy cập `/ai-recommend`
5. Trải nghiệm AI tư vấn!

🎊 **Chúc mừng! Bạn đã có tính năng AI đầu tiên trong Paradise Perfume!**
