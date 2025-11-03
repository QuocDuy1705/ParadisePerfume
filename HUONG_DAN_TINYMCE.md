# 📝 HƯỚNG DẪN SỬ DỤNG TINYMCE RICH TEXT EDITOR

## 🎯 Tổng Quan

TinyMCE là editor WYSIWYG (What You See Is What You Get) giúp bạn tạo nội dung blog chuyên nghiệp với formatting đầy đủ.

---

## 🚀 Cách Sử Dụng

### 1️⃣ **Truy Cập Editor**

1. Đăng nhập Admin: `admin@gmail.com` / `1`
2. Vào tab **"Quản Lý Blog"**
3. Click **"Thêm Blog Mới"** hoặc **"Chỉnh sửa"** blog có sẵn
4. TinyMCE hiện ở phần **"Nội Dung"**

---

## 🛠️ Các Tính Năng Toolbar

### **Undo/Redo** ↶ ↷

- **Undo**: Hoàn tác thay đổi
- **Redo**: Làm lại thay đổi đã hoàn tác

### **Blocks** (Headings)

- **Paragraph**: Văn bản thường
- **Heading 1**: Tiêu đề chính (H1) - Cỡ lớn nhất
- **Heading 2**: Tiêu đề phụ (H2) - Có border dưới
- **Heading 3-6**: Tiêu đề nhỏ hơn

**Cách dùng:**

```
H2: GIỚI THIỆU SẢN PHẨM
H3: Đặc Điểm Nổi Bật
Paragraph: Nội dung chi tiết...
```

### **Text Formatting**

- **Bold** (Ctrl+B): **In đậm**
- **Italic** (Ctrl+I): _In nghiêng_
- **Forecolor**: Đổi màu chữ (click để chọn màu)

### **Alignment** (Căn Lề)

- **Left**: Căn trái
- **Center**: Căn giữa
- **Right**: Căn phải
- **Justify**: Căn đều hai bên

### **Lists** (Danh Sách)

- **Bullet List**: Danh sách dấu chấm

  - Item 1
  - Item 2
  - Item 3

- **Numbered List**: Danh sách đánh số

  1. Bước 1
  2. Bước 2
  3. Bước 3

- **Outdent/Indent**: Giảm/tăng lề

### **Links** 🔗

1. Bôi đen text cần link
2. Click nút **Link**
3. Nhập URL (ví dụ: `https://chanel.com`)
4. Click **Save**

**Kết quả:** [Chanel Official](https://chanel.com)

### **Images** 🖼️

**Cách 1: Upload từ máy**

1. Click nút **Image**
2. Tab **Upload** → Click **Choose File**
3. Chọn ảnh từ máy (JPG, PNG)
4. Ảnh sẽ tự động chuyển thành base64 và insert

**Cách 2: Dùng URL**

1. Click nút **Image**
2. Tab **Source** → Nhập URL ảnh
3. Example: `https://example.com/perfume.jpg`

**Lưu ý:**

- Ảnh trong content khác với ảnh đại diện blog
- Ảnh sẽ tự động responsive (max-width: 100%)

### **Code View** 💻

- Click nút **Code** để xem HTML
- Có thể edit HTML trực tiếp
- Hữu ích khi cần paste nội dung từ nguồn khác

### **Remove Format** 🧹

- Xóa toàn bộ formatting
- Chỉ giữ lại text thuần

---

## 📐 Tips & Best Practices

### ✅ **Cấu Trúc Blog Tốt**

```
H2: GIỚI THIỆU
Paragraph: Đoạn mở đầu giới thiệu chủ đề...

H2: NỘI DUNG CHÍNH
H3: Phần 1
- Bullet point 1
- Bullet point 2

H3: Phần 2
1. Numbered step 1
2. Numbered step 2

H2: KẾT LUẬN
Paragraph: Tóm tắt và call-to-action...
```

### ✅ **Formatting Recommendations**

**Headings:**

- Dùng H2 cho các section chính
- Dùng H3 cho sub-sections
- Tránh dùng H1 (dành cho title blog)

**Paragraphs:**

- Mỗi đoạn 3-5 câu
- Thêm khoảng trống giữa các đoạn

**Bold/Italic:**

- **Bold**: Nhấn mạnh từ khóa quan trọng
- _Italic_: Tên thương hiệu, thuật ngữ nước ngoài

**Lists:**

- Bullet list: Danh sách không theo thứ tự (features, benefits)
- Numbered list: Hướng dẫn từng bước

**Images:**

- Insert ảnh liên quan đến nội dung
- Thêm ảnh sau mỗi 2-3 paragraphs
- Kích thước đề xuất: 800x600px

---

## 🎨 Ví Dụ Thực Tế

### **Blog về Chanel No.5**

```html
<h2>GIỚI THIỆU CHANEL NO.5</h2>

<p>
  Chanel No.5 là một trong những <strong>nước hoa kinh điển</strong> nhất mọi
  thời đại. Ra đời năm 1921, nó đã trở thành
  <em>biểu tượng của sự sang trọng</em> và phong cách.
</p>

<h3>Đặc Điểm Nổi Bật</h3>

<ul>
  <li><strong>Hương chính:</strong> Hoa nhài, hoa hồng, vani</li>
  <li><strong>Độ lưu hương:</strong> 8-12 giờ</li>
  <li><strong>Phù hợp:</strong> Dạ tiệc, sự kiện quan trọng</li>
</ul>

<h3>Bảng Giá Chi Tiết</h3>

<ol>
  <li>Eau de Toilette 50ml: 2,500,000 VNĐ</li>
  <li>Eau de Parfum 100ml: 5,800,000 VNĐ</li>
  <li>Parfum 15ml: 8,000,000 VNĐ</li>
</ol>

<p style="text-align: center;">
  <img src="chanel-no5.jpg" alt="Chanel No.5" />
</p>

<h2>KẾT LUẬN</h2>

<p>
  Chanel No.5 xứng đáng là <strong>lựa chọn hàng đầu</strong> cho những ai yêu
  thích sự thanh lịch và đẳng cấp.
</p>
```

---

## 🔥 Shortcuts Quan Trọng

| Shortcut | Chức Năng   |
| -------- | ----------- |
| Ctrl + B | Bold        |
| Ctrl + I | Italic      |
| Ctrl + Z | Undo        |
| Ctrl + Y | Redo        |
| Ctrl + K | Insert Link |

---

## 🐛 Xử Lý Lỗi Thường Gặp

### ❌ **Ảnh không hiển thị**

**Nguyên nhân:** URL ảnh sai hoặc bị chặn CORS  
**Giải pháp:** Dùng upload từ máy thay vì URL

### ❌ **Formatting bị mất khi save**

**Nguyên nhân:** Chưa click vào editor trước khi submit  
**Giải pháp:** Click vào editor, đợi nó load xong rồi mới submit

### ❌ **Editor không load**

**Nguyên nhân:** Mất kết nối internet hoặc CDN TinyMCE bị lỗi  
**Giải pháp:** Kiểm tra internet, refresh trang

---

## 📊 Checklist Trước Khi Publish

- [ ] Có ít nhất 1 H2 heading
- [ ] Mỗi đoạn văn 3-5 câu
- [ ] Dùng bold cho từ khóa quan trọng
- [ ] Có ít nhất 1 bullet/numbered list
- [ ] Insert ảnh liên quan (nếu có)
- [ ] Kiểm tra link hoạt động
- [ ] Preview trước khi save
- [ ] Spell check lại toàn bộ nội dung

---

## 🎓 Học Thêm

**Xem HTML Code:**

- Click nút "Code" để xem HTML
- Học cách structure tốt bằng cách xem blog mẫu

**Practice Makes Perfect:**

- Thử tạo 1 blog test
- Thử nghiệm tất cả toolbar buttons
- Xem preview để check kết quả

---

**Happy Blogging! 🚀**
