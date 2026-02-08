#!/bin/bash

echo "=========================================="
echo "启动 MiMiAlpha 后端服务（OpenAI 版本）"
echo "=========================================="

# 创建必要的目录
mkdir -p logs pids

# 激活虚拟环境（如果存在）
if [ -d "venv" ]; then
    source venv/bin/activate
    echo "✅ 虚拟环境已激活"
fi

# 检查环境变量
if [ -z "$OPENAI_API_KEY" ]; then
    echo "⚠️  警告: OPENAI_API_KEY 未设置"
    echo "   请在 .env 文件中配置或使用: export OPENAI_API_KEY=your-key"
fi

# 启动 AI 助手服务（端口 8000）
echo ""
echo "🚀 启动 AI 助手服务..."
nohup python ai_assistant_server_openai.py > logs/ai_assistant.log 2>&1 &
echo $! > pids/ai_assistant.pid
echo "   ✅ AI 助手服务已启动 (PID: $(cat pids/ai_assistant.pid))"
echo "   📡 http://localhost:8000"

# 等待 1 秒
sleep 1

# 启动风险评估服务（端口 5003）
echo ""
echo "🛡️  启动风险评估服务..."
nohup python risk_assessment_api_openai.py > logs/risk_assessment.log 2>&1 &
echo $! > pids/risk_assessment.pid
echo "   ✅ 风险评估服务已启动 (PID: $(cat pids/risk_assessment.pid))"
echo "   📡 http://localhost:5003"

# 等待 1 秒
sleep 1

# 启动争议仲裁服务（端口 5004）
echo ""
echo "⚖️  启动争议仲裁服务..."
nohup python dispute_arbitration_api_openai.py > logs/dispute.log 2>&1 &
echo $! > pids/dispute.pid
echo "   ✅ 争议仲裁服务已启动 (PID: $(cat pids/dispute.pid))"
echo "   📡 http://localhost:5004"

# 等待 1 秒
sleep 1

# 启动支付治理服务（端口 8006）
echo ""
echo "� 启动列支付治理服务..."
nohup python payment_governance_api_openai.py > logs/payment_governance.log 2>&1 &
echo $! > pids/payment_governance.pid
echo "   ✅ 支付治理服务已启动 (PID: $(cat pids/payment_governance.pid))"
echo "   📡 http://localhost:8006"

echo ""
echo "=========================================="
echo "✅ 所有服务已启动"
echo "=========================================="
echo ""
echo "📊 服务列表:"
echo "   - AI 助手:   http://localhost:8000"
echo "   - 风险评估:  http://localhost:5003"
echo "   - 争议仲裁:  http://localhost:5004"
echo "   - 支付治理:  http://localhost:8006"
echo ""
echo "📝 查看日志:"
echo "   tail -f logs/ai_assistant.log"
echo "   tail -f logs/risk_assessment.log"
echo "   tail -f logs/dispute.log"
echo "   tail -f logs/payment_governance.log"
echo ""
echo "🛑 停止服务:"
echo "   ./stop_all.sh"
echo ""
echo "🧪 测试服务:"
echo "   curl http://localhost:8000/health"
echo "   curl http://localhost:5003/health"
echo "   curl http://localhost:5004/health"
echo "   curl http://localhost:8006/health"
echo ""
echo "=========================================="

