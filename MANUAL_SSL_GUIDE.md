# 手动申请 SSL 证书指南（FreeSSL.cn）

如果宝塔面板申请证书失败，可以使用这个方法手动申请。

## 🌐 步骤 1：访问 FreeSSL.cn

打开浏览器，访问：https://freessl.cn/

## 📝 步骤 2：输入域名

1. 在首页输入框输入：`api.leaf666.icu`
2. 点击 **"创建免费的SSL证书"**

## 🔐 步骤 3：选择证书类型

1. 选择 **"Let's Encrypt V2"**（免费）
2. 点击 **"创建"**

## ✅ 步骤 4：选择验证方式

选择 **"DNS 验证"**（推荐）

## 📋 步骤 5：添加 DNS 记录

FreeSSL 会显示需要添加的 TXT 记录：

```
类型: TXT
主机记录: _acme-challenge.api
记录值: [FreeSSL 显示的值]
TTL: 600
```

### 5.1 去域名管理添加记录

1. 打开你的域名管理界面
2. 添加上面的 TXT 记录
3. 保存

### 5.2 等待 DNS 生效

等待 2-5 分钟。

### 5.3 验证 DNS 是否生效

在命令行测试：
```cmd
nslookup -type=TXT _acme-challenge.api.leaf666.icu
```

应该能看到你添加的 TXT 记录。

## 📥 步骤 6：点击验证并下载证书

1. 回到 FreeSSL 页面
2. 点击 **"点击验证"**
3. 验证成功后，点击 **"下载证书"**
4. 会下载一个 ZIP 文件

## 📂 步骤 7：解压证书文件

解压后会看到这些文件：
```
fullchain.pem    ← 证书文件
privkey.pem      ← 私钥文件
```

## 📤 步骤 8：上传到宝塔

### 8.1 打开证书文件

用记事本打开这两个文件：
- `fullchain.pem`
- `privkey.pem`

### 8.2 在宝塔中配置

1. 在宝塔网站设置中，点击 **"SSL"** 标签
2. 选择 **"其他证书"** 标签页
3. 粘贴证书内容：

**证书 (PEM格式)** 框：
```
粘贴 fullchain.pem 的全部内容
（从 -----BEGIN CERTIFICATE----- 到 -----END CERTIFICATE-----）
```

**密钥 (KEY)** 框：
```
粘贴 privkey.pem 的全部内容
（从 -----BEGIN PRIVATE KEY----- 到 -----END PRIVATE KEY-----）
```

4. 点击 **"保存"**

## 🔒 步骤 9：开启强制 HTTPS

在 SSL 设置页面：
1. 找到 **"强制 HTTPS"** 开关
2. 打开它

## ✅ 步骤 10：测试 HTTPS

在浏览器访问：
```
https://api.leaf666.icu
```

应该能看到绿色的锁图标，证书配置成功！

---

## 🔄 证书续期

Let's Encrypt 证书有效期 90 天。

### 自动续期（推荐）

在宝塔面板：
1. 点击左侧 **"计划任务"**
2. 添加任务：
   - 任务类型：Shell 脚本
   - 任务名称：续期 SSL 证书
   - 执行周期：每月 1 日
   - 脚本内容：
     ```bash
     /www/server/panel/pyenv/bin/python /www/server/panel/class/acme_v2.py --renew
     ```

### 手动续期

证书到期前 30 天，重复上面的步骤重新申请即可。

---

## 🆘 常见问题

### Q: DNS 验证一直失败？
A: 
1. 确认 TXT 记录已添加
2. 等待更长时间（最多 10 分钟）
3. 清除本地 DNS 缓存：`ipconfig /flushdns`
4. 使用在线工具检查：https://tool.chinaz.com/dns/

### Q: 证书上传后网站无法访问？
A: 
1. 检查证书内容是否完整
2. 确保没有多余的空格或换行
3. 重新下载证书并上传

### Q: 浏览器提示证书不安全？
A: 
1. 检查域名是否匹配
2. 确认证书是否过期
3. 清除浏览器缓存

---

## 📊 完整流程图

```
访问 FreeSSL.cn
    ↓
输入域名 api.leaf666.icu
    ↓
选择 Let's Encrypt V2
    ↓
选择 DNS 验证
    ↓
添加 TXT 记录到域名管理
    ↓
等待 DNS 生效（2-5分钟）
    ↓
点击验证
    ↓
下载证书（fullchain.pem + privkey.pem）
    ↓
在宝塔上传证书
    ↓
开启强制 HTTPS
    ↓
完成！
```

---

## 🎉 完成后

你的 API 就可以通过 HTTPS 访问了：
- `https://api.leaf666.icu`

然后再配置反向代理，让各个服务可以通过不同的路径访问。

---

**这个方法 100% 可行，不需要配置反向代理，不需要开放 80 端口！**
