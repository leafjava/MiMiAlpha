"""
测试 AI 助手服务
"""
import os
from dotenv import load_dotenv
from openai import OpenAI

# 加载环境变量
load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")

print("=" * 60)
print("AI 服务配置测试")
print("=" * 60)
print(f"API Key: {OPENAI_API_KEY[:20]}..." if OPENAI_API_KEY else "未配置")
print(f"模型: {OPENAI_MODEL}")
print(f"Base URL: {OPENAI_BASE_URL}")
print("=" * 60)

if not OPENAI_API_KEY:
    print("\n❌ 错误: OPENAI_API_KEY 未配置")
    print("请在 .env 文件中设置 OPENAI_API_KEY")
    exit(1)

print("\n测试 OpenAI API 连接...")

try:
    client = OpenAI(api_key=OPENAI_API_KEY, base_url=OPENAI_BASE_URL)
    
    # 发送测试消息
    response = client.chat.completions.create(
        model=OPENAI_MODEL,
        messages=[
            {"role": "system", "content": "你是一个友好的助手。"},
            {"role": "user", "content": "你好，请回复'测试成功'"}
        ],
        max_tokens=50
    )
    
    reply = response.choices[0].message.content
    print(f"\n✅ API 连接成功!")
    print(f"回复: {reply}")
    print(f"使用的模型: {response.model}")
    print(f"Token 使用: {response.usage.total_tokens}")
    
except Exception as e:
    print(f"\n❌ API 连接失败!")
    print(f"错误信息: {str(e)}")
    print("\n可能的原因:")
    print("1. API Key 无效或已过期")
    print("2. Base URL 无法访问（网络问题）")
    print("3. 模型名称不正确")
    print("\n建议:")
    print("- 检查 .env 文件中的 OPENAI_API_KEY")
    print("- 尝试更换 OPENAI_BASE_URL（使用国内代理）")
    print("- 确保网络连接正常")
    exit(1)

print("\n" + "=" * 60)
print("✅ 所有测试通过！AI 服务可以正常使用")
print("=" * 60)
