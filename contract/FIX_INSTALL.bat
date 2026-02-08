@echo off
echo ========================================
echo   修复 npm 依赖冲突
echo ========================================
echo.

echo [1/4] 清理旧的依赖...
if exist "node_modules" (
    echo 删除 node_modules 文件夹...
    rmdir /s /q node_modules
)

if exist "package-lock.json" (
    echo 删除 package-lock.json...
    del /f /q package-lock.json
)

echo [✓] 清理完成
echo.

echo [2/4] 清理 npm 缓存...
call npm cache clean --force
echo [✓] 缓存清理完成
echo.

echo [3/4] 安装依赖（使用 --legacy-peer-deps）...
call npm install --legacy-peer-deps
if errorlevel 1 (
    echo [错误] 安装失败
    echo.
    echo 尝试使用 --force 选项...
    call npm install --force
    if errorlevel 1 (
        echo [错误] 安装仍然失败
        echo.
        echo 请手动运行以下命令之一：
        echo   npm install --legacy-peer-deps
        echo   npm install --force
        pause
        exit /b 1
    )
)
echo [✓] 依赖安装完成
echo.

echo [4/4] 验证安装...
call npx hardhat --version
if errorlevel 1 (
    echo [警告] Hardhat 可能未正确安装
) else (
    echo [✓] Hardhat 安装成功
)
echo.

echo ========================================
echo   修复完成！
echo ========================================
echo.
echo 下一步：
echo   1. 编译合约: npm run compile
echo   2. 运行测试: npm test
echo   3. 启动节点: npm run node
echo.
pause
