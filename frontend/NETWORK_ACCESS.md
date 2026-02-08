# 🌐 局域网访问配置

## ✅ 配置完成

已将 `package.json` 中的 `dev` 脚本更新为：
```json
"dev": "vite --host"
```

---

## 🚀 如何使用

### 1. 重启开发服务器

如果服务器正在运行，需要先停止（Ctrl+C），然后重新启动：

```bash
cd Hackathon/frontend
npm run dev
```

### 2. 查看网络地址

启动后会看到类似这样的输出：

```
  VITE v7.2.4  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.100:5173/
  ➜  press h + enter to show help
```

---

## 📱 访问方式

### 本机访问
```
http://localhost:5173/
```

### 局域网内其他设备访问
```
http://192.168.1.100:5173/
```
（将 IP 地址替换为你实际看到的 Network 地址）

---

## 🔧 其他配置方法

### 方法 1: 使用 --host 参数（已配置）✅
```bash
npm run dev
```

### 方法 2: 临时使用（不修改 package.json）
```bash
vite --host
```

### 方法 3: 指定特定 IP
```bash
vite --host 0.0.0.0
```

### 方法 4: 指定端口
```bash
vite --host --port 3000
```

---

## 📋 使用场景

### 1. 手机测试
- 在手机浏览器输入 Network 地址
- 测试移动端适配
- 测试钱包连接（OKX 移动端）

### 2. 团队演示
- 团队成员在同一局域网
- 直接访问你的开发服务器
- 实时查看最新更新

### 3. 多设备测试
- 同时在多个设备上测试
- 验证响应式设计
- 测试不同浏览器兼容性

---

## 🔒 安全提示

### 注意事项
1. ⚠️ 只在可信任的局域网使用
2. ⚠️ 不要在公共 WiFi 上暴露开发服务器
3. ⚠️ 生产环境不要使用 `--host`

### 防火墙设置
如果无法访问，可能需要：
1. 检查防火墙设置
2. 允许端口 5173 的入站连接
3. 确保设备在同一局域网

---

## 🎯 常见问题

### Q1: Network 地址不显示？
**A**: 确保使用了 `--host` 参数，重启服务器

### Q2: 手机无法访问？
**A**: 检查：
- 手机和电脑在同一 WiFi
- 防火墙是否允许
- IP 地址是否正确

### Q3: 显示多个 Network 地址？
**A**: 选择以 `192.168.x.x` 开头的地址（局域网地址）

### Q4: 如何找到本机 IP？

**Windows**:
```bash
ipconfig
```
查找 "IPv4 地址"

**Mac/Linux**:
```bash
ifconfig
# 或
ip addr show
```

---

## 📱 移动端测试步骤

### 1. 启动服务器
```bash
cd Hackathon/frontend
npm run dev
```

### 2. 记录 Network 地址
```
➜  Network: http://192.168.1.100:5173/
```

### 3. 手机连接同一 WiFi

### 4. 手机浏览器输入地址
```
http://192.168.1.100:5173/
```

### 5. 测试功能
- 查看页面显示
- 测试钱包连接
- 测试合约交互

---

## 🎨 演示场景

### 场景 1: 团队演示
```
1. 启动开发服务器
2. 告诉团队成员 Network 地址
3. 团队成员在浏览器输入地址
4. 实时演示最新功能
```

### 场景 2: 客户展示
```
1. 确保客户设备连接同一 WiFi
2. 提供 Network 地址
3. 客户在自己设备上查看
4. 实时收集反馈
```

### 场景 3: 跨设备测试
```
1. 电脑、平板、手机同时访问
2. 测试响应式布局
3. 验证功能一致性
4. 发现设备特定问题
```

---

## 🔧 高级配置

### vite.config.ts 配置（可选）

如果需要更多控制，可以创建或修改 `vite.config.ts`：

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 或 '0.0.0.0'
    port: 5173,
    strictPort: false,
    open: true, // 自动打开浏览器
  }
})
```

### 指定特定网络接口
```typescript
server: {
  host: '192.168.1.100', // 指定特定 IP
  port: 5173
}
```

---

## 📊 性能提示

### 局域网访问速度
- ✅ 通常很快（局域网带宽高）
- ✅ 延迟低（同一网络）
- ⚠️ 受 WiFi 信号影响

### 优化建议
1. 使用 5GHz WiFi（更快）
2. 减少网络设备数量
3. 靠近路由器

---

## 🎉 总结

### 已完成配置
- ✅ 修改 `package.json` 添加 `--host`
- ✅ 支持局域网访问
- ✅ 可以在手机、平板等设备访问

### 下一步
1. 重启开发服务器
2. 记录 Network 地址
3. 在其他设备访问
4. 开始测试和演示

---

**现在重启服务器，就能看到 Network 地址了！** 🎉

```bash
# 停止当前服务器（Ctrl+C）
# 然后重新启动
npm run dev
```

