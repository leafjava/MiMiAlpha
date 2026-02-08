import { AuditStream } from './AuditStream';
import { SharpeChart } from './SharpeChart';
import './TechShowcase.css';

export function TechShowcase() {
  return (
    <div className="tech-showcase">
      {/* Hero Section */}
      <section className="showcase-hero">
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          background: 'rgba(255, 165, 0, 0.1)',
          border: '1px solid rgba(255, 165, 0, 0.3)',
          borderRadius: '20px',
          marginBottom: '20px',
          fontSize: '14px',
          color: '#FFA500'
        }}>
          <span>🤝</span>
          <span>基于 AINFT 官方基础设施</span>
        </div>
        <h1>🔬 技术展示：可视化的 Alpha</h1>
        <p className="hero-subtitle">
          直观的数据证明 · 实时的治理监控 · 不可篡改的业绩追溯
        </p>
      </section>

      {/* AINFT Integration Section */}
      <section style={{
        padding: '60px 20px',
        background: 'linear-gradient(180deg, rgba(24, 24, 27, 0) 0%, rgba(255, 165, 0, 0.05) 100%)',
        borderTop: '1px solid rgba(255, 165, 0, 0.1)',
        borderBottom: '1px solid rgba(255, 165, 0, 0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 700,
            textAlign: 'center',
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            🤝 基于 AINFT 官方基础设施
          </h2>
          <p style={{
            textAlign: 'center',
            color: '#a1a1aa',
            marginBottom: '3rem',
            fontSize: '1.1rem'
          }}>
            我们的技术栈建立在 TRON 官方的 AI 基础设施之上
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem'
          }}>
            {/* AINFT Agent Framework */}
            <div style={{
              background: 'rgba(24, 24, 27, 0.8)',
              border: '1px solid rgba(255, 165, 0, 0.2)',
              borderRadius: '16px',
              padding: '24px',
              transition: 'all 0.3s'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  🤖
                </div>
                <div>
                  <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    color: '#FFA500',
                    marginBottom: '4px'
                  }}>
                    AINFT Agent Framework
                  </h3>
                  <div style={{
                    fontSize: '12px',
                    color: '#a1a1aa',
                    padding: '2px 8px',
                    background: 'rgba(255, 165, 0, 0.1)',
                    borderRadius: '8px',
                    display: 'inline-block'
                  }}>
                    官方 MAS 框架
                  </div>
                </div>
              </div>
              <p style={{
                color: '#d4d4d8',
                marginBottom: '16px',
                lineHeight: '1.6'
              }}>
                我们的所有 AI Agent 都基于 AINFT 多智能体系统框架构建
              </p>
              <div style={{ color: '#a1a1aa', fontSize: '0.9rem', lineHeight: '1.8' }}>
                <div style={{ marginBottom: '8px' }}>
                  ✅ 库存监控 Agent
                </div>
                <div style={{ marginBottom: '8px' }}>
                  ✅ 动态定价 Agent
                </div>
                <div style={{ marginBottom: '8px' }}>
                  ✅ 调度分配 Agent
                </div>
                <div>
                  ✅ 客服 Agent
                </div>
              </div>
            </div>

            {/* AINFT Nova */}
            <div style={{
              background: 'rgba(24, 24, 27, 0.8)',
              border: '1px solid rgba(255, 165, 0, 0.2)',
              borderRadius: '16px',
              padding: '24px',
              transition: 'all 0.3s'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  💎
                </div>
                <div>
                  <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    color: '#FFA500',
                    marginBottom: '4px'
                  }}>
                    AINFT Nova
                  </h3>
                  <div style={{
                    fontSize: '12px',
                    color: '#a1a1aa',
                    padding: '2px 8px',
                    background: 'rgba(255, 165, 0, 0.1)',
                    borderRadius: '8px',
                    display: 'inline-block'
                  }}>
                    官方资产化平台
                  </div>
                </div>
              </div>
              <p style={{
                color: '#d4d4d8',
                marginBottom: '16px',
                lineHeight: '1.6'
              }}>
                量化模型通过 TRON 链上智能合约进行管理和交易
              </p>
              <div style={{ color: '#a1a1aa', fontSize: '0.9rem', lineHeight: '1.8' }}>
                <div style={{ marginBottom: '8px' }}>
                  ✅ 模型代币化
                </div>
                <div style={{ marginBottom: '8px' }}>
                  ✅ 链上验证
                </div>
                <div style={{ marginBottom: '8px' }}>
                  ✅ 透明交易
                </div>
                <div>
                  ✅ 安全托管
                </div>
              </div>
            </div>

            {/* Smart Facilitator */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(255, 165, 0, 0.1) 0%, rgba(255, 140, 0, 0.1) 100%)',
              border: '2px solid rgba(255, 165, 0, 0.5)',
              borderRadius: '16px',
              padding: '24px',
              transition: 'all 0.3s',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: '#FFA500',
                color: '#000',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 600
              }}>
                ⭐ 我们的创新
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  🛡️
                </div>
                <div>
                  <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    color: '#FFA500',
                    marginBottom: '4px'
                  }}>
                    Smart Facilitator
                  </h3>
                  <div style={{
                    fontSize: '12px',
                    color: '#a1a1aa',
                    padding: '2px 8px',
                    background: 'rgba(255, 165, 0, 0.2)',
                    borderRadius: '8px',
                    display: 'inline-block'
                  }}>
                    MiMiAlpha 核心创新
                  </div>
                </div>
              </div>
              <p style={{
                color: '#d4d4d8',
                marginBottom: '16px',
                lineHeight: '1.6'
              }}>
                为 AINFT Agent 提供财务治理和风险控制
              </p>
              <div style={{ color: '#d4d4d8', fontSize: '0.9rem', lineHeight: '1.8' }}>
                <div style={{ marginBottom: '8px' }}>
                  ✅ 多维支付策略
                </div>
                <div style={{ marginBottom: '8px' }}>
                  ✅ 风险识别
                </div>
                <div style={{ marginBottom: '8px' }}>
                  ✅ 微支付聚合
                </div>
                <div>
                  ✅ 语义化审计
                </div>
              </div>
            </div>
          </div>

          {/* 生态定位说明 */}
          <div style={{
            marginTop: '3rem',
            padding: '24px',
            background: 'rgba(24, 24, 27, 0.8)',
            border: '1px solid rgba(255, 165, 0, 0.3)',
            borderRadius: '16px',
            textAlign: 'center'
          }}>
            <p style={{
              color: '#d4d4d8',
              fontSize: '1.1rem',
              lineHeight: '1.8',
              maxWidth: '900px',
              margin: '0 auto'
            }}>
              <strong style={{ color: '#FFA500' }}>AINFT</strong> 提供了 Agent 框架和资产化工具，
              <strong style={{ color: '#FFA500' }}> MiMiAlpha</strong> 提供了财务治理和商业化场景。
              <br />
              我们是 <strong style={{ color: '#FFA500' }}>TRON AI 生态的关键拼图</strong>。
            </p>
          </div>
        </div>
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
              示例：购买单个信号 ($5)
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
              示例：购买多个信号 ($50)
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
              示例：月度订阅模型 ($50)
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
              示例：年度订阅模型 ($500)
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Gateway */}
      <section className="privacy-section">
        <h2>🔒 支付安全网关：资金永不失控</h2>
        <p className="section-description">
          Smart Facilitator 拦截所有支付请求，确保 AI Agent 的支付行为受到严格控制
        </p>
        
        <div className="privacy-comparison">
          <div className="comparison-card unsafe">
            <h3>❌ 传统方式（不安全）</h3>
            <div className="flow-diagram">
              <div className="flow-step">
                <div className="step-icon">🤖</div>
                <div className="step-label">AI Agent</div>
              </div>
              <div className="flow-arrow">直接支付 →</div>
              <div className="flow-step">
                <div className="step-icon">💰</div>
                <div className="step-label">量化模型</div>
              </div>
            </div>
            <div className="risks">
              <div className="risk-item">❌ 无限额控制</div>
              <div className="risk-item">❌ 可能被恶意定价欺诈</div>
              <div className="risk-item">❌ 程序漏洞导致资金耗尽</div>
            </div>
          </div>

          <div className="comparison-card safe">
            <h3>✅ MiMiAlpha 方式（安全）</h3>
            <div className="flow-diagram">
              <div className="flow-step">
                <div className="step-icon">🤖</div>
                <div className="step-label">AI Agent</div>
              </div>
              <div className="flow-arrow">支付请求 →</div>
              <div className="flow-step highlight">
                <div className="step-icon">🛡️</div>
                <div className="step-label">Facilitator</div>
                <div className="step-sublabel">(Payment Gateway)</div>
              </div>
              <div className="flow-arrow">验证通过 →</div>
              <div className="flow-step">
                <div className="step-icon">💰</div>
                <div className="step-label">量化模型</div>
              </div>
            </div>
            <div className="benefits">
              <div className="benefit-item">✅ 限额保护（$10/次，$100/月）</div>
              <div className="benefit-item">✅ 价格仲裁（偏差&gt;30%熔断）</div>
              <div className="benefit-item">✅ 黑白名单过滤</div>
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
        <h2>🎯 商业定位：智能互联网的财务治理层</h2>
        
        <div className="positioning-grid">
          <div className="positioning-card engine-b" style={{ gridColumn: '1 / -1', maxWidth: '800px', margin: '0 auto' }}>
            <div className="card-icon">🧠</div>
            <h3>量化信号市场：透明的智能金融</h3>
            <blockquote>
              "响应 TRON 2025 战略升级，解决智能互联网时代最核心的矛盾：AI Agent 自主决策的高频性与人类资产安全的确定性之间的平衡"
            </blockquote>
            <div className="positioning-details">
              <div className="detail-item">
                <strong>技术融合:</strong> 基于 AINFT MAS 框架构建量化 Agent
              </div>
              <div className="detail-item">
                <strong>叙事融合:</strong> 从价值互联网到智能互联网的关键治理层
              </div>
              <div className="detail-item">
                <strong>核心价值:</strong> Smart Facilitator 监控支付安全，链上 Track Record 建立信任
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
