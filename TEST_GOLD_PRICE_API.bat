@echo off
echo ========================================
echo 测试真实黄金价格 API
echo ========================================
echo.

echo [1/3] 测试 Yahoo Finance API...
curl -s "https://query1.finance.yahoo.com/v8/finance/chart/GC=F" > temp_yahoo.json
echo 完成！
echo.

echo [2/3] 测试 CoinGecko API (PAXG)...
curl -s "https://api.coingecko.com/api/v3/simple/price?ids=pax-gold&vs_currencies=usd&include_24hr_change=true" > temp_coingecko.json
echo 完成！
echo.

echo [3/3] 测试 Metals API...
curl -s "https://api.metals.live/v1/spot/gold" > temp_metals.json
echo 完成！
echo.

echo ========================================
echo API 测试结果
echo ========================================
echo.

echo Yahoo Finance 响应:
type temp_yahoo.json | findstr "regularMarketPrice"
echo.

echo CoinGecko 响应:
type temp_coingecko.json
echo.

echo Metals API 响应:
type temp_metals.json
echo.

echo ========================================
echo 清理临时文件...
del temp_yahoo.json temp_coingecko.json temp_metals.json 2>nul
echo.

echo 测试完成！
echo.
echo 如果看到价格数据，说明 API 正常工作。
echo 如果没有数据，请检查网络连接。
echo.
pause
