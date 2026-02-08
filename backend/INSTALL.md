# 📦 Backend 依赖安装指南

## 🎯 完整依赖列表

### 核心依赖（必须）
```
Flask==3.0.0              # Web 框架
Flask-CORS==4.0.0         # 跨域支持
requests==2.31.0          # HTTP 请求
python-dotenv==1.0.0      # 环境变量管理
openai==0.28.1            # OpenAI API（用于 AI 功能）
```

### 生产环境依赖（可选）
```
gunicorn==21.2.0          # WSGI 服务器（用于生产环境）
supervisor==4.2.5         # 进程管理（用于后台运行）
```

---

## 🚀 快速安装

### 方法 1: 使用 pip（推荐）

```bash
cd Hackathon/backend

# 安装所有依赖
pip install -r requirements.txt

# 或使用国内镜像（更快）
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
```

### 方法 2: 使用虚拟环境（推荐用于开发）

```bash
cd Hackathon/backend

# 创建虚拟环境
python -m venv venv

# 激活虚拟环境
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt
```

### 方法 3: 使用 conda

```bash
cd Hackathon/backend

# 创建 conda 环境
conda create -n mimialpha python=3.9

# 激活环境
conda activate mimialpha

# 安装依赖
pip install -r requirements.txt
```

---

## 📋 各服务所需依赖

### 1. AI 助手服务 (`ai_assistant_server_openai.py`)
```
✅ Flask
✅ Flask-CORS
✅ openai
✅ python-dotenv
✅ requests
```

### 2. 风险评估服务 (`risk_assessment_api_openai.py`)
```
✅ Flask
✅ Flask-CORS
✅ openai
✅ python-dotenv
✅ requests
```

### 3. 争议仲裁服务 (`dispute_arbitration_api.py`)
```
✅ Flask
✅ Flask-CORS
✅ requests
✅ python-dotenv
```

### 4. 其他 API 服务
```
✅ Flask
✅ Flask-CORS
✅ requests
✅ python-dotenv
```

---

## 🔍 验证安装

### 检查 Python 版本
```bash
python --version
# 应该显示: Python 3.8+ 或更高
```

### 检查已安装的包
```bash
pip list
```

应该看到：
```
Flask                3.0.0
Flask-Cors           4.0.0
openai               0.28.1
python-dotenv        1.0.0
requests             2.31.0
gunicorn             21.2.0 (可选)
supervisor           4.2.5 (可选)
```

### 测试导入
```bash
python -c "import flask; import openai; print('✅ 所有依赖安装成功')"
```

---

## ⚠️ 常见问题

### 1. pip 安装速度慢

**解决方案**：使用国内镜像

```bash
# 临时使用
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple

# 永久配置
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
```

### 2. 权限错误（Permission denied）

**解决方案**：使用 `--user` 参数

```bash
pip install --user -r requirements.txt
```

### 3. 找不到 pip 命令

**解决方案**：使用 `python -m pip`

```bash
python -m pip install -r requirements.txt
```

### 4. SSL 证书错误

**解决方案**：使用 `--trusted-host`

```bash
pip install -r requirements.txt --trusted-host pypi.org --trusted-host files.pythonhosted.org
```

### 5. 版本冲突

**解决方案**：使用虚拟环境隔离

```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
pip install -r requirements.txt
```

---

## 🎯 不同环境的安装

### 开发环境（本地）

```bash
# 1. 创建虚拟环境
python -m venv venv
source venv/bin/activate

# 2. 安装依赖
pip install -r requirements.txt

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，添加 OPENAI_API_KEY

# 4. 启动服务
python ai_assistant_server_openai.py
```

### 生产环境（宝塔面板）

```bash
# 1. 上传代码到服务器
cd /www/wwwroot/mimialpha-backend

# 2. 创建虚拟环境
python3 -m venv venv
source venv/bin/activate

# 3. 安装依赖（使用国内镜像）
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple

# 4. 配置环境变量
nano .env
# 添加 OPENAI_API_KEY

# 5. 使用 gunicorn 启动
gunicorn -w 4 -b 0.0.0.0:8000 ai_assistant_server_openai:app
```

### Docker 环境

创建 `Dockerfile`:

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple

COPY . .

EXPOSE 8000

CMD ["python", "ai_assistant_server_openai.py"]
```

构建和运行：

```bash
docker build -t mimialpha-backend .
docker run -p 8000:8000 -e OPENAI_API_KEY=your-key mimialpha-backend
```

---

## 📊 依赖大小

| 包名 | 大小 | 用途 |
|------|------|------|
| Flask | ~1.5 MB | Web 框架 |
| Flask-CORS | ~20 KB | 跨域支持 |
| openai | ~500 KB | OpenAI API 客户端 |
| requests | ~500 KB | HTTP 请求 |
| python-dotenv | ~30 KB | 环境变量 |
| gunicorn | ~800 KB | 生产服务器 |
| **总计** | **~3.5 MB** | |

---

## 🔄 更新依赖

### 更新所有依赖到最新版本

```bash
pip install --upgrade -r requirements.txt
```

### 更新单个依赖

```bash
pip install --upgrade openai
```

### 生成新的 requirements.txt

```bash
pip freeze > requirements.txt
```

---

## 📝 总结

### 最小安装（仅核心功能）
```bash
pip install flask flask-cors requests python-dotenv openai
```

### 完整安装（包含生产环境）
```bash
pip install -r requirements.txt
```

### 验证安装
```bash
python -c "import flask, openai; print('✅ 安装成功')"
```

---

**安装完成后，就可以启动服务了！** 🎉

```bash
# 启动所有服务
./start_all_openai.sh

# 或单独启动
python ai_assistant_server_openai.py
```
