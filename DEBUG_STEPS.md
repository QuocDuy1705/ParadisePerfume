# 🔧 DEBUG STEPS - Kiểm Tra Từng Bước

## ✅ ĐÃ VERIFY

1. ✅ **Server có static files middleware** (server.js line 52)
2. ✅ **File ảnh đã upload thành công** (11 files trong uploads/blog/)
3. ✅ **Server serve ảnh OK** (HTTP 200)
4. ✅ **Frontend render URL đúng** (`http://localhost:5000${blog.image}`)

## ⚠️ VẤN ĐỀ PHÁT HIỆN

**Console có lỗi: `net::ERR_BLOCKED_BY_CLIENT`**

→ Đây là **AdBlock/uBlock Origin/Privacy Badger** đang chặn request!

---

## 🎯 GIẢI PHÁP

### Cách 1: Tắt AdBlock Cho Localhost

**Chrome/Edge:**

1. Click icon AdBlock trên toolbar
2. Chọn "Don't run on pages on this domain"
3. Hoặc: "Pause on this site"

**uBlock Origin:**

1. Click icon uBlock
2. Click nút power (tắt cho site này)
3. Reload trang

### Cách 2: Hard Refresh (Clear Cache)

```
Ctrl + Shift + R
```

hoặc

```
Ctrl + F5
```

### Cách 3: Test Ảnh Trực Tiếp

**Mở tab mới, paste URL:**

```
http://localhost:5000/uploads/blog/blog-1762141646555-421768422.jpg
```

Nếu thấy ảnh → Server OK, vấn đề là AdBlock!

---

## 🧪 TEST UPLOAD MỚI

### BƯỚC 1: Prepare

1. Tắt AdBlock cho `localhost:3000`
2. Hard refresh: `Ctrl + Shift + R`
3. Open DevTools (F12) → Console tab

### BƯỚC 2: Upload

1. Edit blog "Dior Sauvage - Hương Thơm Nam Tính Năm Họa"
2. Choose file ảnh (< 5MB)
3. Click "Cập Nhật Blog"

### BƯỚC 3: Verify Console

**Xem console logs:**

```javascript
// Should see:
✅ Update response: {
  message: "Blog updated successfully",
  blog: {
    _id: "...",
    image: "/uploads/blog/blog-xxx.jpg",  ← CHECK THIS
    ...
  }
}
```

### BƯỚC 4: Verify Network Tab

1. DevTools → Network tab
2. Filter: `Img`
3. Look for: `blog-xxx.jpg`
4. Status should be: **200** (not 404, not blocked)

### BƯỚC 5: Verify Database

**Run in terminal:**

```powershell
cd server
node -e "import('mongodb').then(({MongoClient})=>{const client=new MongoClient('mongodb://localhost:27017');client.connect().then(()=>{client.db('perfume').collection('blogs').find({},{image:1,title:1}).toArray().then(r=>{console.log(r);client.close()})})})"
```

**Check `image` field có giá trị:**

```json
{
  "_id": "...",
  "title": "Dior Sauvage...",
  "image": "/uploads/blog/blog-xxx.jpg"  ← Should exist!
}
```

---

## 🚨 NÊU VẤẤN ĐỀ VẪN TỒN TẠI

### Debug Script - Paste vào Console

```javascript
// 1. Check blogs data
console.log("📊 Total blogs:", blogs.length);
blogs.forEach((blog, i) => {
  console.log(`${i + 1}. ${blog.title}`);
  console.log(`   Image: ${blog.image || "NO IMAGE"}`);
  console.log(
    `   Full URL: ${blog.image ? `http://localhost:5000${blog.image}` : "N/A"}`
  );
});

// 2. Test first blog image load
const testBlog = blogs.find((b) => b.image);
if (testBlog) {
  console.log(`\n🧪 Testing image: ${testBlog.title}`);
  const img = new Image();
  img.onload = () => console.log("✅ Image LOADED successfully!");
  img.onerror = (e) => console.log("❌ Image FAILED to load!", e);
  img.src = `http://localhost:5000${testBlog.image}`;
} else {
  console.log("⚠️ No blog has image!");
}

// 3. Check AdBlock
console.log("\n🛡️ AdBlock Check:");
fetch("http://localhost:5000/uploads/blog/blog-1762141646555-421768422.jpg")
  .then((r) => console.log("✅ Fetch OK, status:", r.status))
  .catch((e) => console.log("❌ Fetch BLOCKED:", e.message));
```

**Expected Output:**

```
📊 Total blogs: 5
1. Dior Sauvage - Hương Thơm Nam Tính Năm Họa
   Image: /uploads/blog/blog-xxx.jpg
   Full URL: http://localhost:5000/uploads/blog/blog-xxx.jpg
...

🧪 Testing image: Dior Sauvage...
✅ Image LOADED successfully!

🛡️ AdBlock Check:
✅ Fetch OK, status: 200
```

**If you see:**

```
❌ Image FAILED to load!
❌ Fetch BLOCKED: Failed to fetch
```

→ **100% là AdBlock đang chặn!**

---

## 📸 SCREENSHOT REQUEST

**Chụp cho tôi xem:**

1. **Console tab** sau khi upload ảnh
2. **Network tab** (filter Img) - show request status
3. **Kết quả debug script** ở trên

Tôi sẽ chỉ cho bạn chính xác vấn đề! 🎯
