# GitHub Actions 工作流说明

这个项目包含了多个 GitHub Actions 工作流，用于自动化 CI/CD 流程。

## 工作流文件

### 1. `ci-cd.yml` - 主CI/CD流程
完整的持续集成和持续部署流程，包括：

- **代码质量检查**：ESLint、TypeScript 类型检查
- **测试和构建**：单元测试、集成测试、生产构建
- **安全审计**：依赖项安全漏洞检查
- **自动部署**：部署到生产环境（仅main/master分支）

**触发条件**：
- 推送到 `main`、`master` 或 `develop` 分支
- 针对主要分支的 Pull Request

### 2. `docker-deploy.yml` - Docker部署流程
专门用于容器化部署的工作流：

- **Docker镜像构建**：多架构支持（amd64/arm64）
- **容器注册表推送**：GitHub Container Registry
- **自动部署**：支持staging和生产环境
- **健康检查**：部署后自动验证服务状态

**触发条件**：
- 推送到主要分支
- 创建版本标签（v*）

### 3. `pull-request-check.yml` - PR验证流程
轻量级的Pull Request检查：

- **快速检查**：代码格式、类型检查、构建验证
- **变更检测**：自动识别package.json和schema变更
- **自动评论**：PR状态反馈

## 环境变量配置

在GitHub仓库的 Settings > Secrets and variables > Actions 中配置以下secrets：

### 基础配置
- `DATABASE_URL`: PostgreSQL数据库连接字符串
- `JWT_SECRET`: JWT签名密钥
- `JWT_EXPIRES_IN`: JWT过期时间（例如：7d）
- `NEXT_PUBLIC_APP_URL`: 应用公开URL

### 部署配置（如使用Docker部署）
- `STAGING_HOST`: Staging服务器地址
- `STAGING_USER`: Staging服务器用户名
- `STAGING_SSH_KEY`: Staging服务器SSH私钥
- `PRODUCTION_HOST`: 生产服务器地址
- `PRODUCTION_USER`: 生产服务器用户名
- `PRODUCTION_SSH_KEY`: 生产服务器SSH私钥
- `PRODUCTION_URL`: 生产环境URL

### Vercel部署（可选）
- `VERCEL_TOKEN`: Vercel API Token
- `ORG_ID`: Vercel组织ID
- `PROJECT_ID`: Vercel项目ID

## 分支策略

- **`main`/`master`**: 生产环境分支，触发完整CI/CD流程
- **`develop`**: 开发分支，触发CI检查和staging部署
- **其他分支**: 仅触发Pull Request检查

## 使用说明

1. **首次设置**：
   - 配置GitHub Secrets
   - 确保仓库有正确的权限设置
   - 根据需要修改工作流文件

2. **日常开发**：
   - 创建功能分支并开发
   - 提交Pull Request到主要分支
   - 通过自动检查后合并

3. **发布流程**：
   - 合并到`main`/`master`分支
   - 自动触发生产部署
   - 可选择创建版本标签进行版本管理

## 自定义配置

可以根据项目需求调整：
- Node.js版本（当前为18）
- pnpm版本（当前为8）
- 数据库版本和配置
- 部署目标服务器
- 通知和报告设置

## 故障排除

常见问题：
1. **权限问题**：检查GitHub Actions权限设置
2. **环境变量**：确保所有必需的secrets已配置
3. **构建失败**：查看详细的构建日志
4. **部署问题**：检查目标服务器连接和配置