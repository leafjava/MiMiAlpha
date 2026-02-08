@echo off
echo 正在添加防火墙规则允许端口 5173...
netsh advfirewall firewall add rule name="Vite Dev Server" dir=in action=allow protocol=TCP localport=5173
echo 完成！现在其他设备应该可以访问了。
pause
