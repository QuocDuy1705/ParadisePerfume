# Blog Seed Script

## Mô tả

Script này tạo 5 bài blog mẫu dựa trên sản phẩm nước hoa, bao gồm:

1. **Chanel No. 5 - Biểu Tượng Nước Hoa Huyền Thoại** (luxury-brands)
2. **Dior Sauvage - Hương Thơm Nam Tính Mạnh Mẽ** (brands)
3. **Cách Chọn Nước Hoa Phù Hợp Với Từng Mùa** (how-to-choose)
4. **Bí Quyết Bảo Quản Nước Hoa Để Giữ Hương Thơm Lâu Dài** (perfume-care)
5. **Top 5 Nước Hoa Mini Size Đáng Mua Nhất 2024** (general)

## Cách chạy

```bash
# Từ thư mục server
npm run seed:blogs

# Hoặc
node seed/seedBlogs.js
```

## Kết quả

- Xóa toàn bộ blogs cũ
- Tạo 5 blogs mới với trạng thái `published: true`
- Mỗi blog có đầy đủ: title, slug, category, excerpt, content (HTML), author, tags, meta SEO

## Lưu ý

- Script sẽ xóa TOÀN BỘ blogs hiện có trước khi tạo mới
- Tất cả blogs đều được publish sẵn
- Nếu muốn giữ blogs cũ, hãy comment dòng `await Blog.deleteMany({});`
