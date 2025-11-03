# 🚀 Hướng dẫn Deploy Paradise Perfume

## 📋 Mục lục

1. [Deploy lên Vercel (Frontend)](#deploy-lên-vercel-frontend)
2. [Deploy lên Render (Backend)](#deploy-lên-render-backend)
3. [Deploy lên Railway (Full-stack)](#deploy-lên-railway-full-stack)
4. [Deploy lên VPS](#deploy-lên-vps)

---

## 🎯 Deploy lên Vercel (Frontend)

### Bước 1: Chuẩn bị

1. Đăng ký tài khoản tại [Vercel](https://vercel.com)
2. Connect với GitHub repository của bạn

### Bước 2: Deploy Frontend

1. **Import Project**

   - Click "New Project"
   - Chọn repository `ParadisePerfume`
   - Root Directory: `client`

2. **Build Settings**

   ```
   Framework Preset: Create React App
   Build Command: npm run build
   Output Directory: build
   Install Command: npm install
   ```

3. **Environment Variables**

   ```
   REACT_APP_API_URL=https://your-backend-url.com/api
   ```

4. Click "Deploy"

### Bước 3: Custom Domain (Optional)

- Vào Settings → Domains
- Thêm domain của bạn
- Cấu hình DNS theo hướng dẫn

---

## 🖥️ Deploy lên Render (Backend)

### Bước 1: Chuẩn bị

1. Đăng ký tại [Render](https://render.com)
2. Connect với GitHub

### Bước 2: Deploy Backend

1. **Create New Web Service**

   - Click "New +" → "Web Service"
   - Chọn repository
   - Root Directory: `server`

2. **Settings**

   ```
   Name: paradise-perfume-api
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free (hoặc Starter)
   ```

3. **Environment Variables**
   Thêm tất cả biến từ `.env.example`:

   ```
   PORT=5000
   MONGO_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=https://your-frontend-url.vercel.app
   EMAIL_USER=your_email
   EMAIL_PASS=your_app_password
   VNPAY_TMN_CODE=your_vnpay_code
   VNPAY_HASH_SECRET=your_vnpay_secret
   VNPAY_HOST=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
   ```

4. Click "Create Web Service"

### Bước 3: Cập nhật CORS

Trong file `server/server.js`, update CORS origin:

```javascript
const corsOptions = {
  origin: ["http://localhost:3000", "https://your-frontend-url.vercel.app"],
  credentials: true,
};
```

---

## 🚂 Deploy lên Railway (Full-stack)

### Deploy Backend

1. **Create Project**

   - Đăng nhập [Railway](https://railway.app)
   - New Project → Deploy from GitHub
   - Chọn repository

2. **Configure Service**

   ```
   Root Directory: server
   Start Command: npm start
   ```

3. **Add Environment Variables**

   - Settings → Variables
   - Thêm tất cả biến từ `.env.example`

4. **Generate Domain**
   - Settings → Generate Domain
   - Copy domain URL

### Deploy Frontend

1. **Add New Service**

   - Add Service → GitHub Repo
   - Same repository
   - Root Directory: `client`

2. **Build Settings**

   ```
   Build Command: npm run build
   Start Command: npx serve -s build -l $PORT
   ```

3. **Environment Variables**
   ```
   REACT_APP_API_URL=https://your-backend-railway-url/api
   ```

---

## 🖥️ Deploy lên VPS (Ubuntu)

### Yêu cầu

- Ubuntu 20.04+
- Domain name (optional)
- SSH access

### Bước 1: Setup Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install Nginx
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx

# Install PM2
sudo npm install -g pm2
```

### Bước 2: Clone và Setup Project

```bash
# Clone repository
cd /var/www
sudo git clone https://github.com/QuocDuy1705/ParadisePerfume.git
cd ParadisePerfume

# Setup Backend
cd server
sudo npm install
sudo cp .env.example .env
sudo nano .env  # Edit environment variables

# Setup Frontend
cd ../client
sudo npm install
sudo npm run build
```

### Bước 3: Configure PM2

```bash
# Start backend with PM2
cd /var/www/ParadisePerfume/server
pm2 start npm --name "perfume-api" -- start
pm2 save
pm2 startup
```

### Bước 4: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/paradise-perfume
```

Thêm config:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/ParadisePerfume/client/build;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Socket.IO
    location /socket.io {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/paradise-perfume /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Bước 5: Setup SSL (Optional)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renew
sudo certbot renew --dry-run
```

---

## 🔧 Post-Deployment Checklist

- [ ] Test tất cả chức năng
- [ ] Kiểm tra payment gateways
- [ ] Test realtime chat
- [ ] Kiểm tra email sending
- [ ] Test upload images
- [ ] Verify CORS settings
- [ ] Check MongoDB connection
- [ ] Test responsive design
- [ ] Verify SSL certificate
- [ ] Setup monitoring (optional)

---

## 📊 Monitoring (Optional)

### PM2 Monitoring

```bash
pm2 monit
pm2 logs perfume-api
```

### Nginx Logs

```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## 🆘 Troubleshooting

### Backend không start

```bash
# Check PM2 logs
pm2 logs perfume-api

# Restart
pm2 restart perfume-api
```

### Frontend không load

```bash
# Check Nginx config
sudo nginx -t

# Check build
cd /var/www/ParadisePerfume/client
npm run build
```

### MongoDB connection failed

```bash
# Check MongoDB status
sudo systemctl status mongod

# Restart MongoDB
sudo systemctl restart mongod
```

---

## 📝 Notes

- **Free Hosting Limitations**:

  - Vercel: Build time limit, serverless functions timeout
  - Render: Free tier sleeps after inactivity
  - Railway: $5 credit/month

- **Production Best Practices**:
  - Use environment variables
  - Enable HTTPS
  - Setup CDN for static files
  - Configure backup for database
  - Monitor server resources

---

**Good luck with your deployment! 🚀**
