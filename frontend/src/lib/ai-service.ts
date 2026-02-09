/**
 * AI 助手服务模块
 * 前端直接调用 OpenAI API
 */
import { chatWithAI } from '../services/openaiService';

/**
 * AI 聊天消息接口
 */
export interface AIMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

/**
 * 发送消息到 AI 助手
 */
export async function sendAIMessage(
  userMessage: string,
  conversationHistory: AIMessage[] = []
): Promise<string> {
  return await chatWithAI(userMessage, conversationHistory);
}

/**
 * 流式发送消息到 AI 助手（模拟流式效果）
 */
export async function sendAIMessageStream(
  userMessage: string,
  conversationHistory: AIMessage[] = [],
  onChunk: (chunk: string) => void
): Promise<string> {
  const fullResponse = await chatWithAI(userMessage, conversationHistory);
  
  // 模拟流式输出效果
  const words = fullResponse.split('');
  let currentText = '';
  
  for (const char of words) {
    currentText += char;
    onChunk(char);
    // 添加小延迟以模拟流式效果
    await new Promise(resolve => setTimeout(resolve, 20));
  }
  
  return fullResponse;
}

/**
 * 检查 AI 服务是否可用
 */
export async function checkAIServiceHealth(): Promise<boolean> {
  return true; // 前端服务始终可用
}

// 导出默认函数
export default {
  sendMessage: sendAIMessage,
  sendMessageStream: sendAIMessageStream,
  checkHealth: checkAIServiceHealth
};
