# 🤝 Contributing to Paradise Perfume

Cảm ơn bạn đã quan tâm đến việc đóng góp cho Paradise Perfume! Dưới đây là hướng dẫn để bắt đầu.

## 📋 Code of Conduct

Dự án này tuân thủ [Code of Conduct](CODE_OF_CONDUCT.md). Bằng cách tham gia, bạn cam kết duy trì một môi trường tôn trọng và thân thiện.

## 🚀 Bắt đầu

### 1. Fork Repository

Click nút "Fork" ở góc trên bên phải của trang GitHub

### 2. Clone Fork của bạn

```bash
git clone https://github.com/your-username/ParadisePerfume.git
cd ParadisePerfume
```

### 3. Tạo Branch mới

```bash
git checkout -b feature/your-feature-name
# hoặc
git checkout -b fix/your-bug-fix
```

### 4. Cài đặt Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 5. Cấu hình Environment

Copy `.env.example` thành `.env` và điền thông tin

## 💻 Development Workflow

### Coding Standards

#### JavaScript/React

- Sử dụng **ES6+** syntax
- **Functional components** với hooks
- **Destructuring** cho props
- **Arrow functions** ưu tiên
- **async/await** thay vì promises

#### Naming Conventions

```javascript
// Components: PascalCase
const ProductCard = () => {};

// Functions: camelCase
const handleSubmit = () => {};

// Constants: UPPER_SNAKE_CASE
const API_URL = "http://...";

// Files: kebab-case hoặc PascalCase (components)
product - card.jsx;
ProductCard.jsx;
```

#### Code Style

```javascript
// ✅ Good
const fetchProducts = async () => {
  try {
    const res = await api.get("/products");
    setProducts(res.data);
  } catch (err) {
    console.error("Error:", err);
  }
};

// ❌ Bad
const fetchProducts = () => {
  api
    .get("/products")
    .then((res) => {
      setProducts(res.data);
    })
    .catch((err) => console.log(err));
};
```

### CSS Guidelines

- Sử dụng **BEM** naming convention
- **Mobile-first** approach
- **CSS Variables** cho colors, spacing
- Tránh !important
- Responsive design

```css
/* ✅ Good */
.product-card {
}
.product-card__image {
}
.product-card__title {
}
.product-card--featured {
}

/* ❌ Bad */
.productCard {
}
.card_image {
}
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: Add wishlist functionality
fix: Resolve cart calculation bug
docs: Update API documentation
style: Format code with prettier
refactor: Simplify authentication logic
test: Add cart service tests
chore: Update dependencies
```

## 🧪 Testing

### Run Tests

```bash
# Backend
cd server
npm test

# Frontend
cd client
npm test
```

### Writing Tests

```javascript
// Example test
describe("Product Service", () => {
  it("should fetch products successfully", async () => {
    const products = await fetchProducts();
    expect(products).toBeDefined();
    expect(products.length).toBeGreaterThan(0);
  });
});
```

## 📝 Pull Request Process

### 1. Update Your Branch

```bash
git fetch upstream
git rebase upstream/main
```

### 2. Ensure Quality

- [ ] Code compiles without errors
- [ ] All tests pass
- [ ] No console.log() left in code
- [ ] Code is formatted
- [ ] Documentation updated

### 3. Commit Changes

```bash
git add .
git commit -m "feat: add your feature"
```

### 4. Push to Fork

```bash
git push origin feature/your-feature-name
```

### 5. Create Pull Request

1. Vào GitHub repository của bạn
2. Click "New Pull Request"
3. Điền thông tin:
   - **Title**: Tóm tắt ngắn gọn
   - **Description**: Mô tả chi tiết
   - **Related Issues**: Link issue liên quan
   - **Screenshots**: (nếu có UI changes)

### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How Has This Been Tested?

- [ ] Unit tests
- [ ] Integration tests
- [ ] Manual testing

## Screenshots (if applicable)

![Screenshot](url)

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests pass locally
```

## 🐛 Reporting Bugs

### Before Submitting

- Check [existing issues](https://github.com/QuocDuy1705/ParadisePerfume/issues)
- Try latest version
- Collect error messages, logs

### Bug Report Template

```markdown
**Describe the bug**
A clear description of the bug

**To Reproduce**
Steps to reproduce:

1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen

**Screenshots**
If applicable

**Environment:**

- OS: [e.g. Windows 11]
- Browser: [e.g. Chrome 120]
- Node Version: [e.g. 18.17.0]

**Additional context**
Any other relevant information
```

## 💡 Feature Requests

### Feature Request Template

```markdown
**Is your feature related to a problem?**
Description of the problem

**Describe the solution**
How you'd like it to work

**Describe alternatives**
Other solutions you've considered

**Additional context**
Screenshots, mockups, etc.
```

## 📚 Documentation

### Where to Update

- **README.md**: General info, setup
- **API_DOCUMENTATION.md**: API endpoints
- **DEPLOYMENT.md**: Deployment guides
- **Code comments**: Complex logic

### Documentation Style

```javascript
/**
 * Fetches products from database
 * @param {Object} filters - Filter options
 * @param {string} filters.category - Product category
 * @param {number} filters.page - Page number
 * @returns {Promise<Array>} List of products
 */
const fetchProducts = async (filters) => {
  // Implementation
};
```

## 🎨 Design Guidelines

### UI/UX Principles

- **Simplicity**: Clean, minimal design
- **Consistency**: Use existing components
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Optimize images, lazy load
- **Mobile-first**: Responsive design

### Color Palette

```css
--admin-black: #000000;
--admin-white: #ffffff;
--admin-gray-light: #f5f5f5;
--admin-gray: #e5e5e5;
--admin-gray-dark: #666666;
```

## 🔍 Code Review

### What We Look For

- **Functionality**: Does it work?
- **Code Quality**: Clean, readable code
- **Performance**: No unnecessary operations
- **Security**: No vulnerabilities
- **Tests**: Adequate test coverage
- **Documentation**: Clear comments

### Review Process

1. Automated tests run
2. Code review by maintainer
3. Feedback/changes requested
4. Approval and merge

## 🎉 Recognition

Contributors will be:

- Listed in README.md
- Mentioned in release notes
- Given credit in commits

## 📞 Getting Help

- **Discord**: [Join our server](link)
- **GitHub Issues**: Open an issue
- **Email**: your.email@example.com

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for making Paradise Perfume better! 🌸**
