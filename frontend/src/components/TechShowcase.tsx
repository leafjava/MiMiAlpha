import { AuditStream } from './AuditStream';
import { SharpeChart } from './SharpeChart';
import './TechShowcase.css';

export function TechShowcase() {
  return (
    <div className="tech-showcase">
      {/* Hero Section */}
      <section className="showcase-hero">
        <h1>🔬 技术展示：可视化的 Alpha</h1>
        <p className="hero-subtitle">
          直观的数据证明 · 实时的治理监控 · 不可篡改的业绩追溯
        </p>
      </section>

      {/* Architecture Overview */}
      <section className="architecture-section">
        <h2>🏗️ 非侵入式中间件架构</h2>
        <p className="section-description">
          Smart Facilitator 作为独立的财务治理层，业务逻辑无需修改，即插即用
        </p>
        
        <div className="architecture-diagram">
          <div className="arch-layer user-layer">
            <h3>用户层</h3>
            <div className="layer-items">
              <div className="layer-item">👤 个人用户</div>
              <div className="layer-item">🧑‍💻 模型开发者</div>
              <div className="layer-item">🏢 机构投资者</div>
            </div>
          </div>

          <div className="arch-arrow">↓</div>

          <div className="arch-layer frontend-layer">
            <h3>前端层</h3>
            <div className="layer-items">
              <div className="layer-item">⚛️ React 18</div>
              <div className="layer-item">📊 实时审计流</div>
              <div className="layer-item">📈 夏普比率曲线</div>
            </div>
          </div>

          <div className="arch-arrow">↓</div>

          <div className="arch-layer facilitator-layer">
            <h3>🛡️ Smart Facilitator 中间件（核心）</h3>
            <div className="layer-items">
              <div className="layer-item highlight">🔐 分级权限降级</div>
              <div className="layer-item highlight">🔒 隐私网关</div>
              <div className="layer-item highlight">📋 实时审计流</div>
              <div className="layer-item highlight">⚡ 微支付聚合</div>
            </div>
          </div>

          <div className="arch-arrow">↓</div>

          <div className="arch-layer contract-layer">
            <h3>智能合约层</h3>
            <div className="layer-items">
              <div className="layer-item">📜 SubscriptionVault</div>
              <div className="layer-item">📜 ModelMarketplace</div>
              <div className="layer-item">📜 SmartFacilitator</div>
            </div>
          </div>
        </div>
      </section>

      {/* Real-time Audit Stream */}
      <section className="audit-section">
        <h2>📊 实时审计流：透明的治理过程</h2>
        <p className="section-description">
          不只显示成功或失败，展示 Smart Facilitator 正在拦截的每一个动作
        </p>
        <AuditStream />
      </section>

      {/* Sharpe Ratio Chart */}
      <section className="sharpe-section">
        <h2>📈 夏普比率动态曲线：可验证的业绩</h2>
        <p className="section-description">
          交互式图表展示模型在不同波动率下的表现，叠加 TRON 链上验证 Hash
        </p>
        <SharpeChart modelName="黄金价格预测模型" modelId="model-001" />
      </section>

      {/* Permission Degradation */}
      <section className="permission-section">
        <h2>🔐 分级权限降级：安全与体验的平衡</h2>
        <p className="section-description">
          小额交易自动执行，大额交易多签确认，这是 Web3 的高级治理概念
        </p>
        
        <div className="permission-grid">
          <div className="permission-card micro">
            <div className="card-header">
              <span className="tier-icon">💰</span>
              <h3>微额交易</h3>
            </div>
            <div className="tier-amount">&lt; $10</div>
            <div className="tier-features">
              <div className="feature">✅ 一次性授权</div>
              <div className="feature">✅ 自动执行</div>
              <div className="feature">✅ 无需签名</div>
            </div>
            <div className="tier-example">
              示例：租赁 ChatGPT ($0.5)
            </div>
          </div>

          <div className="permission-card small">
            <div className="card-header">
              <span className="tier-icon">💵</span>
              <h3>小额交易</h3>
            </div>
            <div className="tier-amount">$10 - $100</div>
            <div className="tier-features">
              <div className="feature">✅ 需要签名</div>
              <div className="feature">✅ 单签即可</div>
              <div className="feature">⚡ 快速确认</div>
            </div>
            <div className="tier-example">
              示例：购买单个信号 ($50)
            </div>
          </div>

          <div className="permission-card medium">
            <div className="card-header">
              <span className="tier-icon">💸</span>
              <h3>中额交易</h3>
            </div>
            <div className="tier-amount">$100 - $1,000</div>
            <div className="tier-features">
              <div className="feature">✅ 需要签名</div>
              <div className="feature">⚠️ 风险提示</div>
              <div className="feature">📊 详细审计</div>
            </div>
            <div className="tier-example">
              示例：月度订阅 ($500)
            </div>
          </div>

          <div className="permission-card large">
            <div className="card-header">
              <span className="tier-icon">💎</span>
              <h3>大额交易</h3>
            </div>
            <div className="tier-amount">&gt; $1,000</div>
            <div className="tier-features">
              <div className="feature">🔒 多签验证</div>
              <div className="feature">⏱️ 延迟到账</div>
              <div className="feature">🛡️ 最高安全</div>
            </div>
            <div className="tier-example">
              示例：年度订阅 ($5,000)
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Gateway */}
      <section className="privacy-section">
        <h2>🔒 隐私网关：密码永不泄露</h2>
        <p className="section-description">
          API Proxy 模式确保账号主的密码和个人信息永远不会暴露给租户
        </p>
        
        <div className="privacy-comparison">
          <div className="comparison-card unsafe">
            <h3>❌ 传统方式（不安全）</h3>
            <div className="flow-diagram">
              <div className="flow-step">
                <div className="step-icon">👤</div>
                <div className="step-label">账号主</div>
              </div>
              <div className="flow-arrow">密码 →</div>
              <div className="flow-step">
                <div className="step-icon">👨‍💻</div>
                <div className="step-label">租户</div>
              </div>
              <div className="flow-arrow">直接调用 →</div>
              <div className="flow-step">
                <div className="step-icon">🤖</div>
                <div className="step-label">OpenAI</div>
              </div>
            </div>
            <div className="risks">
              <div className="risk-item">❌ 密码泄露风险</div>
              <div className="risk-item">❌ 租户可以修改密码</div>
              <div className="risk-item">❌ 租户可以访问个人信息</div>
            </div>
          </div>

          <div className="comparison-card safe">
            <h3>✅ MiMiAlpha 方式（安全）</h3>
            <div className="flow-diagram">
              <div className="flow-step">
                <div className="step-icon">👤</div>
                <div className="step-label">账号主</div>
              </div>
              <div className="flow-arrow">Session Token →</div>
              <div className="flow-step highlight">
                <div className="step-icon">🛡️</div>
                <div className="step-label">Facilitator</div>
                <div className="step-sublabel">(Privacy Gateway)</div>
              </div>
              <div className="flow-arrow">过滤请求 →</div>
              <div className="flow-step">
                <div className="step-icon">🤖</div>
                <div className="step-label">OpenAI</div>
              </div>
            </div>
            <div className="benefits">
              <div className="benefit-item">✅ 密码永不泄露</div>
              <div className="benefit-item">✅ 租户无法修改账号</div>
              <div className="benefit-item">✅ 自动过滤敏感请求</div>
            </div>
          </div>
        </div>
      </section>

      {/* Micropayment Aggregation */}
      <section className="micropayment-section">
        <h2>⚡ 微支付聚合：节省 98% Energy</h2>
        <p className="section-description">
          高频微支付离线聚合，批量结算，大幅降低 Gas 费用
        </p>
        
        <div className="micropayment-comparison">
          <div className="comparison-box traditional">
            <h3>传统方式（每笔上链）</h3>
            <div className="transactions">
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i} className="transaction">
                  交易 {i + 1}: $0.1 → Gas $0.05
                </div>
              ))}
              <div className="transaction more">... 共 50 笔</div>
            </div>
            <div className="summary bad">
              <div className="summary-row">
                <span>总收入:</span>
                <span>$5.0</span>
              </div>
              <div className="summary-row">
                <span>Gas 费用:</span>
                <span className="highlight-bad">$2.5</span>
              </div>
              <div className="summary-row total">
                <span>净收入:</span>
                <span>$2.5 (50% 损耗)</span>
              </div>
            </div>
          </div>

          <div className="comparison-box mimialpha">
            <h3>MiMiAlpha 方式（批量聚合）</h3>
            <div className="transactions">
              <div className="transaction aggregated">
                离线记录 50 笔交易
              </div>
              <div className="transaction aggregated">
                批量结算: $5.0 → Gas $0.05
              </div>
            </div>
            <div className="summary good">
              <div className="summary-row">
                <span>总收入:</span>
                <span>$5.0</span>
              </div>
              <div className="summary-row">
                <span>Gas 费用:</span>
                <span className="highlight-good">$0.05</span>
              </div>
              <div className="summary-row total">
                <span>净收入:</span>
                <span>$4.95 (1% 损耗)</span>
              </div>
            </div>
            <div className="savings">
              节省: 98% Energy ✅
            </div>
          </div>
        </div>
      </section>

      {/* Business Positioning */}
      <section className="positioning-section">
        <h2>🎯 商业定位：降维打击</h2>
        
        <div className="positioning-grid">
          <div className="positioning-card engine-a">
            <div className="card-icon">🔄</div>
            <h3>引擎 A：金融平权</h3>
            <blockquote>
              "让没钱订阅昂贵工具的开发者也能用上顶尖 AI"
            </blockquote>
            <div className="positioning-details">
              <div className="detail-item">
                <strong>痛点:</strong> ChatGPT Plus $20/月，很多人用不起
              </div>
              <div className="detail-item">
                <strong>解决:</strong> 按需付费 $0.5/次，降低 95% 门槛
              </div>
              <div className="detail-item">
                <strong>价值:</strong> 普惠 AI，让技术触手可及
              </div>
            </div>
          </div>

          <div className="positioning-card engine-b">
            <div className="card-icon">🧠</div>
            <h3>引擎 B：透明金融</h3>
            <blockquote>
              "消灭量化交易中'黑盒模型'的欺诈，用波场链上业绩作为唯一的信用背书"
            </blockquote>
            <div className="positioning-details">
              <div className="detail-item">
                <strong>痛点:</strong> 量化模型业绩可以造假
              </div>
              <div className="detail-item">
                <strong>解决:</strong> 链上 Track Record，不可篡改
              </div>
              <div className="detail-item">
                <strong>价值:</strong> 建立信任，让知识变现
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>准备好体验了吗？</h2>
        <p>MiMiAlpha：让 AI 资产交易更安全、更透明、更高效</p>
        <div className="cta-buttons">
          <button className="cta-btn primary">
            开始使用 →
          </button>
          <button className="cta-btn secondary">
            查看文档
          </button>
        </div>
      </section>
    </div>
  );
}
