"""
智能争议仲裁助手 API - OpenAI 版本
基于 AI 的交易纠纷分析和仲裁建议系统
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
CORS(app)

# OpenAI API 配置
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")

# 初始化 OpenAI 客户端（新版本）
client = OpenAI(api_key=OPENAI_API_KEY, base_url=OPENAI_BASE_URL) if OPENAI_API_KEY else None

# 争议类型定义
DISPUTE_TYPES = {
    "not_received": "未收到商品",
    "not_as_described": "商品与描述不符",
    "damaged": "商品损坏",
    "fake": "假货/仿品",
    "seller_no_ship": "卖家未发货",
    "buyer_no_pay": "买家未付款",
    "other": "其他争议"
}

# 责任方判定规则
RESPONSIBILITY_RULES = {
    "seller": "卖家责任",
    "buyer": "买家责任",
    "both": "双方责任",
    "platform": "平台责任",
    "unclear": "责任不明确"
}

# 处理方案
RESOLUTION_OPTIONS = {
    "full_refund": "全额退款给买家",
    "partial_refund": "部分退款",
    "release_funds": "正常放款给卖家",
    "extend_escrow": "延长托管期",
    "manual_review": "需要人工深度审核"
}

def analyze_chat_history(chat_messages):
    """分析聊天记录"""
    if not chat_messages:
        return 0, "无聊天记录"
    
    risk_score = 0
    findings = []
    
    # 检查聊天内容
    all_text = " ".join(chat_messages).lower()
    
    # 检测威胁性语言
    threat_keywords = ["投诉", "举报", "律师", "起诉", "警察", "曝光"]
    found_threats = [kw for kw in threat_keywords if kw in all_text]
    if found_threats:
        risk_score += 20
        findings.append(f"检测到威胁性语言: {', '.join(found_threats)}")
    
    # 检测承诺
    promise_keywords = ["保证", "承诺", "一定", "肯定"]
    found_promises = [kw for kw in promise_keywords if kw in all_text]
    if found_promises:
        findings.append(f"发现承诺性语言: {', '.join(found_promises)}")
    
    # 检测拒绝沟通
    refuse_keywords = ["不管", "不理", "不回", "拉黑"]
    found_refuse = [kw for kw in refuse_keywords if kw in all_text]
    if found_refuse:
        risk_score += 15
        findings.append(f"检测到拒绝沟通: {', '.join(found_refuse)}")
    
    return risk_score, findings

def analyze_evidence(evidence_list):
    """分析证据完整性"""
    if not evidence_list:
        return 30, "未提供证据"
    
    score = 0
    findings = []
    
    # 检查证据类型
    has_image = any(e.get("type") == "image" for e in evidence_list)
    has_text = any(e.get("type") == "text" for e in evidence_list)
    has_tracking = any(e.get("type") == "tracking" for e in evidence_list)
    
    if has_image:
        findings.append("✅ 提供了图片证据")
        score -= 10
    else:
        findings.append("⚠️ 缺少图片证据")
        score += 15
    
    if has_text:
        findings.append("✅ 提供了文字说明")
    else:
        findings.append("⚠️ 缺少文字说明")
        score += 10
    
    if has_tracking:
        findings.append("✅ 提供了物流信息")
        score -= 15
    else:
        findings.append("⚠️ 缺少物流信息")
        score += 10
    
    return max(score, 0), findings

def rule_based_judgment(dispute_data):
    """基于规则的初步判断"""
    dispute_type = dispute_data.get("dispute_type")
    buyer_evidence = dispute_data.get("buyer_evidence", [])
    seller_evidence = dispute_data.get("seller_evidence", [])
    
    # 规则 1: 卖家未发货
    if dispute_type == "seller_no_ship":
        has_tracking = any(e.get("type") == "tracking" for e in seller_evidence)
        if not has_tracking:
            return {
                "responsibility": "seller",
                "resolution": "full_refund",
                "confidence": 85,
                "reason": "卖家未提供发货证明"
            }
    
    # 规则 2: 商品损坏
    if dispute_type == "damaged":
        buyer_has_image = any(e.get("type") == "image" for e in buyer_evidence)
        if buyer_has_image:
            return {
                "responsibility": "seller",
                "resolution": "partial_refund",
                "confidence": 70,
                "reason": "买家提供了损坏证据，建议部分退款"
            }
    
    # 规则 3: 未收到商品
    if dispute_type == "not_received":
        seller_has_tracking = any(e.get("type") == "tracking" for e in seller_evidence)
        if seller_has_tracking:
            return {
                "responsibility": "unclear",
                "resolution": "manual_review",
                "confidence": 50,
                "reason": "卖家有发货记录，需核实物流状态"
            }
        else:
            return {
                "responsibility": "seller",
                "resolution": "full_refund",
                "confidence": 80,
                "reason": "卖家无法证明已发货"
            }
    
    # 规则 4: 商品与描述不符
    if dispute_type == "not_as_described":
        buyer_has_evidence = len(buyer_evidence) > 0
        seller_has_evidence = len(seller_evidence) > 0
        
        if buyer_has_evidence and not seller_has_evidence:
            return {
                "responsibility": "seller",
                "resolution": "partial_refund",
                "confidence": 65,
                "reason": "买家提供证据，卖家未反驳"
            }
    
    # 默认：需要更多信息
    return {
        "responsibility": "unclear",
        "resolution": "manual_review",
        "confidence": 40,
        "reason": "证据不足，需要人工审核"
    }

def ai_deep_analysis(dispute_data):
    """AI 深度分析（使用 OpenAI）"""
    if not client:
        return "AI 分析功能未配置（缺少 API Key）"
    
    try:
        # 构建分析提示词
        prompt = f"""你是一个专业的电商交易纠纷仲裁专家。请分析以下争议案件：

【交易信息】
交易金额: {dispute_data.get('amount')} USDT
交易描述: {dispute_data.get('description')}
争议类型: {DISPUTE_TYPES.get(dispute_data.get('dispute_type'), '未知')}

【买家主张】
{dispute_data.get('buyer_claim', '无')}

【卖家回应】
{dispute_data.get('seller_response', '无')}

【买家证据】
{len(dispute_data.get('buyer_evidence', []))} 项证据

【卖家证据】
{len(dispute_data.get('seller_evidence', []))} 项证据

【聊天记录】
{chr(10).join(dispute_data.get('chat_history', ['无聊天记录'])[:5])}

请从以下角度分析：
1. 双方陈述的可信度
2. 证据的充分性和真实性
3. 是否存在恶意行为
4. 合理的解决方案

请用简洁的中文回答（200字以内），给出你的专业判断。"""

        response = client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=[
                {"role": "system", "content": "你是一个专业的电商交易纠纷仲裁专家，需要客观、公正地分析案件。"},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,  # 低温度保证客观性
            max_tokens=400
        )
        
        ai_analysis = response.choices[0].message.content.strip()
        print(f"✅ AI 分析完成")
        return ai_analysis
            
    except Exception as e:
        print(f"⚠️  AI 分析失败: {str(e)}")
        return "AI 分析暂时不可用"

@app.route('/health', methods=['GET'])
def health():
    """健康检查"""
    api_status = "configured" if OPENAI_API_KEY else "not configured"
    
    return jsonify({
        "status": "ok",
        "service": "Dispute Arbitration API (OpenAI)",
        "model": OPENAI_MODEL,
        "api_status": api_status,
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/dispute/analyze', methods=['POST'])
def analyze_dispute():
    """
    争议分析接口
    输入：交易详情、双方证据、聊天记录
    输出：责任判定、处理方案、置信度、详细理由
    """
    data = request.json
    
    print(f"\n[{datetime.now().strftime('%H:%M:%S')}] 收到争议仲裁请求")
    print(f"争议类型: {data.get('dispute_type')}")
    
    # 1. 分析聊天记录
    chat_score, chat_findings = analyze_chat_history(
        data.get('chat_history', [])
    )
    
    # 2. 分析双方证据
    buyer_evidence_score, buyer_evidence_findings = analyze_evidence(
        data.get('buyer_evidence', [])
    )
    seller_evidence_score, seller_evidence_findings = analyze_evidence(
        data.get('seller_evidence', [])
    )
    
    # 3. 规则引擎初步判断
    rule_judgment = rule_based_judgment(data)
    
    # 4. AI 深度分析
    ai_analysis = ai_deep_analysis(data)
    
    # 5. 综合评分
    # 证据完整性影响置信度
    evidence_gap = abs(buyer_evidence_score - seller_evidence_score)
    confidence_adjustment = -evidence_gap * 0.5
    
    final_confidence = max(
        min(rule_judgment["confidence"] + confidence_adjustment, 95),
        30
    )
    
    # 6. 生成详细理由
    detailed_reasons = []
    
    # 规则判断理由
    detailed_reasons.append(f"📋 规则判断: {rule_judgment['reason']}")
    
    # 证据分析
    if buyer_evidence_findings:
        detailed_reasons.append(f"🔍 买家证据: {'; '.join(buyer_evidence_findings)}")
    if seller_evidence_findings:
        detailed_reasons.append(f"🔍 卖家证据: {'; '.join(seller_evidence_findings)}")
    
    # 聊天分析
    if chat_findings:
        detailed_reasons.append(f"💬 聊天分析: {'; '.join(chat_findings)}")
    
    # AI 分析
    if ai_analysis and "失败" not in ai_analysis and "未配置" not in ai_analysis:
        detailed_reasons.append(f"🤖 AI 分析: {ai_analysis}")
    
    # 7. 构建响应
    result = {
        "case_id": f"CASE-{datetime.now().strftime('%Y%m%d%H%M%S')}",
        "responsibility": rule_judgment["responsibility"],
        "responsibility_text": RESPONSIBILITY_RULES[rule_judgment["responsibility"]],
        "resolution": rule_judgment["resolution"],
        "resolution_text": RESOLUTION_OPTIONS[rule_judgment["resolution"]],
        "confidence": int(final_confidence),
        "detailed_reasons": detailed_reasons,
        "evidence_summary": {
            "buyer_evidence_count": len(data.get('buyer_evidence', [])),
            "seller_evidence_count": len(data.get('seller_evidence', [])),
            "chat_messages_count": len(data.get('chat_history', []))
        },
        "recommendations": generate_recommendations(rule_judgment, final_confidence),
        "timestamp": datetime.now().isoformat()
    }
    
    print(f"✅ 仲裁分析完成: {result['responsibility_text']} (置信度: {final_confidence}%)")
    
    return jsonify(result)

def generate_recommendations(judgment, confidence):
    """生成操作建议"""
    recommendations = []
    
    if confidence >= 80:
        recommendations.append("置信度高，建议直接执行仲裁决定")
    elif confidence >= 60:
        recommendations.append("置信度中等，建议人工复核后执行")
    else:
        recommendations.append("置信度较低，强烈建议人工深度审核")
    
    if judgment["resolution"] == "manual_review":
        recommendations.append("建议联系双方补充证据")
        recommendations.append("可考虑视频通话核实情况")
    
    if judgment["resolution"] == "partial_refund":
        recommendations.append("建议退款比例: 30-70%")
        recommendations.append("可协商买家退货后退款")
    
    return recommendations

@app.route('/api/dispute/types', methods=['GET'])
def get_dispute_types():
    """获取争议类型列表"""
    return jsonify({
        "dispute_types": [
            {"value": k, "label": v} for k, v in DISPUTE_TYPES.items()
        ]
    })

if __name__ == '__main__':
    print("\n" + "="*60)
    print("⚖️  智能争议仲裁助手 API 启动（OpenAI 版本）")
    print("="*60)
    print(f"📡 API 地址: http://localhost:5004")
    print(f"🔗 健康检查: http://localhost:5004/health")
    print(f"⚖️  争议分析: http://localhost:5004/api/dispute/analyze")
    print(f"📋 争议类型: http://localhost:5004/api/dispute/types")
    print(f"🤖 AI 模型: {OPENAI_MODEL}")
    print("="*60)
    
    if not OPENAI_API_KEY:
        print("\n⚠️  警告: OPENAI_API_KEY 未配置")
        print("   AI 深度分析功能将不可用")
        print("   请在 .env 文件中设置 OPENAI_API_KEY\n")
    else:
        print(f"\n✅ OpenAI API Key 已配置（{OPENAI_API_KEY[:10]}...）\n")
    
    print("="*60 + "\n")
    
    app.run(host='0.0.0.0', port=5004, debug=False)
