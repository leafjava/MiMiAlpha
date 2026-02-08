#!/bin/bash

echo "=========================================="
echo "测试所有 OpenAI 服务"
echo "=========================================="

# 测试 AI 助手服务
echo ""
echo "🧪 测试 AI 助手服务 (端口 8000)..."
response=$(curl -s http://localhost:8000/health)
if [ $? -eq 0 ]; then
    echo "✅ AI 助手服务正常"
    echo "   $response"
else
    echo "❌ AI 助手服务无响应"
fi

# 测试风险评估服务
echo ""
echo "🧪 测试风险评估服务 (端口 5003)..."
response=$(curl -s http://localhost:5003/health)
if [ $? -eq 0 ]; then
    echo "✅ 风险评估服务正常"
    echo "   $response"
else
    echo "❌ 风险评估服务无响应"
fi

# 测试争议仲裁服务
echo ""
echo "🧪 测试争议仲裁服务 (端口 5004)..."
response=$(curl -s http://localhost:5004/health)
if [ $? -eq 0 ]; then
    echo "✅ 争议仲裁服务正常"
    echo "   $response"
else
    echo "❌ 争议仲裁服务无响应"
fi

echo ""
echo "=========================================="
echo "测试完成"
echo "=========================================="
