import { useState } from 'react';
import './FacilitatorXHome.css';

type PageType = 'subscription' | 'model' | 'tech' | 'risk' | 'dispute' | 'agent';

interface FacilitatorXHomeProps {
  onEnter?: () => void;
  onNavigate?: (page: PageType) => void;
}

export function FacilitatorXHome({ onEnter, onNavigate }: FacilitatorXHomeProps) {
  const [hoveredEngine, setHoveredEngine] = useState<'A' | 'B' | null>(null);

  return (
    <div className="facilitatorx-home">
      {/* AINFT Ecosystem Badge */}
      <div style={{
        position: 'fixed',
        top: '80px',
        right: '20px',
        background: 'rgba(24, 24, 27, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 165, 0, 0.3)',
        borderRadius: '12px',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        zIndex: 999,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          background: 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px'
        }}>
          🤝
        </div>
        <div style={{ fontSize: '12px', color: '#a1a1aa' }}>
          <div style={{ fontWeight: 600, color: '#FFA500', marginBottom: '2px' }}>
            Powered by AINFT
          </div>
          <div style={{ fontSize: '10px' }}>
            TRON AI Ecosystem
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          {/* AINFT Ecosystem Tag */}
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

          <h1 className="hero-title">
            <span className="gradient-text">MiMiAlpha</span>
          </h1>
          <p className="hero-subtitle">
            AI Agent 与 x402 服务端之间的非侵入式中间件
          </p>
          <p className="hero-description">
            拦截/审计/优化 x402 支付请求 · 让用户放心把钱包授权给 AI
          </p>
          
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-value">$1.5T</div>
              <div className="stat-label">智能互联网市场</div>
              <div style={{ fontSize: '10px', color: '#a1a1aa', marginTop: '4px' }}>
                AINFT 官方数据
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-value">200%</div>
              <div className="stat-label">符合挑战2</div>
              <div style={{ fontSize: '10px', color: '#a1a1aa', marginTop: '4px' }}>
                完美契合
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-value">最后拼图</div>
              <div className="stat-label">生态定位</div>
              <div style={{ fontSize: '10px', color: '#a1a1aa', marginTop: '4px' }}>
                财务治理层
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AINFT Ecosystem Positioning */}
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
            🤝 MiMiAlpha 在 AINFT 生态中的定位
          </h2>
          <p style={{
            textAlign: 'center',
            color: '#a1a1aa',
            marginBottom: '3rem',
            fontSize: '1.1rem'
          }}>
            响应 TRON 2025 战略升级：从"价值互联网"到"智能互联网"
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            {/* 官方提供 */}
            <div style={{
              background: 'rgba(24, 24, 27, 0.8)',
              border: '1px solid rgba(255, 165, 0, 0.2)',
              borderRadius: '16px',
              padding: '24px',
              transition: 'all 0.3s'
            }}>
              <div style={{
                fontSize: '2rem',
                marginBottom: '12px'
              }}>
                🏗️
              </div>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: 600,
                marginBottom: '12px',
                color: '#FFA500'
              }}>
                AINFT 官方提供
              </h3>
              <div style={{ color: '#d4d4d8', lineHeight: '1.8' }}>
                <div style={{ marginBottom: '8px' }}>
                  ✅ <strong>AINFT Agent Framework</strong>
                  <div style={{ fontSize: '0.9rem', color: '#a1a1aa', marginLeft: '24px' }}>
                    多智能体系统（MAS）框架
                  </div>
                </div>
                <div style={{ marginBottom: '8px' }}>
                  ✅ <strong>AINFT Nova</strong>
                  <div style={{ fontSize: '0.9rem', color: '#a1a1aa', marginLeft: '24px' }}>
                    AI Agent 资产化平台
                  </div>
                </div>
                <div>
                  ✅ <strong>$1.5T 智能互联网愿景</strong>
                  <div style={{ fontSize: '0.9rem', color: '#a1a1aa', marginLeft: '24px' }}>
                    官方战略和市场规模
                  </div>
                </div>
              </div>
            </div>

            {/* 生态空白 */}
            <div style={{
              background: 'rgba(24, 24, 27, 0.8)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '16px',
              padding: '24px',
              transition: 'all 0.3s'
            }}>
              <div style={{
                fontSize: '2rem',
                marginBottom: '12px'
              }}>
                ⚠️
              </div>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: 600,
                marginBottom: '12px',
                color: '#ef4444'
              }}>
                官方缺失
              </h3>
              <div style={{ color: '#d4d4d8', lineHeight: '1.8' }}>
                <div style={{ marginBottom: '8px' }}>
                  ❌ <strong>AI Agent 财务治理</strong>
                  <div style={{ fontSize: '0.9rem', color: '#a1a1aa', marginLeft: '24px' }}>
                    Agent 自主决策的安全管理
                  </div>
                </div>
                <div style={{ marginBottom: '8px' }}>
                  ❌ <strong>高频微支付安全</strong>
                  <div style={{ fontSize: '0.9rem', color: '#a1a1aa', marginLeft: '24px' }}>
                    微支付聚合和风险控制
                  </div>
                </div>
                <div>
                  ❌ <strong>商业化落地场景</strong>
                  <div style={{ fontSize: '0.9rem', color: '#a1a1aa', marginLeft: '24px' }}>
                    具体的应用和收益模式
                  </div>
                </div>
              </div>
            </div>

            {/* MiMiAlpha 填补 */}
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
                fontSize: '2rem',
                marginBottom: '12px'
              }}>
                🛡️
              </div>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: 600,
                marginBottom: '12px',
                color: '#FFA500'
              }}>
                MiMiAlpha 填补空白
              </h3>
              <div style={{ color: '#d4d4d8', lineHeight: '1.8' }}>
                <div>
                  ✅ <strong>Smart Facilitator 治理层</strong>
                  <div style={{ fontSize: '0.9rem', color: '#a1a1aa', marginLeft: '24px' }}>
                    多维支付策略和风险控制
                  </div>
                </div>
                <div>
                  ✅ <strong>量化金融商业化场景</strong>
                  <div style={{ fontSize: '0.9rem', color: '#a1a1aa', marginLeft: '24px' }}>
                    透明的量化信号市场
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 核心矛盾 */}
          <div style={{
            background: 'rgba(24, 24, 27, 0.8)',
            border: '1px solid rgba(255, 165, 0, 0.3)',
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              marginBottom: '16px',
              color: '#FFA500'
            }}>
              🎯 解决智能互联网的核心矛盾
            </h3>
            <div style={{
              fontSize: '1.2rem',
              color: '#d4d4d8',
              marginBottom: '16px',
              lineHeight: '1.8'
            }}>
              <strong style={{ color: '#FFA500' }}>AI Agent 自主决策的高频性</strong>
              <span style={{ margin: '0 16px', color: '#a1a1aa' }}>vs</span>
              <strong style={{ color: '#FFA500' }}>人类资产安全的确定性</strong>
            </div>
            <p style={{
              color: '#a1a1aa',
              fontSize: '1rem',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              MiMiAlpha 的 Smart Facilitator 让 Agent 可以自主决策（高频微支付），
              但受到多维治理策略的约束（资产安全）
            </p>
          </div>

          {/* 核心金句 */}
          <div style={{
            marginTop: '3rem',
            padding: '32px',
            background: 'linear-gradient(135deg, rgba(255, 165, 0, 0.1) 0%, rgba(255, 140, 0, 0.1) 100%)',
            border: '2px solid rgba(255, 165, 0, 0.3)',
            borderRadius: '16px',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#FFA500',
              marginBottom: '16px',
              lineHeight: '1.6'
            }}>
              "官方提供了'车（Agent）'和'货（Tokenized Assets）'，<br />
              我们提供了'交通规则和减震器（Smart Facilitator）'"
            </div>
            <div style={{
              fontSize: '1.2rem',
              color: '#d4d4d8',
              fontWeight: 600
            }}>
              我们是 TRON AI 生态落地大规模商业化的最后一块拼图
            </div>
          </div>
        </div>
      </section>

      {/* Dual Engine Section */}
      <section className="dual-engine-section">
        <h2 className="section-title">核心引擎</h2>
        <p className="section-subtitle">基于 AINFT Agent Framework 构建，打造透明的量化金融生态</p>
        
        <div className="engines-grid" style={{ gridTemplateColumns: '1fr', maxWidth: '800px', margin: '0 auto' }}>
          {/* Engine B - 量化模型市场 */}
          <div 
            className={`engine-card ${hoveredEngine === 'B' ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredEngine('B')}
            onMouseLeave={() => setHoveredEngine(null)}
          >
            <div className="engine-header">
              <div className="engine-icon">📈</div>
              <h3 className="engine-title">量化信号市场</h3>
              <p className="engine-subtitle">基于 AINFT MAS 框架的量化信号治理</p>
            </div>
            
            <div className="engine-badge">智能互联网时代的透明金融</div>
            
            <div className="engine-features">
              <div className="feature-item">
                <span className="feature-icon">💎</span>
                <span className="feature-text">低频高额交易（$5/信号）</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🔗</span>
                <span className="feature-text">链上 Track Record，不可篡改</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🛡️</span>
                <span className="feature-text">质押机制，对质量负责</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">⚖️</span>
                <span className="feature-text">自动仲裁，误差 &gt; 5% 退款</span>
              </div>
            </div>
            
            <div className="engine-stats">
              <div className="engine-stat">
                <div className="stat-number">$1T+</div>
                <div className="stat-desc">量化资产管理</div>
              </div>
              <div className="engine-stat">
                <div className="stat-number">2.5+</div>
                <div className="stat-desc">夏普比率</div>
              </div>
            </div>
            
            <button className="engine-button" onClick={() => {
              if (onNavigate) {
                onNavigate('model');
              } else if (onEnter) {
                onEnter();
              }
            }}>
              进入模型市场 →
            </button>
          </div>
        </div>
      </section>

      {/* Smart Facilitator Section */}
      <section className="facilitator-section">
        <h2 className="section-title">Smart Facilitator：AI Agent 与 x402 之间的中间件</h2>
        <p className="section-subtitle">完美契合 TRON 挑战2，实现三大核心功能</p>
        
        <div className="facilitator-grid">
          <div 
            className="facilitator-card"
            onClick={() => {
              if (onNavigate) {
                onNavigate('risk');
              }
            }}
            style={{ cursor: 'pointer' }}
          >
            <div className="facilitator-icon">🔐</div>
            <h3>x402 支付拦截与治理</h3>
            <p>拦截所有 x402 支付请求</p>
            <p>限额/配额/黑白名单验证</p>
          </div>
          
          <div 
            className="facilitator-card"
            onClick={() => {
              if (onNavigate) {
                onNavigate('tech');
              }
            }}
            style={{ cursor: 'pointer' }}
          >
            <div className="facilitator-icon">⚡</div>
            <h3>x402 微支付聚合</h3>
            <p>50 笔聚合为 1 笔链上交易</p>
            <p>节省 98% Energy 消耗</p>
          </div>
          
          <div 
            className="facilitator-card"
            onClick={() => {
              if (onNavigate) {
                onNavigate('agent');
              }
            }}
            style={{ cursor: 'pointer' }}
          >
            <div className="facilitator-icon">📝</div>
            <h3>x402 语义化审计</h3>
            <p>原始 Hex → 人类可读报告</p>
            <p>"Agent_A 调用 DeepL，支付 0.5 USDD"</p>
          </div>
          
          <div 
            className="facilitator-card"
            onClick={() => {
              if (onNavigate) {
                onNavigate('dispute');
              }
            }}
            style={{ cursor: 'pointer' }}
          >
            <div className="facilitator-icon">🛡️</div>
            <h3>动态定价仲裁</h3>
            <p>对比 x402 服务市场均价</p>
            <p>偏差 &gt;30% 自动熔断</p>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="use-cases-section">
        <h2 className="section-title">真实使用场景</h2>
        
        <div className="use-cases-grid">
          <div className="use-case-card">
            <div className="use-case-header">
              <span className="use-case-icon">📊</span>
              <h3>量化大师卖信号</h3>
            </div>
            <div className="use-case-content">
              <p>高夏普比率金价模型（2.5）</p>
              <p>质押 $100，发布信号</p>
              <p className="highlight">月产生 20 个信号</p>
              <p className="success">月收入 $100</p>
            </div>
          </div>
          
          <div className="use-case-card">
            <div className="use-case-header">
              <span className="use-case-icon">🏢</span>
              <h3>机构订阅模型</h3>
            </div>
            <div className="use-case-content">
              <p>查看链上 Track Record</p>
              <p>准确率 82%，夏普比率 2.5</p>
              <p className="highlight">订阅费 $50/月</p>
              <p className="success">ROI 900%</p>
            </div>
          </div>

          <div className="use-case-card">
            <div className="use-case-header">
              <span className="use-case-icon">🤖</span>
              <h3>AI Agent 自动交易</h3>
            </div>
            <div className="use-case-content">
              <p>Agent 订阅多个量化模型</p>
              <p>Smart Facilitator 监控支付</p>
              <p className="highlight">限额保护 $100/月</p>
              <p className="success">安全可控</p>
            </div>
          </div>

          <div className="use-case-card">
            <div className="use-case-header">
              <span className="use-case-icon">🔒</span>
              <h3>质押金保障</h3>
            </div>
            <div className="use-case-content">
              <p>模型提供者质押 $100</p>
              <p>错误信号自动罚没</p>
              <p className="highlight">准确率 &lt; 70% 罚 10%</p>
              <p className="success">质量保证</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>准备好开始了吗？</h2>
        <p>进入量化信号市场，开启透明金融之旅</p>
        <div className="cta-buttons">
          <button className="cta-button primary" onClick={onEnter}>
            发布量化模型 →
          </button>
          <button className="cta-button secondary" onClick={onEnter}>
            订阅信号服务 →
          </button>
        </div>
      </section>
    </div>
  );
}
