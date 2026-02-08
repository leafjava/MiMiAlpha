import { useState, useEffect, useRef } from 'react';
import './AuditStream.css';

interface AuditLog {
  id: string;
  timestamp: string;
  type: 'intercept' | 'approve' | 'alert' | 'verify';
  category: 'subscription' | 'model' | 'payment' | 'security';
  message: string;
  details?: string;
}

export function AuditStream() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const streamRef = useRef<HTMLDivElement>(null);

  // 模拟实时审计日志
  useEffect(() => {
    if (isPaused) return;

    const mockLogs: Omit<AuditLog, 'id' | 'timestamp'>[] = [
      {
        type: 'intercept',
        category: 'model',
        message: '拦截信号 #104：偏离市场均价 65%',
        details: '已触发自动纠偏，建议价格 $485'
      },
      {
        type: 'approve',
        category: 'subscription',
        message: '批准租赁请求：ChatGPT Plus',
        details: '速率检查通过 (2/3 RPM)，账号安全'
      },
      {
        type: 'alert',
        category: 'payment',
        message: '微支付聚合：50 笔交易已批量结算',
        details: '节省 Energy: 98.2%，Gas 费用: $0.15'
      },
      {
        type: 'verify',
        category: 'model',
        message: '验证信号 #98：金价预测准确',
        details: '误差 2.3%，链上 Hash: 0x7a8f...'
      },
      {
        type: 'intercept',
        category: 'security',
        message: '拦截异常请求：超出速率限制',
        details: '账号 0x1234...5678 已暂停 60 秒'
      },
      {
        type: 'approve',
        category: 'model',
        message: '发布新信号：BTC 趋势预测',
        details: '置信度 82%，已推送给 15 个订阅者'
      },
      {
        type: 'alert',
        category: 'payment',
        message: '大额交易检测：$5,000 模型订阅',
        details: '触发多签验证，等待用户确认'
      },
      {
        type: 'verify',
        category: 'subscription',
        message: '账号健康检查：Claude Pro',
        details: '剩余额度 85%，状态正常'
      },
      {
        type: 'intercept',
        category: 'model',
        message: '拦截低置信度信号：置信度 58%',
        details: '低于阈值 70%，已自动拒绝'
      },
      {
        type: 'approve',
        category: 'payment',
        message: '结算完成：订阅收益 $15.50',
        details: '已转入钱包 0xabcd...ef01'
      }
    ];

    const interval = setInterval(() => {
      const randomLog = mockLogs[Math.floor(Math.random() * mockLogs.length)];
      const newLog: AuditLog = {
        ...randomLog,
        id: `log-${Date.now()}-${Math.random()}`,
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false })
      };

      setLogs(prev => [newLog, ...prev].slice(0, 50)); // 保留最近 50 条
    }, 2000 + Math.random() * 3000); // 2-5 秒随机间隔

    return () => clearInterval(interval);
  }, [isPaused]);

  // 自动滚动到顶部
  useEffect(() => {
    if (streamRef.current && !isPaused) {
      streamRef.current.scrollTop = 0;
    }
  }, [logs, isPaused]);

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'intercept': return '🛡️';
      case 'approve': return '✅';
      case 'alert': return '⚠️';
      case 'verify': return '🔍';
      default: return '📋';
    }
  };

  const getLogColor = (type: string) => {
    switch (type) {
      case 'intercept': return '#ef4444';
      case 'approve': return '#10b981';
      case 'alert': return '#f59e0b';
      case 'verify': return '#3b82f6';
      default: return '#a1a1aa';
    }
  };

  const getCategoryBadge = (category: string) => {
    const badges = {
      subscription: { text: '订阅', color: '#8b5cf6' },
      model: { text: '模型', color: '#ec4899' },
      payment: { text: '支付', color: '#14b8a6' },
      security: { text: '安全', color: '#f97316' }
    };
    return badges[category as keyof typeof badges] || { text: '系统', color: '#6b7280' };
  };

  return (
    <div className="audit-stream">
      <div className="stream-header">
        <div className="header-left">
          <h3>🔴 实时审计流</h3>
          <span className="live-indicator">LIVE</span>
        </div>
        <div className="header-right">
          <button 
            className={`pause-btn ${isPaused ? 'paused' : ''}`}
            onClick={() => setIsPaused(!isPaused)}
          >
            {isPaused ? '▶️ 继续' : '⏸️ 暂停'}
          </button>
          <span className="log-count">{logs.length} 条记录</span>
        </div>
      </div>

      <div className="stream-content" ref={streamRef}>
        {logs.length === 0 ? (
          <div className="stream-empty">
            <div className="loading-spinner"></div>
            <p>等待审计事件...</p>
          </div>
        ) : (
          logs.map(log => {
            const badge = getCategoryBadge(log.category);
            return (
              <div 
                key={log.id} 
                className="log-entry"
                style={{ borderLeftColor: getLogColor(log.type) }}
              >
                <div className="log-header">
                  <span className="log-icon">{getLogIcon(log.type)}</span>
                  <span className="log-timestamp">[{log.timestamp}]</span>
                  <span className="log-label">[FACILITATOR]</span>
                  <span 
                    className="log-category"
                    style={{ backgroundColor: badge.color }}
                  >
                    {badge.text}
                  </span>
                </div>
                <div className="log-message">{log.message}</div>
                {log.details && (
                  <div className="log-details">{log.details}</div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="stream-footer">
        <div className="footer-stats">
          <div className="stat">
            <span className="stat-icon">🛡️</span>
            <span className="stat-text">拦截: {logs.filter(l => l.type === 'intercept').length}</span>
          </div>
          <div className="stat">
            <span className="stat-icon">✅</span>
            <span className="stat-text">批准: {logs.filter(l => l.type === 'approve').length}</span>
          </div>
          <div className="stat">
            <span className="stat-icon">⚠️</span>
            <span className="stat-text">警告: {logs.filter(l => l.type === 'alert').length}</span>
          </div>
          <div className="stat">
            <span className="stat-icon">🔍</span>
            <span className="stat-text">验证: {logs.filter(l => l.type === 'verify').length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
