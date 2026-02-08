import { useState } from 'react';
import { AppProvider } from './AppContext';
import { WagmiProvider } from './providers/WagmiProvider';
import { ConnectWallet } from './components/ConnectWallet';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { PopupAssistant } from './components/PopupAssistant';
import { LandingPage } from './components/LandingPage';
import { RiskAssessment } from './components/RiskAssessment';
import { DisputeArbitration } from './components/DisputeArbitration';
import { CreditScore } from './components/CreditScore';
import { InvestmentPool } from './components/InvestmentPool';
import { FacilitatorXHome } from './components/FacilitatorXHome';
import { SubscriptionMarket } from './components/SubscriptionMarket';
import { ModelMarket } from './components/ModelMarket';
import { ModelMarket2 } from './components/ModelMarket2';
import { TechShowcase } from './components/TechShowcase';
import { AgentManager } from './components/AgentManager';
import './index.css';

type Page = 'home' | 'subscription' | 'model' | 'model2' | 'tech' | 'pool' | 'market' | 'risk' | 'dispute' | 'credit' | 'agent';

function AppContent() {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [showSplineLanding, setShowSplineLanding] = useState(true);
  const [showMiMiAlphaHome, setShowMiMiAlphaHome] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('home');

  // Show Spline 3D landing page first
  if (showSplineLanding) {
    return <LandingPage onEnter={() => {
      setShowSplineLanding(false);
      setShowMiMiAlphaHome(true);
    }} />;
  }

  // Show MiMiAlpha home page after Spline
  if (showMiMiAlphaHome) {
    return <FacilitatorXHome 
      onEnter={() => setShowMiMiAlphaHome(false)} 
      onNavigate={(page) => {
        setShowMiMiAlphaHome(false);
        setCurrentPage(page);
      }}
    />;
  }

  return (
    <div>
      {/* 顶部导航栏 */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '70px',
        background: 'rgba(24, 24, 27, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 165, 0, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        zIndex: 1000,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
      }}>
        {/* 左侧导航 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ 
            fontSize: '1.5rem', 
            fontWeight: 700, 
            color: '#FFA500',
            cursor: 'pointer'
          }} onClick={() => {
            setShowSplineLanding(true);
            setShowMiMiAlphaHome(false);
          }}>
            🚀 MiMiAlpha
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setCurrentPage('home')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: 'none',
                background: currentPage === 'home' ? 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)' : 'transparent',
                color: currentPage === 'home' ? '#fff' : '#a1a1aa',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              🏠 首页
            </button>
            
            <button
              onClick={() => setCurrentPage('model')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: 'none',
                background: currentPage === 'model' ? 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)' : 'transparent',
                color: currentPage === 'model' ? '#fff' : '#a1a1aa',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              🧠 模型市场
            </button>
            
            <button
              onClick={() => setCurrentPage('model2')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: 'none',
                background: currentPage === 'model2' ? 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)' : 'transparent',
                color: currentPage === 'model2' ? '#fff' : '#a1a1aa',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              🤖 模型市场二
            </button>
            
            <button
              onClick={() => setCurrentPage('tech')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: 'none',
                background: currentPage === 'tech' ? 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)' : 'transparent',
                color: currentPage === 'tech' ? '#fff' : '#a1a1aa',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              🔬 技术展示
            </button>
            
            <button
              onClick={() => setCurrentPage('risk')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: 'none',
                background: currentPage === 'risk' ? 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)' : 'transparent',
                color: currentPage === 'risk' ? '#fff' : '#a1a1aa',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              🛡️ 风险评估
            </button>
            
            <button
              onClick={() => setCurrentPage('dispute')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: 'none',
                background: currentPage === 'dispute' ? 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)' : 'transparent',
                color: currentPage === 'dispute' ? '#fff' : '#a1a1aa',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              ⚖️ 争议仲裁
            </button>
          </div>
        </div>

        {/* 右侧按钮组 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <LanguageSwitcher />
          
          <button
            type="button"
            onClick={() => setIsAssistantOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.6em 1.2em',
              borderRadius: '8px',
              backgroundColor: '#27272a',
              border: '1px solid #3f3f46',
              color: '#FFA500',
              fontWeight: '500',
              fontSize: '0.9em',
              cursor: 'pointer',
              transition: 'all 0.25s',
              boxShadow: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#3f3f46';
              e.currentTarget.style.borderColor = '#FFA500';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 165, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#27272a';
              e.currentTarget.style.borderColor = '#3f3f46';
              e.currentTarget.style.boxShadow = 'none';
            }}
            aria-label="Toggle AI Chat"
          >
            <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Ask AI
          </button>

          <ConnectWallet />
        </div>
      </nav>

      {/* 主内容区域 */}
      <div style={{ paddingTop: '70px', minHeight: 'calc(100vh - 70px)' }}>
        {currentPage === 'home' && <InvestmentPool />}
        
        {currentPage === 'subscription' && <SubscriptionMarket />}
        
        {currentPage === 'model' && <ModelMarket />}
        
        {currentPage === 'model2' && <ModelMarket2 />}
        
        {currentPage === 'tech' && <TechShowcase />}

        {currentPage === 'risk' && <RiskAssessment />}
        
        {currentPage === 'dispute' && <DisputeArbitration />}
        
        {currentPage === 'credit' && <CreditScore />}
        
        {currentPage === 'agent' && <AgentManager />}
      </div>

      {/* Footer - AINFT Ecosystem Badge */}
      <footer style={{
        background: 'rgba(24, 24, 27, 0.95)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255, 165, 0, 0.2)',
        padding: '32px 20px',
        marginTop: '60px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          {/* Powered by AINFT */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '16px',
            background: 'rgba(255, 165, 0, 0.05)',
            border: '1px solid rgba(255, 165, 0, 0.2)',
            borderRadius: '12px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              🤝
            </div>
            <div>
              <div style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#FFA500',
                marginBottom: '4px'
              }}>
                Powered by AINFT Agent Framework & TRON Ecosystem
              </div>
              <div style={{
                fontSize: '13px',
                color: '#a1a1aa'
              }}>
                MiMiAlpha is built on AINFT MAS Framework and integrates with AINFT Nova for asset tokenization
              </div>
            </div>
          </div>

          {/* Ecosystem Links */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '32px',
            flexWrap: 'wrap'
          }}>
            <a
              href="https://ainft.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#a1a1aa',
                textDecoration: 'none',
                fontSize: '14px',
                transition: 'color 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#FFA500'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#a1a1aa'}
            >
              AINFT Official →
            </a>
            <a
              href="https://tron.network"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#a1a1aa',
                textDecoration: 'none',
                fontSize: '14px',
                transition: 'color 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#FFA500'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#a1a1aa'}
            >
              TRON Network →
            </a>
            <a
              href="https://developers.tron.network"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#a1a1aa',
                textDecoration: 'none',
                fontSize: '14px',
                transition: 'color 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#FFA500'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#a1a1aa'}
            >
              TRON Developers →
            </a>
          </div>

          {/* Copyright */}
          <div style={{
            textAlign: 'center',
            color: '#71717a',
            fontSize: '13px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255, 165, 0, 0.1)'
          }}>
            <p style={{ margin: '0 0 8px 0' }}>
              © 2026 MiMiAlpha. TRON AI 生态的财务治理层.
            </p>
            <p style={{ margin: 0, fontSize: '12px' }}>
              官方提供基建，我们提供治理 · 智能互联网的最后一块拼图
            </p>
          </div>
        </div>
      </footer>

      {/* AI Assistant 弹窗 */}
      <PopupAssistant 
        isOpen={isAssistantOpen} 
        onClose={() => setIsAssistantOpen(false)} 
      />
    </div>
  );
}

function App() {
  return (
    <WagmiProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </WagmiProvider>
  )
}

export default App;
