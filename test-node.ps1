Write-Host "Testing Node.js..."
$nodeVersion = node --version
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Node.js is installed: $nodeVersion" -ForegroundColor Green
    
    # Try to install Razorpay
    Write-Host "`nInstalling Razorpay..."
    npm install razorpay --no-save
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Razorpay installed successfully" -ForegroundColor Green
        
        # Simple test script
        $testScript = @'
        const Razorpay = require('razorpay');
        console.log('✅ Razorpay module loaded successfully');
        const rzp = new Razorpay({
            key_id: 'rzp_test_RJgQjyW5DIRbPa',
            key_secret: 'iRBFMvfhQ9xDQsCng2ucNuiW'
        });
        console.log('✅ Razorpay instance created successfully');
'@
        
        $testScript | Out-File -FilePath "test-razorpay.js" -Encoding utf8
        node test-razorpay.js
        Remove-Item "test-razorpay.js" -ErrorAction SilentlyContinue
    } else {
        Write-Host "❌ Failed to install Razorpay" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
}
