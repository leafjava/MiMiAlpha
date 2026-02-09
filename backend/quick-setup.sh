#!/bin/bash
# 快速部署脚本

echo "=========================================="
echo "MiMiAlpha 后端快速部署"
echo "=========================================="
echo ""

# 检查 Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 未安装，请先安装 Python3"
    exit 1
fi

echo "✅ Python3 已安装"
echo ""

# 创建虚拟环境
if [ ! -d "venv" ]; then
    echo "📦 创建虚拟环境..."
    python3 -m venv venv
    echo "✅ 虚拟环境创建完成"
else
    echo "✅ 虚拟环境已存在"
fi
echo ""

# 激活虚拟环境
echo "🔧 激活虚拟环境..."
source venv/bin/activate
echo ""

# 安装依赖
echo "📥 安装依赖..."
pip install flask flask-cors openai python-dotenv requests gunicorn
echo "✅ 依赖安装完成"
echo ""

# 检查 .env 文件
if [ ! -f ".env" ]; then
    echo "⚠️  .env 文件不存在，从 .env.example 复制..."
    cp .env.example .env
    echo "⚠️  请编辑 .env 文件，填入你的 OPENAI_API_KEY"
else
    echo "✅ .env 文件已存在"
fi
echo ""

# 启动服务
echo "=========================================="
echo "🚀 准备启动服务..."
echo "=========================================="
echo ""
echo "启动命令："
echo "  ./start_all_openai.sh"
echo ""
echo "或者单独启动："
echo "  python ai_assistant_server.py          # AI 助手 (8000)"
echo "  python risk_assessment_api_openai.py   # 风险评估 (5003)"
echo "  python dispute_arbitration_api_openai.py # 争议仲裁 (5004)"
echo "  python payment_governance_api_openai.py  # 支付治理 (8006)"
echo "  python yield_calculation_api.py         # 收益计算 (8005)"
echo ""
echo "=========================================="
echo "✅ 部署完成！"
echo "=========================================="
