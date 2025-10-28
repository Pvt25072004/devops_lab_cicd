FROM node:18

WORKDIR /app

# 1. Sao chép TẤT CẢ các tệp dự án (bao gồm package.json, server.js, v.v.)
COPY . .

# 2. CHỈ SAU ĐÓ mới chạy npm install
RUN npm install

# 3. Expose cổng (dựa trên tệp .env.prod của bạn)
EXPOSE 80

# 4. Chạy ứng dụng
CMD ["node", "server.js"]