#!/bin/bash

# 服务器端部署脚本 (GitHub Actions 使用)
set -e

echo "🚀 开始服务器端部署..."

# 进入项目目录
cd /opt/blog-app

# 设置环境变量
export NODE_ENV=production
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# 备份当前版本
echo "📦 备份当前版本..."
if [ -d "backup" ]; then
    rm -rf backup
fi
mkdir -p backup
cp -r .next backup/ 2>/dev/null || true
cp -r public backup/ 2>/dev/null || true

# 解压新版本
echo "📂 解压新版本..."
tar -xzf deploy.tar.gz
rm deploy.tar.gz

# 安装依赖
echo "📦 安装依赖..."
pnpm install --frozen-lockfile --prod

# 生成 Prisma 客户端
echo "🔧 生成 Prisma 客户端..."
pnpm prisma generate

# 运行数据库迁移
echo "🗄️ 运行数据库迁移..."
pnpm prisma db push

# 重启应用
echo "🔄 重启应用..."
if pgrep -f "next-server" > /dev/null; then
    pkill -f "next-server"
    sleep 5
fi

nohup pnpm start > /dev/null 2>&1 &

# 等待应用启动
echo "⏳ 等待应用启动..."
sleep 15

# 健康检查
echo "🔍 执行健康检查..."
for i in {1..10}; do
    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        echo "✅ 部署成功！应用运行正常"
        exit 0
    fi
    echo "⏳ 等待应用启动... ($i/10)"
    sleep 5
done

echo "❌ 部署失败，正在回滚..."
# 回滚逻辑
cp -r backup/.next . 2>/dev/null || true
cp -r backup/public . 2>/dev/null || true
nohup pnpm start > /dev/null 2>&1 &
exit 1