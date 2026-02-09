"""
Vercel Serverless Function - 风险评估 API
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# 导入原有的风险评估逻辑
import sys
sys.path.append('..')
from risk_assessment_api_openai import assess_risk

@app.route('/api/risk/assess', methods=['POST', 'OPTIONS'])
def handler():
    if request.method == 'OPTIONS':
        return '', 204
    return assess_risk()

# Vercel 需要这个
def handler_vercel(request):
    with app.request_context(request.environ):
        return app.full_dispatch_request()
