"""
连接测试脚本 - 诊断服务器连接问题
"""
import requests
import socket
import sys

def test_local_port(port):
    """测试本地端口是否被占用"""
    print(f"\n{'='*60}")
    print(f"测试本地端口 {port}")
    print('='*60)
    
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = sock.connect_ex(('127.0.0.1', port))
    sock.close()
    
    if result == 0:
        print(f"✅ 端口 {port} 在本地可访问")
        return True
    else:
        print(f"❌ 端口 {port} 在本地不可访问")
        return False

def test_external_access(ip, port):
    """测试外部访问"""
    print(f"\n{'='*60}")
    print(f"测试外部访问 {ip}:{port}")
    print('='*60)
    
    try:
        url = f"http://{ip}:{port}/health"
        print(f"请求: {url}")
        response = requests.get(url, timeout=5)
        print(f"✅ 外部访问成功")
        print(f"状态码: {response.status_code}")
        print(f"响应: {response.text[:200]}")
        return True
    except requests.exceptions.Timeout:
        print(f"❌ 连接超时 - 可能是防火墙阻止")
        return False
    except requests.exceptions.ConnectionError as e:
        print(f"❌ 连接错误: {e}")
        return False
    except Exception as e:
        print(f"❌ 其他错误: {e}")
        return False

def check_listening_address():
    """检查服务监听地址"""
    print(f"\n{'='*60}")
    print("检查服务监听地址")
    print('='*60)
    print("请在服务器上运行以下命令检查:")
    print("  Linux: netstat -tlnp | grep ':8000'")
    print("  或者: ss -tlnp | grep ':8000'")
    print("\n如果看到 0.0.0.0:8000 或 :::8000 说明监听正确")
    print("如果看到 127.0.0.1:8000 说明只监听本地，需要改成 0.0.0.0")

if __name__ == "__main__":
    print("="*60)
    print("🔍 服务器连接诊断工具")
    print("="*60)
    
    # 测试配置
    SERVER_IP = "172.28.109.217"
    PORTS = [8000, 5003, 5004, 8006]
    
    print(f"\n目标服务器: {SERVER_IP}")
    print(f"测试端口: {', '.join(map(str, PORTS))}")
    
    # 如果在服务器上运行，测试本地端口
    if len(sys.argv) > 1 and sys.argv[1] == "--local":
        print("\n本地测试模式")
        for port in PORTS:
            test_local_port(port)
    else:
        # 测试外部访问
        print("\n外部访问测试模式")
        for port in PORTS:
            test_external_access(SERVER_IP, port)
    
    # 显示诊断建议
    check_listening_address()
    
    print("\n" + "="*60)
    print("📋 诊断建议")
    print("="*60)
    print("""
1. 确认服务正在运行:
   ps aux | grep python
   
2. 确认服务监听在 0.0.0.0:
   netstat -tlnp | grep python
   
3. 确认阿里云安全组已开放端口:
   - 登录阿里云控制台
   - 进入 ECS 实例
   - 安全组 -> 配置规则
   - 添加入方向规则: TCP 8000/5003/5004/8006
   
4. 确认宝塔防火墙已开放端口:
   - 宝塔面板 -> 安全
   - 添加端口规则
   
5. 测试端口连通性:
   telnet 172.28.109.217 8000
   或
   curl http://172.28.109.217:8000/health
   
6. 检查服务器系统防火墙:
   # CentOS/RHEL
   firewall-cmd --list-ports
   firewall-cmd --add-port=8000/tcp --permanent
   firewall-cmd --reload
   
   # Ubuntu/Debian
   ufw status
   ufw allow 8000/tcp
""")
