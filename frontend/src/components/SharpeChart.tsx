import { useState } from 'react';
import './SharpeChart.css';

interface DataPoint {
  volatility: number;
  sharpe: number;
  verified: boolean;
  hash?: string;
}

interface SharpeChartProps {
  modelName: string;
  modelId: string;
}

export function SharpeChart({ modelName, modelId }: SharpeChartProps) {
  const [selectedPoint, setSelectedPoint] = useState<DataPoint | null>(null);
  const [timeRange, setTimeRange] = useState<'1M' | '3M' | '6M' | '1Y'>('3M');

  // 模拟不同波动率下的夏普比率数据
  const dataPoints: DataPoint[] = [
    { volatility: 5, sharpe: 1.2, verified: true, hash: '0x7a8f...' },
    { volatility: 10, sharpe: 1.8, verified: true, hash: '0x9b2c...' },
    { volatility: 15, sharpe: 2.3, verified: true, hash: '0x4d5e...' },
    { volatility: 20, sharpe: 2.5, verified: true, hash: '0x1f6a...' },
    { volatility: 25, sharpe: 2.4, verified: true, hash: '0x8c3b...' },
    { volatility: 30, sharpe: 2.1, verified: true, hash: '0x5e9d...' },
    { volatility: 35, sharpe: 1.7, verified: true, hash: '0x2a4f...' },
    { volatility: 40, sharpe: 1.3, verified: false },
  ];

  // 计算图表尺寸
  const chartWidth = 600;
  const chartHeight = 300;
  const padding = 40;

  const maxVolatility = Math.max(...dataPoints.map(d => d.volatility));
  const maxSharpe = Math.max(...dataPoints.map(d => d.sharpe));

  const scaleX = (vol: number) => padding + (vol / maxVolatility) * (chartWidth - 2 * padding);
  const scaleY = (sharpe: number) => chartHeight - padding - (sharpe / maxSharpe) * (chartHeight - 2 * padding);

  // 生成路径
  const pathData = dataPoints
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(d.volatility)} ${scaleY(d.sharpe)}`)
    .join(' ');

  // 生成填充区域
  const areaData = `${pathData} L ${scaleX(dataPoints[dataPoints.length - 1].volatility)} ${chartHeight - padding} L ${scaleX(dataPoints[0].volatility)} ${chartHeight - padding} Z`;

  return (
    <div className="sharpe-chart">
      <div className="chart-header">
        <div className="chart-title">
          <h3>📈 夏普比率动态曲线</h3>
          <span className="model-name">{modelName}</span>
        </div>
        <div className="time-range-selector">
          {(['1M', '3M', '6M', '1Y'] as const).map(range => (
            <button
              key={range}
              className={`range-btn ${timeRange === range ? 'active' : ''}`}
              onClick={() => setTimeRange(range)}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="chart-container">
        <svg 
          width={chartWidth} 
          height={chartHeight}
          className="chart-svg"
        >
          {/* 网格线 */}
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width={chartWidth} height={chartHeight} fill="url(#grid)" />

          {/* Y 轴刻度 */}
          {[0, 0.5, 1.0, 1.5, 2.0, 2.5].map(val => (
            <g key={val}>
              <line
                x1={padding}
                y1={scaleY(val)}
                x2={chartWidth - padding}
                y2={scaleY(val)}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
                strokeDasharray="4,4"
              />
              <text
                x={padding - 10}
                y={scaleY(val) + 5}
                fill="#a1a1aa"
                fontSize="12"
                textAnchor="end"
              >
                {val.toFixed(1)}
              </text>
            </g>
          ))}

          {/* X 轴刻度 */}
          {[0, 10, 20, 30, 40].map(val => (
            <g key={val}>
              <line
                x1={scaleX(val)}
                y1={padding}
                x2={scaleX(val)}
                y2={chartHeight - padding}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
                strokeDasharray="4,4"
              />
              <text
                x={scaleX(val)}
                y={chartHeight - padding + 20}
                fill="#a1a1aa"
                fontSize="12"
                textAnchor="middle"
              >
                {val}%
              </text>
            </g>
          ))}

          {/* 填充区域 */}
          <path
            d={areaData}
            fill="url(#gradient)"
            opacity="0.3"
          />

          {/* 渐变定义 */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFA500" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFA500" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* 曲线 */}
          <path
            d={pathData}
            fill="none"
            stroke="#FFA500"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 数据点 */}
          {dataPoints.map((point, idx) => (
            <g key={idx}>
              <circle
                cx={scaleX(point.volatility)}
                cy={scaleY(point.sharpe)}
                r="6"
                fill={point.verified ? '#10b981' : '#6b7280'}
                stroke="#fff"
                strokeWidth="2"
                className="data-point"
                onMouseEnter={() => setSelectedPoint(point)}
                onMouseLeave={() => setSelectedPoint(null)}
                style={{ cursor: 'pointer' }}
              />
              {point.verified && (
                <text
                  x={scaleX(point.volatility)}
                  y={scaleY(point.sharpe) - 15}
                  fill="#10b981"
                  fontSize="16"
                  textAnchor="middle"
                >
                  ✓
                </text>
              )}
            </g>
          ))}

          {/* 轴标签 */}
          <text
            x={chartWidth / 2}
            y={chartHeight - 5}
            fill="#d4d4d8"
            fontSize="14"
            textAnchor="middle"
            fontWeight="600"
          >
            波动率 (Volatility %)
          </text>
          <text
            x={15}
            y={chartHeight / 2}
            fill="#d4d4d8"
            fontSize="14"
            textAnchor="middle"
            fontWeight="600"
            transform={`rotate(-90, 15, ${chartHeight / 2})`}
          >
            夏普比率 (Sharpe Ratio)
          </text>
        </svg>

        {/* 悬停提示 */}
        {selectedPoint && (
          <div className="chart-tooltip">
            <div className="tooltip-row">
              <span className="tooltip-label">波动率:</span>
              <span className="tooltip-value">{selectedPoint.volatility}%</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">夏普比率:</span>
              <span className="tooltip-value">{selectedPoint.sharpe.toFixed(2)}</span>
            </div>
            {selectedPoint.verified && (
              <>
                <div className="tooltip-divider"></div>
                <div className="tooltip-row">
                  <span className="tooltip-label">链上验证:</span>
                  <span className="tooltip-verified">✓ 已验证</span>
                </div>
                <div className="tooltip-row">
                  <span className="tooltip-label">Hash:</span>
                  <span className="tooltip-hash">{selectedPoint.hash}</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="chart-legend">
        <div className="legend-item">
          <div className="legend-dot verified"></div>
          <span>链上已验证</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot unverified"></div>
          <span>待验证</span>
        </div>
        <div className="legend-info">
          <span className="info-icon">ℹ️</span>
          <span>所有验证数据均记录在 TRON 链上，不可篡改</span>
        </div>
      </div>

      <div className="chart-stats">
        <div className="stat-card">
          <div className="stat-label">平均夏普比率</div>
          <div className="stat-value">2.08</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">最优波动率区间</div>
          <div className="stat-value">15-25%</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">链上验证率</div>
          <div className="stat-value">87.5%</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">数据点数量</div>
          <div className="stat-value">{dataPoints.length}</div>
        </div>
      </div>
    </div>
  );
}
