"""
收益计算 API
计算 Vault 资金池的实时收益、APY、费用分配
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
import random

load_dotenv()

app = Flask(__name__)
CORS(app)

# 模拟 Vault 数据
vault_data = {
    "total_value_locked": 50000.0,  # TVL
    "total_assets_value": 12000.0,  # 当前资产价值
    "cash_balance": 38000.0,  # 现金余额
    "total_investors": 25,
    "inception_date": (datetime.now() - timedelta(days=90)).isoformat(),
    "management_fee_rate": 0.02,  # 2% 年化
    "performance_fee_rate": 0.20  # 20% 超额收益
}

# 模拟历史收益数据
def generate_historical_yields():
    """生成历史收益数据"""
    yields = []
    base_date = datetime.now() - timedelta(days=90)
    
    for i in range(90):
        date = base_date + timedelta(days=i)
        # 模拟每日收益率 0.3% - 0.8%
        daily_return = random.uniform(0.003, 0.008)
        yields.append({
            "date": date.strftime("%Y-%m-%d"),
            "daily_return": round(daily_return * 100, 2),
            "cumulative_return": round((1 + daily_return) ** (i + 1) - 1, 4) * 100
        })
    
    return yields

@app.route('/health', methods=['GET'])
def health():
    """健康检查"""
    return jsonify({
        "status": "ok",
        "service": "Yield Calculation API",
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/yield/overview', methods=['GET'])
def get_yield_overview():
    """获取收益总览"""
    
    # 计算运行天数
    inception = datetime.fromisoformat(vault_data["inception_date"])
    days_running = (datetime.now() - inception).days
    
    # 模拟月度收益
    monthly_revenue = {
        "trading_profit": 8500.0,  # 批发零售套利
        "rental_income": 4200.0,   # 分时租赁收入
        "total": 12700.0
    }
    
    # 计算费用
    monthly_management_fee = vault_data["total_value_locked"] * vault_data["management_fee_rate"] / 12
    
    # 计算表现费（假设基准收益率 5%）
    benchmark_return = 0.05 / 12
    actual_return = monthly_revenue["total"] / vault_data["total_value_locked"]
    excess_return = max(actual_return - benchmark_return, 0)
    monthly_performance_fee = vault_data["total_value_locked"] * excess_return * vault_data["performance_fee_rate"]
    
    total_fees = monthly_management_fee + monthly_performance_fee
    net_revenue = monthly_revenue["total"] - total_fees
    
    # 计算 APY
    monthly_return = net_revenue / vault_data["total_value_locked"]
    apy = ((1 + monthly_return) ** 12 - 1) * 100
    
    result = {
        "vault_stats": {
            "tvl": vault_data["total_value_locked"],
            "assets_value": vault_data["total_assets_value"],
            "cash_balance": vault_data["cash_balance"],
            "total_investors": vault_data["total_investors"],
            "days_running": days_running
        },
        "monthly_revenue": monthly_revenue,
        "fees": {
            "management_fee": round(monthly_management_fee, 2),
            "performance_fee": round(monthly_performance_fee, 2),
            "total_fees": round(total_fees, 2)
        },
        "net_revenue": round(net_revenue, 2),
        "returns": {
            "monthly_return": round(monthly_return * 100, 2),
            "apy": round(apy, 2)
        },
        "timestamp": datetime.now().isoformat()
    }
    
    return jsonify(result)

@app.route('/api/yield/history', methods=['GET'])
def get_yield_history():
    """获取历史收益"""
    days = request.args.get('days', 30, type=int)
    
    historical_data = generate_historical_yields()
    
    # 只返回最近 N 天
    recent_data = historical_data[-days:]
    
    # 计算统计数据
    daily_returns = [d["daily_return"] for d in recent_data]
    avg_daily_return = sum(daily_returns) / len(daily_returns)
    max_daily_return = max(daily_returns)
    min_daily_return = min(daily_returns)
    
    result = {
        "period_days": days,
        "data": recent_data,
        "statistics": {
            "avg_daily_return": round(avg_daily_return, 2),
            "max_daily_return": round(max_daily_return, 2),
            "min_daily_return": round(min_daily_return, 2),
            "total_return": round(recent_data[-1]["cumulative_return"], 2)
        },
        "timestamp": datetime.now().isoformat()
    }
    
    return jsonify(result)

@app.route('/api/yield/assets', methods=['GET'])
def get_asset_composition():
    """获取资产组成"""
    
    assets = [
        {
            "name": "ChatGPT Plus",
            "icon": "🤖",
            "quantity": 45,
            "unit_value": 15.0,
            "total_value": 675.0,
            "percentage": 4.5
        },
        {
            "name": "Claude Pro",
            "icon": "🧠",
            "quantity": 30,
            "unit_value": 18.0,
            "total_value": 540.0,
            "percentage": 3.6
        },
        {
            "name": "Vizard AI",
            "icon": "🎬",
            "quantity": 40,
            "unit_value": 12.0,
            "total_value": 480.0,
            "percentage": 3.2
        },
        {
            "name": "Spline Pro",
            "icon": "�",
            "quantity": 50,
            "unit_value": 10.0,
            "total_value": 500.0,
            "percentage": 3.3
        },
        {
            "name": "VPN Premium",
            "icon": "🔒",
            "quantity": 200,
            "unit_value": 3.0,
            "total_value": 600.0,
            "percentage": 4.0
        },
        {
            "name": "92资源站会员",
            "icon": "📚",
            "quantity": 80,
            "unit_value": 5.0,
            "total_value": 400.0,
            "percentage": 2.7
        },
        {
            "name": "666ROOT会员",
            "icon": "�",
            "quantity": 70,
            "unit_value": 6.0,
            "total_value": 420.0,
            "percentage": 2.8
        },
        {
            "name": "课百万会员",
            "icon": "📖",
            "quantity": 60,
            "unit_value": 8.0,
            "total_value": 480.0,
            "percentage": 3.2
        },
        {
            "name": "Steam 礼品卡",
            "icon": "🎮",
            "quantity": 150,
            "unit_value": 47.5,
            "total_value": 7125.0,
            "percentage": 47.5
        },
        {
            "name": "Netflix 4K",
            "icon": "🎬",
            "quantity": 80,
            "unit_value": 12.0,
            "total_value": 960.0,
            "percentage": 6.4
        },
        {
            "name": "Spotify Premium",
            "icon": "🎵",
            "quantity": 130,
            "unit_value": 8.0,
            "total_value": 1040.0,
            "percentage": 5.2
        },
        {
            "name": "游戏自动化脚本",
            "icon": "🎮",
            "quantity": 20,
            "unit_value": 20.0,
            "total_value": 400.0,
            "percentage": 2.0
        },
        {
            "name": "黄金量化模型",
            "icon": "📈",
            "quantity": 5,
            "unit_value": 100.0,
            "total_value": 500.0,
            "percentage": 2.5
        },
        {
            "name": "BTC量化模型",
            "icon": "₿",
            "quantity": 3,
            "unit_value": 150.0,
            "total_value": 450.0,
            "percentage": 2.3
        },
        {
            "name": "A股量化模型",
            "icon": "📊",
            "quantity": 8,
            "unit_value": 80.0,
            "total_value": 640.0,
            "percentage": 3.2
        },
        {
            "name": "现金储备",
            "icon": "💵",
            "quantity": 1,
            "unit_value": 1570.0,
            "total_value": 1570.0,
            "percentage": 7.9
        }
    ]
    
    total_value = sum(a["total_value"] for a in assets)
    
    result = {
        "total_assets_value": round(total_value, 2),
        "assets": assets,
        "categories": {
            "AI工具": 2195.0,
            "设计工具": 500.0,
            "网络工具": 600.0,
            "资源站": 1300.0,
            "游戏": 7125.0,
            "游戏工具": 400.0,
            "流媒体": 2000.0,
            "量化交易": 1590.0,
            "现金": 1570.0
        },
        "timestamp": datetime.now().isoformat()
    }
    
    return jsonify(result)

@app.route('/api/yield/investor', methods=['POST'])
def calculate_investor_yield():
    """计算投资者个人收益"""
    data = request.json
    investment_amount = data.get('amount', 0)
    investment_days = data.get('days', 30)
    
    if investment_amount <= 0:
        return jsonify({"error": "投资金额必须大于 0"}), 400
    
    # 计算份额（简化版，实际应该用 LP Token）
    share = investment_amount / vault_data["total_value_locked"]
    
    # 模拟月度净收益
    monthly_net_revenue = 10000.0  # 扣除费用后
    
    # 计算投资者收益
    investor_monthly_revenue = monthly_net_revenue * share
    investor_daily_revenue = investor_monthly_revenue / 30
    investor_total_revenue = investor_daily_revenue * investment_days
    
    # 计算收益率
    return_rate = (investor_total_revenue / investment_amount) * 100
    
    # 年化收益率
    apy = ((1 + investor_total_revenue / investment_amount) ** (365 / investment_days) - 1) * 100
    
    result = {
        "investment": {
            "amount": investment_amount,
            "days": investment_days,
            "share_percentage": round(share * 100, 4)
        },
        "revenue": {
            "daily": round(investor_daily_revenue, 2),
            "total": round(investor_total_revenue, 2),
            "return_rate": round(return_rate, 2),
            "apy": round(apy, 2)
        },
        "final_value": round(investment_amount + investor_total_revenue, 2),
        "timestamp": datetime.now().isoformat()
    }
    
    return jsonify(result)

@app.route('/api/yield/transparency', methods=['GET'])
def get_transparency_report():
    """生成透明度报告"""
    
    report = {
        "vault_address": "0x1234...5678",
        "report_date": datetime.now().strftime("%Y-%m-%d"),
        "tvl": vault_data["total_value_locked"],
        "net_asset_value": vault_data["total_value_locked"] + 5000,  # 包含未实现收益
        "total_investors": vault_data["total_investors"],
        
        "asset_breakdown": {
            "virtual_goods": 11940.0,
            "cash_reserve": 1060.0,
            "pending_orders": 500.0
        },
        
        "revenue_sources": {
            "trading_profit": {
                "amount": 8500.0,
                "percentage": 67.0
            },
            "rental_income": {
                "amount": 4200.0,
                "percentage": 33.0
            }
        },
        
        "fee_structure": {
            "management_fee": {
                "rate": "2% 年化",
                "collected_this_month": 83.33
            },
            "performance_fee": {
                "rate": "20% 超额收益",
                "collected_this_month": 1200.0
            }
        },
        
        "performance_metrics": {
            "monthly_return": 20.0,
            "apy": 151.0,
            "sharpe_ratio": 2.5,
            "max_drawdown": -3.2
        },
        
        "risk_metrics": {
            "inventory_turnover": 15.5,
            "cash_ratio": 0.21,
            "diversification_score": 85
        },
        
        "timestamp": datetime.now().isoformat()
    }
    
    return jsonify(report)

if __name__ == '__main__':
    print("\n" + "="*60)
    print("📊 收益计算 API 启动")
    print("="*60)
    print(f"📡 API 地址: http://localhost:8005")
    print(f"🔗 健康检查: http://localhost:8005/health")
    print(f"📊 收益总览: http://localhost:8005/api/yield/overview")
    print(f"📈 历史收益: http://localhost:8005/api/yield/history")
    print(f"💼 资产组成: http://localhost:8005/api/yield/assets")
    print(f"👤 投资者收益: http://localhost:8005/api/yield/investor")
    print(f"📋 透明度报告: http://localhost:8005/api/yield/transparency")
    print("="*60 + "\n")
    
    app.run(host='0.0.0.0', port=8005, debug=False)
