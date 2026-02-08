import { useState } from 'react';
import './FacilitatorXHome.css';

interface FacilitatorXHomeProps {
  onEnter?: () => void;
}

export function FacilitatorXHome({ onEnter }: FacilitatorXHomeProps) {
  const [hoveredEngine, setHoveredEngine] = useState<'A' | 'B' | null>(null);

  return (
    <div className="facilitatorx-home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="gradient-text">MiMiAlpha</span>
          </h1>
          <p className="hero-subtitle">
            AI 数字资产交易所 · 双引擎驱动
          </p>
          <p className="hero-description">
            算力资产化 + 知识变现 · 基于 TRON 的 Smart Facilitator
          </p>
          
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-value">1000万+</div>
              <div className="stat-label">潜在用户</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">$140M+</div>
              <div className="stat-label">月浪费金额</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">200%</div>
              <div className="stat-label">符合挑战2</div>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Engine Section */}
      <section className="dual-engine-section">
        <h2 className="section-title">双引擎驱动</h2>
        <p className="section-subtitle">覆盖高频微额 + 低频高额，打造完整的 AI 资产交易生态</p>
        
        <div className="engines-grid">
          {/* Engine A */}
          <div 
            className={`engine-card ${hoveredEngine === 'A' ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredEngine('A')}
            onMouseLeave={() => setHoveredEngine(null)}
          >
            <div className="engine-header">
              <div className="engine-icon">🔄</div>
              <h3 className="engine-title">引擎 A</h3>
              <p className="engine-subtitle">C2C 闲置 AI 订阅共享</p>
            </div>
            
            <div className="engine-badge">AI 版闲鱼</div>
            
            <div className="engine-features">
              <div className="feature-item">
                <span className="feature-icon">💰</span>
                <span className="feature-text">高频微额交易（$0.1/次）</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">⚡</span>
                <span className="feature-text">微支付聚合，节省 98% Energy</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🔒</span>
                <span className="feature-text">API Proxy 模式，密码不泄露</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <span className="feature-text">速率限制，保护账号安全</span>
              </div>
            </div>
            
            <div className="engine-stats">
              <div className="engine-stat">
                <div className="stat-number">1000万+</div>
                <div className="stat-desc">ChatGPT Plus 用户</div>
              </div>
              <div className="engine-stat">
                <div className="stat-number">70-90%</div>
                <div className="stat-desc">平均闲置率</div>
              </div>
            </div>
            
            <button className="engine-button" onClick={onEnter}>
              进入订阅市场 →
            </button>
          </div>

          {/* Engine B */}
          <div 
            className={`engine-card ${hoveredEngine === 'B' ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredEngine('B')}
            onMouseLeave={() => setHoveredEngine(null)}
          >
            <div className="engine-header">
              <div className="engine-icon">📈</div>
              <h3 className="engine-title">引擎 B</h3>
              <p className="engine-subtitle">量化模型信号交易</p>
            </div>
            
            <div className="engine-badge">AI 版彭博终端</div>
            
            <div className="engine-features">
              <div className="feature-item">
                <span className="feature-icon">💎</span>
                <span className="feature-text">低频高额交易（$500/信号）</span>
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
            
            <button className="engine-button" onClick={onEnter}>
              进入模型市场 →
            </button>
          </div>
        </div>
      </section>

      {/* Smart Facilitator Section */}
      <section className="facilitator-section">
        <h2 className="section-title">Smart Facilitator 双级风控</h2>
        <p className="section-subtitle">完美契合 TRON 挑战2，200% 符合度</p>
        
        <div className="facilitator-grid">
          <div className="facilitator-card">
            <div className="facilitator-icon">🔐</div>
            <h3>多维支付治理</h3>
            <p>引擎 A：速率限制、账号保护</p>
            <p>引擎 B：多签权限、大额风控</p>
          </div>
          
          <div className="facilitator-card">
            <div className="facilitator-icon">⚡</div>
            <h3>高频微支付处理</h3>
            <p>$0.1/次，聚合 50 笔</p>
            <p>节省 98% Energy</p>
          </div>
          
          <div className="facilitator-card">
            <div className="facilitator-icon">📝</div>
            <h3>语义化审计流水</h3>
            <p>"用户 A 的闲置算力被调用 5 次"</p>
            <p>"模型产生金价信号，机构支付 $500"</p>
          </div>
          
          <div className="facilitator-card">
            <div className="facilitator-icon">🛡️</div>
            <h3>风险识别</h3>
            <p>速率限制、异常检测</p>
            <p>定价拦截、自动仲裁</p>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="use-cases-section">
        <h2 className="section-title">真实使用场景</h2>
        
        <div className="use-cases-grid">
          <div className="use-case-card">
            <div className="use-case-header">
              <span className="use-case-icon">👨‍💻</span>
              <h3>小明出租闲置订阅</h3>
            </div>
            <div className="use-case-content">
              <p>ChatGPT Plus $20/月，只用 4 次</p>
              <p>上架剩余 36 次，定价 $0.5/次</p>
              <p className="highlight">月收入 $15，实际成本 $5</p>
              <p className="success">节省 75%！</p>
            </div>
          </div>
          
          <div className="use-case-card">
            <div className="use-case-header">
              <span className="use-case-icon">👩‍🎓</span>
              <h3>小红临时租赁</h3>
            </div>
            <div className="use-case-content">
              <p>需要翻译论文，需要 5 次调用</p>
              <p>租用小明的账号，支付 $2.5</p>
              <p className="highlight">vs 买整月 $20</p>
              <p className="success">节省 $17.5（87.5%）</p>
            </div>
          </div>
          
          <div className="use-case-card">
            <div className="use-case-header">
              <span className="use-case-icon">📊</span>
              <h3>量化大师卖信号</h3>
            </div>
            <div className="use-case-content">
              <p>高夏普比率金价模型（2.5）</p>
              <p>质押 $10,000，发布信号</p>
              <p className="highlight">月产生 20 个信号</p>
              <p className="success">月收入 $100,000</p>
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
              <p className="highlight">订阅费 $5,000/月</p>
              <p className="success">ROI 900%</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>准备好开始了吗？</h2>
        <p>选择适合你的引擎，开启 AI 资产交易之旅</p>
        <div className="cta-buttons">
          <button className="cta-button primary" onClick={onEnter}>
            出租闲置订阅 →
          </button>
          <button className="cta-button secondary" onClick={onEnter}>
            发布量化模型 →
          </button>
        </div>
      </section>
    </div>
  );
}
