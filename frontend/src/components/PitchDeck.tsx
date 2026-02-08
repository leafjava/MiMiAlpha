import { useState } from 'react';
import './PitchDeck.css';

interface Problem {
  icon: string;
  title: string;
  desc: string;
  example: string;
}

interface Solution {
  icon: string;
  title: string;
  desc: string;
}

interface Feature {
  title: string;
  desc: string;
  screenshot: string;
  highlights: string[];
}

interface TechStack {
  name: string;
  tech: string;
}

interface TeamMember {
  name: string;
  role: string;
  avatar: string;
}

interface SlideData {
  id: number;
  type: string;
  title?: string;
  subtitle?: string;
  tagline?: string;
  team?: string | { members: TeamMember[] };
  background?: string;
  problems?: Problem[];
  solutions?: Solution[];
  features?: Feature[];
  tech?: {
    stack: TechStack[];
    architecture: string[];
  };
  summary?: string[];
  nextSteps?: string[];
  contact?: {
    demo: string;
    github: string;
    email: string;
  };
}

export function PitchDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: SlideData[] = [
    // 第 1 页：封面
    {
      id: 1,
      type: 'cover',
      title: 'MiMiAlpha Smart Facilitator',
      subtitle: '面向 AI Agent 的可信财务治理中间件',
      tagline: '让 AI Agent 安全地参与量化交易',
      team: 'MiMiAlpha Team',
      background: 'linear-gradient(135deg, #1a1a1d 0%, #2d1810 50%, #1a1a1d 100%)'
    },
    // 第 2 页：问题 & 解决方案
    {
      id: 2,
      type: 'problem-solution',
      title: '问题 & 解决方案',
      problems: [
        {
          icon: '💸',
          title: '资金过载',
          desc: '程序漏洞可能导致钱包余额瞬间归零',
          example: 'AI Agent 无限循环购买信号'
        },
        {
          icon: '⚡',
          title: '清算效率低',
          desc: '高频微支付导致 Gas 费高昂',
          example: '每天 240 笔支付，Gas 费 $200/月'
        },
        {
          icon: '🎣',
          title: '恶意定价',
          desc: 'AI 难以识别欺诈和虚假定价',
          example: '$500 信号被标价 $5000'
        }
      ],
      solutions: [
        {
          icon: '🔐',
          title: '多维支付治理',
          desc: '限额、配额、白名单、多签降级'
        },
        {
          icon: '⚡',
          title: '高频微支付聚合',
          desc: '节省 98% Gas 费（$200 → $4/月）'
        },
        {
          icon: '📊',
          title: '语义化审计流水',
          desc: 'Hex → 人类可读 + AI 报告'
        }
      ]
    },
    // 第 3 页：产品演示
    {
      id: 3,
      type: 'demo',
      title: '产品演示',
      features: [
        {
          title: '🧠 模型市场',
          desc: 'AI Agent 自动订阅量化模型',
          screenshot: '模型市场界面',
          highlights: ['质押机制', '实时收益', '链上验证']
        },
        {
          title: '🛡️ 风险评估',
          desc: 'AI 实时监控市场风险',
          screenshot: '风险评估界面',
          highlights: ['实时预警', '风险等级', '智能建议']
        },
        {
          title: '⚖️ 争议仲裁',
          desc: '链上仲裁保护投资者',
          screenshot: '争议仲裁界面',
          highlights: ['自动验证', '社区投票', '自动赔偿']
        }
      ]
    },
    // 第 4 页：技术 & 团队
    {
      id: 4,
      type: 'tech-team',
      title: '技术 & 团队',
      tech: {
        stack: [
          { name: '前端', tech: 'React + TypeScript + Vite' },
          { name: '后端', tech: 'Python + Flask (9 APIs)' },
          { name: '智能合约', tech: 'Solidity on TRON' },
          { name: 'AI', tech: 'Ollama + Qwen' }
        ],
        architecture: [
          'AI Trading Agent',
          '↓',
          'Smart Facilitator (治理层)',
          '↓',
          'x402 服务端',
          '↓',
          '量化模型提供商'
        ]
      },
      team: {
        members: [
          { name: 'Team Lead', role: '项目负责人 & 架构设计', avatar: '👨‍💻' },
          { name: 'Frontend Dev', role: '前端开发 & UI/UX', avatar: '👩‍💻' },
          { name: 'Backend Dev', role: '后端开发 & API 设计', avatar: '👨‍💻' },
          { name: 'Smart Contract', role: '智能合约 & 区块链', avatar: '👩‍💻' }
        ]
      } as { members: TeamMember[] }
    },
    // 第 5 页：结尾
    {
      id: 5,
      type: 'closing',
      title: '感谢观看！',
      summary: [
        '✅ 200% 完成度（3 核心 + 2 扩展 + 应用场景）',
        '✅ 深度融合 AINFT 生态（基于 MAS 框架）',
        '✅ 响应 TRON "智能互联网" 战略',
        '✅ 真实可用的代码（不是 PPT）'
      ],
      nextSteps: [
        '📈 扩展更多量化模型',
        '🌐 支持多链部署',
        '🤖 增强 AI 风控能力'
      ],
      contact: {
        demo: 'http://localhost:5173',
        github: 'github.com/mimialpha',
        email: 'team@mimialpha.com'
      }
    }
  ];

  const currentSlideData = slides[currentSlide];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="pitch-deck">
      {/* 幻灯片容器 */}
      <div className="slide-container">
        {currentSlideData.type === 'cover' && (
          <div 
            className="slide slide-cover"
            style={{ background: currentSlideData.background }}
          >
            <div className="cover-content">
              <div className="logo">🚀</div>
              <h1 className="project-title">{currentSlideData.title}</h1>
              <h2 className="project-subtitle">{currentSlideData.subtitle}</h2>
              <p className="tagline">{currentSlideData.tagline}</p>
              <div className="team-name">{typeof currentSlideData.team === 'string' ? currentSlideData.team : 'MiMiAlpha Team'}</div>
              <div className="badges">
                <span className="badge">基于 AINFT MAS 框架</span>
                <span className="badge">TRON 挑战2</span>
              </div>
            </div>
          </div>
        )}

        {currentSlideData.type === 'problem-solution' && (
          <div className="slide slide-problem-solution">
            <h2 className="slide-title">{currentSlideData.title}</h2>
            <div className="ps-container">
              {/* 问题部分 */}
              <div className="problems-section">
                <h3 className="section-title">❌ x402 协议带来的挑战</h3>
                <div className="problems-grid">
                  {currentSlideData.problems?.map((problem, idx) => (
                    <div key={idx} className="problem-card">
                      <div className="problem-icon">{problem.icon}</div>
                      <h4>{problem.title}</h4>
                      <p className="problem-desc">{problem.desc}</p>
                      <p className="problem-example">例：{problem.example}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 解决方案部分 */}
              <div className="solutions-section">
                <h3 className="section-title">✅ Smart Facilitator 解决方案</h3>
                <div className="solutions-grid">
                  {currentSlideData.solutions?.map((solution, idx) => (
                    <div key={idx} className="solution-card">
                      <div className="solution-icon">{solution.icon}</div>
                      <h4>{solution.title}</h4>
                      <p>{solution.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="architecture-flow">
                  <div className="flow-item">AI Agent</div>
                  <div className="flow-arrow">→</div>
                  <div className="flow-item highlight">Smart Facilitator</div>
                  <div className="flow-arrow">→</div>
                  <div className="flow-item">x402</div>
                  <div className="flow-arrow">→</div>
                  <div className="flow-item">服务商</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentSlideData.type === 'demo' && (
          <div className="slide slide-demo">
            <h2 className="slide-title">{currentSlideData.title}</h2>
            <div className="demo-grid">
              {currentSlideData.features?.map((feature, idx) => (
                <div key={idx} className="demo-card">
                  <h3>{feature.title}</h3>
                  <div className="screenshot-placeholder">
                    <div className="screenshot-icon">🖼️</div>
                    <p>{feature.screenshot}</p>
                  </div>
                  <p className="demo-desc">{feature.desc}</p>
                  <div className="highlights">
                    {feature.highlights.map((highlight, hIdx) => (
                      <span key={hIdx} className="highlight-tag">
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="demo-note">
              💡 提示：所有功能均已实现，可在导航栏切换查看
            </div>
          </div>
        )}

        {currentSlideData.type === 'tech-team' && (
          <div className="slide slide-tech-team">
            <h2 className="slide-title">{currentSlideData.title}</h2>
            
            {/* 技术部分 */}
            <div className="tech-section">
              <h3 className="section-title">🔧 技术栈</h3>
              <div className="tech-stack">
                {currentSlideData.tech?.stack.map((item, idx) => (
                  <div key={idx} className="tech-item">
                    <span className="tech-name">{item.name}</span>
                    <span className="tech-detail">{item.tech}</span>
                  </div>
                ))}
              </div>
              
              <h3 className="section-title" style={{ marginTop: '2rem' }}>🏗️ 架构流程</h3>
              <div className="architecture">
                {currentSlideData.tech?.architecture.map((step, idx) => (
                  <div key={idx} className={`arch-step ${step === '↓' ? 'arrow' : ''}`}>
                    {step}
                  </div>
                ))}
              </div>
            </div>

            {/* 团队部分 */}
            <div className="team-section">
              <h3 className="section-title">👥 团队成员</h3>
              <div className="team-grid">
                {currentSlideData.team && typeof currentSlideData.team !== 'string' && currentSlideData.team.members.map((member: TeamMember, idx: number) => (
                  <div key={idx} className="team-member">
                    <div className="member-avatar">{member.avatar}</div>
                    <h4>{member.name}</h4>
                    <p>{member.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentSlideData.type === 'closing' && (
          <div className="slide slide-closing">
            <h2 className="slide-title">{currentSlideData.title}</h2>
            
            <div className="closing-content">
              <div className="summary-section">
                <h3>🎯 项目亮点</h3>
                <ul className="summary-list">
                  {currentSlideData.summary?.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="next-steps-section">
                <h3>🚀 后续计划</h3>
                <ul className="next-steps-list">
                  {currentSlideData.nextSteps?.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              </div>

              <div className="contact-section">
                <h3>📞 联系我们</h3>
                <div className="contact-info">
                  <div className="contact-item">
                    <span className="contact-label">Demo:</span>
                    <span className="contact-value">{currentSlideData.contact?.demo}</span>
                  </div>
                  <div className="contact-item">
                    <span className="contact-label">GitHub:</span>
                    <span className="contact-value">{currentSlideData.contact?.github}</span>
                  </div>
                  <div className="contact-item">
                    <span className="contact-label">Email:</span>
                    <span className="contact-value">{currentSlideData.contact?.email}</span>
                  </div>
                </div>
              </div>

              <div className="thank-you">
                <p className="thank-you-text">欢迎提问！🙋‍♂️</p>
                <p className="quote">"我们是 TRON AI 生态落地大规模商业化的最后一块拼图"</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 导航控制 */}
      <div className="slide-controls">
        <button 
          className="control-btn prev-btn" 
          onClick={prevSlide}
          disabled={currentSlide === 0}
        >
          ← 上一页
        </button>
        
        <div className="slide-indicators">
          {slides.map((_, idx) => (
            <button
              key={idx}
              className={`indicator ${currentSlide === idx ? 'active' : ''}`}
              onClick={() => goToSlide(idx)}
              aria-label={`跳转到第 ${idx + 1} 页`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
        
        <button 
          className="control-btn next-btn" 
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
        >
          下一页 →
        </button>
      </div>

      {/* 页码显示 */}
      <div className="slide-counter">
        {currentSlide + 1} / {slides.length}
      </div>
    </div>
  );
}
