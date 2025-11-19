#!/bin/bash

# 阿里云ECS自动部署脚本
# 使用方法: ./scripts/ecs-deploy.sh [服务器IP] [服务器用户名]

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# 检查参数
if [ $# -lt 1 ]; then
    print_message $RED "使用方法: $0 <服务器IP> [用户名]"
    print_message $YELLOW "示例: $0 47.100.200.100 root"
    exit 1
fi

SERVER_IP=$1
SERVER_USER=${2:-root}
PROJECT_NAME="blog-app"
DEPLOY_PATH="/opt/$PROJECT_NAME"

print_message $BLUE "🚀 开始部署到阿里云ECS: $SERVER_USER@$SERVER_IP"

# 1. 检查本地环境
print_message $BLUE "📋 检查本地环境..."
if ! command -v docker &> /dev/null; then
    print_message $RED "❌ Docker未安装，请先安装Docker"
    exit 1
fi

if ! command -v rsync &> /dev/null; then
    print_message $RED "❌ rsync未安装，请先安装rsync"
    exit 1
fi

# 2. 构建Docker镜像
print_message $BLUE "🔨 构建Docker镜像..."
docker build -t $PROJECT_NAME:latest .

# 3. 保存Docker镜像
print_message $BLUE "💾 保存Docker镜像..."
docker save $PROJECT_NAME:latest | gzip > $PROJECT_NAME.tar.gz

# 4. 准备部署文件
print_message $BLUE "📦 准备部署文件..."
rm -f .env.ecs
cat > .env.ecs << EOF
# 生产环境配置
DB_PASSWORD=$(openssl rand -base64 32)
REDIS_PASSWORD=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)
NEXTAUTH_SECRET=$(openssl rand -base64 32)
DOMAIN=https://$SERVER_IP
NODE_ENV=production
EOF

# 5. 测试SSH连接
print_message $BLUE "🔗 测试SSH连接..."
if ! ssh -o BatchMode=yes -o ConnectTimeout=5 $SERVER_USER@$SERVER_IP "echo 'SSH连接成功'" 2>/dev/null; then
    print_message $RED "❌ SSH连接失败，请检查："
    print_message $YELLOW "   1. 服务器IP是否正确: $SERVER_IP"
    print_message $YELLOW "   2. SSH密钥是否已配置"
    print_message $YELLOW "   3. 服务器是否可达"
    exit 1
fi

# 6. 复制文件到服务器
print_message $BLUE "📤 复制文件到服务器..."
rsync -avz --progress \
    --exclude='.git' \
    --exclude='node_modules' \
    --exclude='.next' \
    --exclude='*.log' \
    ./ $SERVER_USER@$SERVER_IP:$DEPLOY_PATH/

rsync -avz --progress \
    $PROJECT_NAME.tar.gz \
    .env.ecs \
    nginx/ \
    $SERVER_USER@$SERVER_IP:$DEPLOY_PATH/

# 7. 服务器端部署
print_message $BLUE "🛠️ 服务器端部署..."
ssh $SERVER_USER@$SERVER_IP << EOF
    set -e

    # 进入项目目录
    cd $DEPLOY_PATH

    # 安装Docker和Docker Compose
    if ! command -v docker &> /dev/null; then
        echo "安装Docker..."
        curl -fsSL https://get.docker.com | sh -s --mirror Aliyun
        systemctl enable docker
        systemctl start docker
    fi

    if ! command -v docker-compose &> /dev/null; then
        echo "安装Docker Compose..."
        curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-\$(uname -s)-\$(uname -m)" -o /usr/local/bin/docker-compose
        chmod +x /usr/local/bin/docker-compose
    fi

    # 加载Docker镜像
    echo "加载Docker镜像..."
    docker load < $PROJECT_NAME.tar.gz

    # 创建必要的目录
    mkdir -p nginx/ssl nginx/logs uploads

    # 生成自签名SSL证书（生产环境建议使用Let's Encrypt）
    if [ ! -f nginx/ssl/cert.pem ]; then
        echo "生成SSL证书..."
        openssl req -x509 -newkey rsa:4096 -keyout nginx/ssl/key.pem -out nginx/ssl/cert.pem -days 365 -nodes \
            -subj "/C=CN/ST=Beijing/L=Beijing/O=Blog/CN=$SERVER_IP"
    fi

    # 停止现有服务
    echo "停止现有服务..."
    docker-compose down

    # 启动服务
    echo "启动服务..."
    docker-compose up -d

    # 等待服务启动
    echo "等待服务启动..."
    sleep 30

    # 检查服务状态
    echo "检查服务状态..."
    docker-compose ps

    # 运行数据库迁移
    echo "运行数据库迁移..."
    docker-compose exec app npx prisma db push
    docker-compose exec app npx prisma generate

    # 初始化数据
    if ! docker-compose exec app npx tsx prisma/seed.ts; then
        echo "数据初始化完成"
    fi

    echo "✅ 部署完成！"
    echo "🌐 网站地址: https://$SERVER_IP"
    echo "🗄️  数据库管理: http://$SERVER_IP:8080"
EOF

# 8. 清理本地文件
print_message $BLUE "🧹 清理本地文件..."
rm -f $PROJECT_NAME.tar.gz

print_message $GREEN "🎉 部署成功！"
print_message $YELLOW "网站地址: https://$SERVER_IP"
print_message $YELLOW "数据库管理: http://$SERVER_IP:8080"
print_message $BLUE "📝 查看日志: ssh $SERVER_USER@$SERVER_IP 'cd $DEPLOY_PATH && docker-compose logs -f'"
print_message $BLUE "🔄 重启服务: ssh $SERVER_USER@$SERVER_IP 'cd $DEPLOY_PATH && docker-compose restart'"