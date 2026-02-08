#!/bin/bash

echo "=========================================="
echo "停止 MiMiAlpha 后端服务"
echo "=========================================="

# 停止 AI 助手服务
if [ -f pids/ai_assistant.pid ]; then
    PID=$(cat pids/ai_assistant.pid)
    if kill -0 $PID 2>/dev/null; then
        kill $PID
        echo "✅ AI 助手服务已停止 (PID: $PID)"
    else
        echo "⚠️  AI 助手服务未运行"
    fi
    rm pids/ai_assistant.pid
fi

# 停止风险评估服务
if [ -f pids/risk_assessment.pid ]; then
    PID=$(cat pids/risk_assessment.pid)
    if kill -0 $PID 2>/dev/null; then
        kill $PID
        echo "✅ 风险评估服务已停止 (PID: $PID)"
    else
        echo "⚠️  风险评估服务未运行"
    fi
    rm pids/risk_assessment.pid
fi

# 停止争议仲裁服务
if [ -f pids/dispute.pid ]; then
    PID=$(cat pids/dispute.pid)
    if kill -0 $PID 2>/dev/null; then
        kill $PID
        echo "✅ 争议仲裁服务已停止 (PID: $PID)"
    else
        echo "⚠️  争议仲裁服务未运行"
    fi
    rm pids/dispute.pid
fi

echo ""
echo "=========================================="
echo "✅ 所有服务已停止"
echo "=========================================="
