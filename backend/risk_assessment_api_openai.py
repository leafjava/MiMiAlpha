"""
智能风险评估 API - OpenAI 版本
基于 AI 的交易风险分析系统
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import re
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
# 配置 CORS，允许所有来源（生产环境应该限制具体域名）
CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# OpenAI API 配置
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")

# 初始化 OpenAI 客户端（新版本）
client = OpenAI(api_key=OPENAI_API_KEY, base_url=OPENAI_BASE_URL) if OPENAI_API_KEY else None

# 诈骗关键词库
SCAM_KEYWORDS = [
    "urgent", "紧急", "立即", "马上", "快速", "guaranteed", "保证", "100%",
    "investment", "投资", "返利", "回报", "profit", "利润", "赚钱",
    "lottery", "彩票", "中奖", "prize", "奖品", "gift", "礼物",
    "inheritance", "遗产", "tax", "税", "fee", "费用", "transfer", "转账",
    "bitcoin", "crypto", "加密货币", "虚拟币", "数字货币",
    "loan", "贷款", "credit", "信用", "debt", "债务"
]

def detect_scam_keywords(text):
    """检测诈骗关键词"""
    if not text:
        return []
    
    text_lower = text.lower()
    found_keywords = []
    
    for keyword in SCAM_KEYWORDS:
        if keyword.lower() in text_lower:
            found_keywords.append(keyword)
    
    return found_keywords

def analyze_amount_risk(amount):
    """分析金额风险"""
    try:
        amount_float = float(amount)
        
        if amount_float <= 0:
            return 100, "金额无效"
        elif amount_float < 100:
            return 10, "小额交易"
        elif amount_float < 1000:
            return 20, "中等金额"
        elif amount_float < 10000:
            return 40, "较大金额"
        else:
            return 70, "大额交易，需要特别注意"
    except:
        return 50, "金额格式错误"

def analyze_address_risk(address):
    """分析地址风险（简化版）"""
    if not address:
        return 30, "地址为空"
    
    # 检查地址格式
    if not re.match(r'^(0x|cfx:)[a-fA-F0-9]{40,}', address):
        return 60, "地址格式可疑"
    
    # 检查是否是新地址（简化判断）
    if address.startswith('0x000') or address.startswith('cfx:000'):
        return 50, "可能是新地址"
    
    return 10, "地址格式正常"

@app.route('/health', methods=['GET'])
def health():
    """健康检查"""
    api_status = "configured" if OPENAI_API_KEY else "not configured"
    
    return jsonify({
        "status": "ok",
        "service": "Risk Assessment API (OpenAI)",
        "model": OPENAI_MODEL,
        "api_status": api_status,
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/risk/assess', methods=['POST'])
def assess_risk():
    """
    风险评估接口
    输入：交易金额、描述、买卖双方地址
    输出：风险评分、风险等级、风险原因、建议
    """
    data = request.json
    
    amount = data.get('amount', '')
    description = data.get('description', '')
    buyer_address = data.get('buyer_address', '')
    seller_address = data.get('seller_address', '')
    
    print(f"\n[{datetime.now().strftime('%H:%M:%S')}] 收到风险评估请求")
    print(f"金额: {amount}, 描述长度: {len(description)}")
    
    # 基础风险分析
    risk_factors = []
    base_score = 0
    
    # 1. 金额风险
    amount_score, amount_reason = analyze_amount_risk(amount)
    base_score += amount_score
    if amount_score > 30:
        risk_factors.append(f"金额风险: {amount_reason}")
    
    # 2. 关键词检测
    scam_keywords = detect_scam_keywords(description)
    if scam_keywords:
        keyword_score = min(len(scam_keywords) * 15, 50)
        base_score += keyword_score
        risk_factors.append(f"检测到可疑关键词: {', '.join(scam_keywords[:3])}")
    
    # 3. 地址风险
    buyer_score, buyer_reason = analyze_address_risk(buyer_address)
    seller_score, seller_reason = analyze_address_risk(seller_address)
    
    if buyer_score > 30:
        base_score += buyer_score * 0.5
        risk_factors.append(f"买家地址: {buyer_reason}")
    
    if seller_score > 30:
        base_score += seller_score * 0.5
        risk_factors.append(f"卖家地址: {seller_reason}")
    
    # 4. 描述完整性
    if not description or len(description) < 10:
        base_score += 20
        risk_factors.append("交易描述过于简单")
    
    # 使用 OpenAI 进行深度分析
    ai_analysis = ""
    if client:
        try:
            prompt = f"""你是一个专业的交易风险分析师。请分析以下交易信息的风险：

交易金额: {amount} cUSD
交易描述: {description}
买家地址: {buyer_address}
卖家地址: {seller_address}

请从以下角度分析风险：
1. 交易描述是否合理
2. 是否存在诈骗迹象
3. 金额是否异常
4. 其他潜在风险

请用简洁的中文回答（100字以内），只说明主要风险点。"""

            response = client.chat.completions.create(
                model=OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": "你是一个专业的交易风险分析师，需要客观评估交易风险。"},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=200
            )
            
            ai_analysis = response.choices[0].message.content.strip()
            print(f"✅ AI 分析完成")
                
        except Exception as e:
            print(f"⚠️  AI 分析失败: {str(e)}")
            ai_analysis = "AI 分析暂时不可用"
    else:
        ai_analysis = "AI 分析功能未配置（缺少 API Key）"
    
    # 计算最终风险评分
    final_score = min(int(base_score), 100)
    
    # 确定风险等级
    if final_score < 30:
        risk_level = "low"
        level_text = "低风险"
        recommendation = "建议继续交易"
        should_continue = True
        escrow_days = 3
    elif final_score < 60:
        risk_level = "medium"
        level_text = "中风险"
        recommendation = "建议谨慎交易，延长托管时间"
        should_continue = True
        escrow_days = 7
    else:
        risk_level = "high"
        level_text = "高风险"
        recommendation = "不建议继续交易，存在较大风险"
        should_continue = False
        escrow_days = 14
    
    # 如果没有发现具体风险因素，添加默认说明
    if not risk_factors:
        risk_factors.append("未发现明显风险因素")
    
    # 添加 AI 分析结果
    if ai_analysis and "失败" not in ai_analysis and "未配置" not in ai_analysis:
        risk_factors.append(f"AI 分析: {ai_analysis}")
    
    result = {
        "risk_score": final_score,
        "risk_level": risk_level,
        "risk_level_text": level_text,
        "risk_reasons": risk_factors,
        "recommendation": recommendation,
        "should_continue": should_continue,
        "suggested_escrow_days": escrow_days,
        "timestamp": datetime.now().isoformat()
    }
    
    print(f"✅ 风险评估完成: {level_text} ({final_score}分)")
    
    return jsonify(result)

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🛡️  智能风险评估 API 启动（OpenAI 版本）")
    print("="*60)
    print(f"📡 API 地址: http://localhost:5003")
    print(f"🔗 健康检查: http://localhost:5003/health")
    print(f"🔍 风险评估: http://localhost:5003/api/risk/assess")
    print(f"🤖 AI 模型: {OPENAI_MODEL}")
    print("="*60)
    
    if not OPENAI_API_KEY:
        print("\n⚠️  警告: OPENAI_API_KEY 未配置")
        print("   AI 深度分析功能将不可用")
        print("   请在 .env 文件中设置 OPENAI_API_KEY\n")
    else:
        print(f"\n✅ OpenAI API Key 已配置（{OPENAI_API_KEY[:10]}...）\n")
    
    print("="*60 + "\n")
    
    app.run(host='0.0.0.0', port=5003, debug=False)
