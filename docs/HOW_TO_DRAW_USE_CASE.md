# 🎨 HƯỚNG DẪN VẼ USE CASE DIAGRAM

## 📋 Các Cách Tạo Hình Vẽ

Tôi đã tạo sẵn 2 file PlantUML cho bạn:

### 1. **use-case-diagram.puml** (Chi tiết - 27 use cases)

- Bao gồm tất cả 27 use cases
- Có màu sắc phân biệt modules
- Có notes giải thích
- Đầy đủ relationships

### 2. **use-case-diagram-simple.puml** (Đơn giản - Tóm tắt)

- Chỉ use cases chính
- Dễ nhìn, gọn gàng
- Phù hợp cho presentation

---

## 🚀 CÁCH 1: Sử dụng Online PlantUML

### Bước 1: Truy cập PlantUML Online

Mở trình duyệt và vào: **http://www.plantuml.com/plantuml/uml/**

### Bước 2: Copy Code

1. Mở file `use-case-diagram.puml` hoặc `use-case-diagram-simple.puml`
2. Copy toàn bộ nội dung

### Bước 3: Paste và Render

1. Paste code vào ô bên trái
2. Click "Submit" hoặc nhấn Ctrl+Enter
3. Hình vẽ sẽ hiển thị bên phải

### Bước 4: Download Hình

1. Click chuột phải vào hình
2. Chọn "Save image as..."
3. Lưu dưới dạng PNG hoặc SVG

**Link trực tiếp:**

- PlantUML Editor: https://www.plantuml.com/plantuml/uml/
- PlantText: https://www.planttext.com/

---

## 🚀 CÁCH 2: Sử dụng VS Code Extension

### Bước 1: Cài Extension

1. Mở VS Code
2. Vào Extensions (Ctrl+Shift+X)
3. Tìm "PlantUML"
4. Cài extension "PlantUML" by jebbs

### Bước 2: Cài Java (Nếu chưa có)

PlantUML cần Java để chạy:

- Download Java: https://www.java.com/download/

### Bước 3: Preview Diagram

1. Mở file `.puml` trong VS Code
2. Nhấn `Alt+D` để preview
3. Hoặc: Right click → "Preview Current Diagram"

### Bước 4: Export

1. Right click trong file .puml
2. Chọn "Export Current Diagram"
3. Chọn format: PNG, SVG, PDF

---

## 🚀 CÁCH 3: Import vào Astah UML

### Option A: Vẽ theo file PlantUML

1. **Mở Astah**

   - File → New → Use Case Diagram

2. **Tham khảo file .puml**

   - Mở file `use-case-diagram.puml`
   - Đọc code để biết:
     - Actors nào
     - Use cases nào
     - Relationships như thế nào

3. **Vẽ từng phần:**
   - Thêm 3 actors (Guest, Customer, Admin)
   - Thêm 27 use cases
   - Vẽ associations
   - Thêm include/extend

### Option B: Import từ hình ảnh

1. **Generate PNG từ PlantUML**

   - Sử dụng cách 1 hoặc 2 để tạo PNG

2. **Insert vào Astah**
   - Astah → Insert → Image
   - Chọn file PNG vừa tạo
   - Dùng làm background để vẽ đè lên

---

## 🚀 CÁCH 4: Sử dụng Draw.io

### Bước 1: Mở Draw.io

Truy cập: https://app.diagrams.net/

### Bước 2: Tạo Diagram Mới

1. File → New
2. Chọn "Blank Diagram"
3. Đặt tên: "Paradise Use Case Diagram"

### Bước 3: Vẽ theo Template

**Thêm Actors:**

1. Từ sidebar trái → More Shapes
2. Tìm "UML" → Enable
3. Kéo "Actor" vào canvas
4. Tạo 3 actors: Guest, Customer, Admin

**Thêm Use Cases:**

1. Kéo "Use Case" (oval) từ UML shapes
2. Đặt tên theo file PlantUML
3. Sắp xếp theo modules

**Thêm System Boundary:**

1. Kéo "Rectangle" từ General shapes
2. Resize to fit tất cả use cases
3. Đặt tên: "Paradise Perfume System"

**Kết nối:**

1. Chọn "Connector" tool
2. Kéo từ Actor → Use Case
3. Chọn style: Arrow, Dotted line, etc.

### Bước 4: Export

1. File → Export as → PNG/SVG/PDF
2. Chọn quality và download

---

## 🎨 TEMPLATE MẪU CHO ASTAH

### Layout Structure:

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Guest (Left Top)              [SYSTEM BOUNDARY]        Admin   │
│     |                                                      |     │
│     |-> Guest Use Cases (Blue Box)                       |      │
│     |   - UC-01 to UC-06                                 |      │
│     |                                                     |      │
│  Customer (Left Middle)                                  |      │
│     |                                                     |      │
│     |-> Customer Use Cases (Green Box)        <----------|      │
│     |   - UC-07 to UC-19                                 |      │
│     |                                                     |      │
│     |                                                     |      │
│     |                                    Admin Use Cases  |      │
│     |                                    (Red Box)        |      │
│     |                                    - UC-20 to UC-27-|      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📐 ASTAH: Vẽ Từng Bước Chi Tiết

### Step 1: Setup Canvas

```
1. Astah → File → New → Use Case Diagram
2. Click canvas
3. Right click → Property → Set size to A3
```

### Step 2: Add Actors

```
1. Toolbar → Actor (stick figure icon)
2. Click vào vị trí muốn đặt
3. Đặt tên:
   - Guest (x: 50, y: 100)
   - Customer (x: 50, y: 300)
   - Admin (x: 900, y: 200)
```

### Step 3: Add Generalization

```
1. Toolbar → Generalization (triangle arrow)
2. Click Customer → kéo đến Guest
3. Để tạo relationship "Customer kế thừa Guest"
```

### Step 4: Add System Boundary

```
1. Toolbar → System/Package
2. Drag rectangle: (x: 150, y: 50, w: 700, h: 600)
3. Đặt tên: "Paradise Perfume E-Commerce System"
```

### Step 5: Add Use Cases - Guest Module

```
1. Toolbar → Use Case (oval)
2. Click trong system boundary
3. Tạo 6 use cases:
   Position (x: 200, y: 80, spacing: 70)
   - UC-01: Xem Danh Sách Sản Phẩm
   - UC-02: Tìm Kiếm Sản Phẩm
   - UC-03: Xem Chi Tiết Sản Phẩm
   - UC-04: Xem Blog
   - UC-05: Đăng Ký Tài Khoản
   - UC-06: Đăng Nhập
```

### Step 6: Add Use Cases - Customer Module

```
Position (x: 300, y: 250, spacing: 60)
- UC-07 đến UC-19 (13 use cases)
```

### Step 7: Add Use Cases - Admin Module

```
Position (x: 700, y: 100, spacing: 65)
- UC-20 đến UC-27 (8 use cases)
```

### Step 8: Add Associations

```
1. Toolbar → Association (line)
2. Click Actor → Click Use Case
3. Vẽ tất cả connections theo file PlantUML
```

### Step 9: Add Include/Extend

```
1. Toolbar → Dependency
2. Click source use case → Click target
3. Right click line → Properties
4. Stereotype: Chọn <<include>> hoặc <<extend>>
```

### Step 10: Format

```
1. Select all use cases
2. Right click → Format
3. Fill color:
   - Guest use cases: #BBDEFB (light blue)
   - Customer use cases: #C8E6C9 (light green)
   - Admin use cases: #FFCDD2 (light red)
4. Font: Arial 10pt
```

### Step 11: Add Notes

```
1. Toolbar → Note
2. Click vị trí muốn đặt
3. Type nội dung
4. Link note to use case:
   - Toolbar → Anchor
   - Click note → Click use case
```

### Step 12: Align

```
1. Select multiple use cases (Shift+Click)
2. Menu → Format → Align
3. Chọn: Align Left / Align Top / Distribute Vertically
```

### Step 13: Export

```
1. File → Export → Image
2. Format: PNG (300 DPI)
3. Size: A3
4. Save
```

---

## 💡 TIPS VẼ ĐẸP

### Colors:

- **Guest module:** Light Blue (#BBDEFB)
- **Customer module:** Light Green (#C8E6C9)
- **Admin module:** Light Red (#FFCDD2)
- **Helper use cases:** Light Orange (#FFE0B2)

### Fonts:

- **Actor names:** Bold, 12pt
- **Use case names:** Regular, 10pt
- **System boundary:** Bold, 14pt

### Spacing:

- Between use cases: 60-70px
- Between modules: 100px
- Margin from boundary: 30px

### Arrows:

- **Association:** Solid line
- **Include:** Dashed arrow with <<include>>
- **Extend:** Dashed arrow with <<extend>>
- **Generalization:** Solid line with triangle

---

## 🔗 LINKS HỮU ÍCH

### PlantUML:

- Editor Online: http://www.plantuml.com/plantuml/uml/
- Documentation: https://plantuml.com/use-case-diagram
- Cheat Sheet: https://ogom.github.io/draw_uml/plantuml/

### Draw.io:

- Online Editor: https://app.diagrams.net/
- Desktop App: https://github.com/jgraph/drawio-desktop/releases

### Astah:

- Download: https://astah.net/downloads/
- User Guide: https://astah.net/support/astah-professional/user-guide/

### VS Code Extensions:

- PlantUML: https://marketplace.visualstudio.com/items?itemName=jebbs.plantuml
- Draw.io Integration: https://marketplace.visualstudio.com/items?itemName=hediet.vscode-drawio

---

## 📸 EXAMPLE OUTPUT

Sau khi render file PlantUML, bạn sẽ có hình vẽ như sau:

```
- 3 Actors ở 2 bên (Guest, Customer bên trái, Admin bên phải)
- System boundary ở giữa chứa tất cả use cases
- Use cases được nhóm theo modules với màu sắc riêng
- Các associations kết nối actors với use cases
- Include/Extend relationships được đánh dấu rõ ràng
- Notes giải thích cho các phần quan trọng
```

---

## ❓ TROUBLESHOOTING

### PlantUML không render?

✅ Kiểm tra Java đã cài chưa
✅ Check syntax errors trong file .puml
✅ Thử online editor trước

### Astah import lỗi?

✅ Astah không import trực tiếp PlantUML
✅ Dùng hình PNG làm reference để vẽ

### Hình bị mờ?

✅ Export ở độ phân giải cao (300 DPI)
✅ Dùng SVG thay vì PNG cho vector graphics

---

**Bạn có thể chọn cách nào phù hợp nhất:**

1. **Nhanh nhất:** PlantUML Online (1-2 phút)
2. **Chuyên nghiệp:** Astah UML (15-30 phút)
3. **Linh hoạt:** Draw.io (10-20 phút)
4. **Developer-friendly:** VS Code + PlantUML extension

Chúc bạn vẽ thành công! 🎨
