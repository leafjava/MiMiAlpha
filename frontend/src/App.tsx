import { useState } from 'react';
import { AppProvider } from './AppContext';
import { ConnectWallet } from './components/ConnectWallet';
import { TradeCreator } from './components/TradeCreator';
import { TradeList } from './components/TradeList';
import { Faucet } from './components/Faucet';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { PopupAssistant } from './components/PopupAssistant';
import { LandingPage } from './components/LandingPage';
import { RiskAssessment } from './components/RiskAssessment';
import { DisputeArbitration } from './components/DisputeArbitration';
import { CreditScore } from './components/CreditScore';
import { InvestmentPool } from './components/InvestmentPool';
import { Marketplace } from './components/Marketplace';
import { FacilitatorXHome } from './components/FacilitatorXHome';
import { SubscriptionMarket } from './components/SubscriptionMarket';
import { ModelMarket } from './components/ModelMarket';
import { TechShowcase } from './components/TechShowcase';
import { Logo } from './components/Logo';
import { useTranslation } from 'react-i18next';
import './index.css';

type Page = 'home' | 'subscription' | 'model' | 'tech' | 'pool' | 'market' | 'risk' | 'dispute' | 'credit';

function AppContent() {
  const { t } = useTranslation();
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('home');

  // Show FacilitatorX landing page first
  if (showLanding) {
    return <FacilitatorXHome onEnter={() => setShowLanding(false)} />;
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
          }} onClick={() => setShowLanding(true)}>
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
              onClick={() => setCurrentPage('subscription')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: 'none',
                background: currentPage === 'subscription' ? 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)' : 'transparent',
                color: currentPage === 'subscription' ? '#fff' : '#a1a1aa',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              🔄 订阅共享
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
            
            <button
              onClick={() => setCurrentPage('credit')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: 'none',
                background: currentPage === 'credit' ? 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)' : 'transparent',
                color: currentPage === 'credit' ? '#fff' : '#a1a1aa',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              🏆 信用评分
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
      <div style={{ paddingTop: '70px' }}>
        {currentPage === 'home' && <InvestmentPool />}
        
        {currentPage === 'subscription' && <SubscriptionMarket />}
        
        {currentPage === 'model' && <ModelMarket />}
        
        {currentPage === 'tech' && <TechShowcase />}

        {currentPage === 'risk' && <RiskAssessment />}
        
        {currentPage === 'dispute' && <DisputeArbitration />}
        
        {currentPage === 'credit' && <CreditScore />}
      </div>

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
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

export default App;
