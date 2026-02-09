# 🚀 最终部署步骤

## ✅ 当前状态

- **服务器公网 IP**: `47.93.166.48`
- **DNS 配置**: 
  - ✅ `api.leaf666.icu` → `47.93.166.48` (已生效)
  - ⚠️ `mimialpha.leaf666.icu` → `cname.vercel-dns.com` (需要在 DNS 管理界面修改)
- **代码**: 所有 API 文件已更新为正确的 IP

---

## 📋 需要完成的步骤

### 步骤 1：修正 DNS 配置 ⚠️

**问题**: 你在 DNS 管理界面配置的 A 记录 IP 是 `47.21.16.48`，但实际应该是 `47.93.166.48`

**解决方案**:
1. 回到域名管理界面（你刚才截图的那个页面）
2. 找到主机记录为 `api` 的 A 记录
3. 把记录值从 `47.21.16.48` 改为 `47.93.166.48`
4. 保存

**正确的配置应该是**:
```
类型: A
主机记录: api
记录值: 47.93.166.48  ← 改成这个
TTL: 600
```

---

### 步骤 2：宝塔面板配置 SSL

#### 2.1 添加网站

1. 登录宝塔面板
2. 点击 **"网站"** → **"添加站点"**
3. 填写：
   - 域名: `api.leaf666.icu`
   - 根目录: `/www/wwwroot/mimialpha-api`
   - PHP 版本: 纯静态

#### 2.2 申请 SSL 证书

1. 点击网站 → **"设置"** → **"SSL"**
2. 选择 **"Let's Encrypt"**
3. 勾选 `api.leaf666.icu`
4. 点击 **"申请"**
5. 开启 **"强制 HTTPS"**

#### 2.3 配置反向代理

点击 **"反向代理"** → **"添加反向代理"**

**配置 1 - AI 助手**:
```
代理名称: ai-chat
目标URL: http://127.0.0.1:8000
发送域名: $host
```

**配置 2 - 风险评估**:
```
代理名称: risk-assess
目标URL: http://127.0.0.1:5003
发送域名: $host
```

**配置 3 - 争议仲裁**:
```
代理名称: dispute
目标URL: http://127.0.0.1:5004
发送域名: $host
```

**配置 4 - 支付治理**:
```
代理名称: governance
目标URL: http://127.0.0.1:8006
发送域名: $host
```

**配置 5 - 收益计算**:
```
代理名称: yield
目标URL: http://127.0.0.1:8005
发送域名: $host
```

或者直接编辑 Nginx 配置文件（推荐）：

```nginx
server {
    listen 80;
    listen 443 ssl http2;
    server_name api.leaf666.icu;
    
    # SSL 证书路径（宝塔自动配置）
    ssl_certificate /www/server/panel/vhost/cert/api.leaf666.icu/fullchain.pem;
    ssl_certificate_key /www/server/panel/vhost/cert/api.leaf666.icu/privkey.pem;
    
    # 强制 HTTPS
    if ($server_port !~ 443){
        rewrite ^(/.*)$ https://$host$1 permanent;
    }
    
    # CORS
    add_header Access-Control-Allow-Origin * always;
    add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS' always;
    add_header Access-Control-Allow-Headers 'Content-Type' always;
    
    if ($request_method = 'OPTIONS') {
        return 204;
    }
    
    # AI 助手
    location /api/chat {
        proxy_pass http://127.0.0.1:8000/v1/assistant/chat;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_connect_timeout 300s;
        proxy_read_timeout 300s;
    }
    
    # 风险评估
    location /api/risk {
        proxy_pass http://127.0.0.1:5003/api/risk;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # 争议仲裁
    location /api/dispute {
        proxy_pass http://127.0.0.1:5004/api/dispute;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # 支付治理
    location /api/governance {
        proxy_pass http://127.0.0.1:8006/api/governance;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # 收益计算
    location /api/yield {
        proxy_pass http://127.0.0.1:8005/api/yield;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # 健康检查
    location /health {
        proxy_pass http://127.0.0.1:8000/health;
        proxy_set_header Host $host;
    }
}
```

---

### 步骤 3：Vercel 配置自定义域名

1. 访问 https://vercel.com
2. 进入项目 → **Settings** → **Domains**
3. 添加域名: `mimialpha.leaf666.icu`
4. 等待验证通过

---

### 步骤 4：部署代码

```bash
cd Hackathon

# 提交所有更改
git add .
git commit -m "配置 leaf666.icu 域名，修正 IP 地址为 47.93.166.48"
git push origin main
```

Vercel 会自动重新部署（2-3 分钟）。

---

## 🧪 测试部署

### 1. 测试 DNS

```cmd
nslookup api.leaf666.icu
# 应该返回: 47.93.166.48

nslookup mimialpha.leaf666.icu
# 应该返回: Vercel 的 IP
```

### 2. 测试 API（HTTP，宝塔配置 SSL 前）

```bash
curl http://47.93.166.48:8000/health
```

### 3. 测试 API（HTTPS，宝塔配置 SSL 后）

```bash
curl https://api.leaf666.icu/health
curl https://api.leaf666.icu/api/chat -X POST -H "Content-Type: application/json" -d '{"messages":[{"role":"user","content":"你好"}]}'
```

### 4. 测试前端

访问: `https://mimialpha.leaf666.icu`

打开浏览器控制台（F12），确认：
- ✅ 所有请求都是 HTTPS
- ✅ 没有 Mixed Content 错误
- ✅ API 调用成功

---

## 📊 完整架构

```
用户浏览器
    ↓ HTTPS
Vercel (mimialpha.leaf666.icu)
    ↓ HTTPS
Nginx (api.leaf666.icu) + SSL
    ↓ HTTP (内部)
后端服务 (47.93.166.48:8000/5003/5004/5005/8006)
```

---

## ✅ 完成检查清单

- [ ] DNS A 记录改为 `47.93.166.48`
- [ ] DNS 生效（5-10 分钟）
- [ ] 宝塔面板添加网站 `api.leaf666.icu`
- [ ] 宝塔申请 SSL 证书
- [ ] 宝塔配置反向代理
- [ ] Vercel 添加域名 `mimialpha.leaf666.icu`
- [ ] 代码提交并推送
- [ ] 测试 API HTTPS 访问
- [ ] 测试前端访问
- [ ] 确认无 Mixed Content 错误

---

## 🎯 当前优先级

**最重要的是先完成步骤 1 和 2：**

1. ✅ 修正 DNS 配置（改为 47.93.166.48）
2. ✅ 宝塔面板配置 SSL

完成这两步后，Mixed Content 错误就解决了！

---

## 🆘 需要帮助？

如果遇到问题：
1. 宝塔 SSL 申请失败 → 检查 DNS 是否生效，80 端口是否开放
2. Nginx 配置错误 → 查看错误日志 `/www/wwwlogs/api.leaf666.icu.error.log`
3. API 无法访问 → 检查后端服务是否运行 `ps aux | grep python`

告诉我进展，我继续帮你！
