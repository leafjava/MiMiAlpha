// 钱包调试工具

export function debugWalletDetection() {
  console.log('=== 🔍 钱包检测调试 ===');
  
  // 检查 window 对象
  console.log('1. window.tronWeb:', window.tronWeb);
  console.log('2. window.tronLink:', window.tronLink);
  console.log('3. window.okxwallet:', (window as any).okxwallet);
  
  // 检查 OKX 钱包的各种可能注入方式
  const okxChecks = {
    'window.okxwallet': !!(window as any).okxwallet,
    'window.okxwallet.tronLink': !!(window as any).okxwallet?.tronLink,
    'window.okxwallet.tronLink.tronWeb': !!(window as any).okxwallet?.tronLink?.tronWeb,
    'window.okxwallet.tronLink.ready': !!(window as any).okxwallet?.tronLink?.ready,
    'window.okxTronWeb': !!(window as any).okxTronWeb,
  };
  
  console.log('4. OKX 钱包检测结果:', okxChecks);
  
  // 检查 TronLink
  const tronLinkChecks = {
    'window.tronWeb': !!window.tronWeb,
    'window.tronWeb.ready': !!(window.tronWeb as any)?.ready,
    'window.tronLink': !!window.tronLink,
  };
  
  console.log('5. TronLink 检测结果:', tronLinkChecks);
  
  // 检查所有可能的 TRON 相关对象
  const allTronKeys = Object.keys(window).filter(key => 
    key.toLowerCase().includes('tron') || 
    key.toLowerCase().includes('okx')
  );
  
  console.log('6. 所有 TRON/OKX 相关的 window 属性:', allTronKeys);
  
  // 总结
  let walletType = 'none';
  if ((window as any).okxwallet?.tronLink) {
    walletType = 'OKX Wallet';
  } else if (window.tronWeb) {
    walletType = 'TronLink';
  }
  
  console.log('7. 检测到的钱包类型:', walletType);
  console.log('=== 检测完成 ===');
  
  return {
    okxChecks,
    tronLinkChecks,
    allTronKeys,
    walletType
  };
}

// 在浏览器控制台可以直接调用
if (typeof window !== 'undefined') {
  (window as any).debugWallet = debugWalletDetection;
}
