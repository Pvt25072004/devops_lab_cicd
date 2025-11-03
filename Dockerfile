FROM node:18

WORKDIR /app

# Sao chép TẤT CẢ các tệp vào
COPY . .

# --- BƯỚC GỠ LỖI: Liệt kê các tệp BÊN TRONG image ---
RUN ls -la

# Cài đặt dependencies
RUN npm install

EXPOSE 3001

CMD ["node", "server.js"]