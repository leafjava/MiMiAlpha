"""
PythonAnywhere WSGI 配置文件
将此文件的内容复制到 PythonAnywhere 的 /var/www/a37615959_pythonanywhere_com_wsgi.py
"""
import sys
import os

# 添加项目路径
project_home = '/home/a37615959/mysite/MiMiAlpha/backend'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# 激活虚拟环境
activate_this = os.path.join(project_home, 'venv/bin/activate_this.py')
if os.path.exists(activate_this):
    with open(activate_this) as f:
        exec(f.read(), {'__file__': activate_this})

# 导入 Flask 应用
from pythonanywhere_gateway import app as application
