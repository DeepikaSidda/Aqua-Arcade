# AWS S3 Deployment Script for Underwater Fish Game
# Replace YOUR-BUCKET-NAME with your actual bucket name

param(
    [string]$BucketName = "YOUR-BUCKET-NAME",
    [string]$Region = "us-east-1"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AWS S3 Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if AWS CLI is installed
Write-Host "Checking AWS CLI..." -ForegroundColor Yellow
$awsVersion = aws --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: AWS CLI not found!" -ForegroundColor Red
    Write-Host "Please install from: https://aws.amazon.com/cli/" -ForegroundColor Yellow
    exit 1
}
Write-Host "AWS CLI found: $awsVersion" -ForegroundColor Green
Write-Host ""

# Check if bucket name is set
if ($BucketName -eq "YOUR-BUCKET-NAME") {
    Write-Host "ERROR: Please set your bucket name!" -ForegroundColor Red
    Write-Host "Edit this script and replace YOUR-BUCKET-NAME with your bucket name" -ForegroundColor Yellow
    Write-Host "Or run: .\deploy-to-s3.ps1 -BucketName 'your-bucket-name'" -ForegroundColor Yellow
    exit 1
}

# Build the game
Write-Host "Building game..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "Build successful!" -ForegroundColor Green
Write-Host ""

# Check if bucket exists
Write-Host "Checking if bucket exists..." -ForegroundColor Yellow
aws s3 ls s3://$BucketName 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Bucket doesn't exist. Creating..." -ForegroundColor Yellow
    aws s3 mb s3://$BucketName --region $Region
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to create bucket!" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "Bucket created!" -ForegroundColor Green
    
    # Enable static website hosting
    Write-Host "Enabling static website hosting..." -ForegroundColor Yellow
    aws s3 website s3://$BucketName --index-document index.html --error-document index.html
    
    # Apply bucket policy
    Write-Host "Setting bucket policy..." -ForegroundColor Yellow
    $policy = @"
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$BucketName/*"
    }
  ]
}
"@
    $policy | Out-File -FilePath "temp-policy.json" -Encoding utf8
    aws s3api put-bucket-policy --bucket $BucketName --policy file://temp-policy.json
    Remove-Item "temp-policy.json"
    
    Write-Host "Bucket configured!" -ForegroundColor Green
}
Write-Host ""

# Upload files
Write-Host "Uploading files to S3..." -ForegroundColor Yellow
aws s3 sync dist/ s3://$BucketName --delete --acl public-read

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Upload failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Deployment Successful!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your game is now live at:" -ForegroundColor Cyan
Write-Host "http://$BucketName.s3-website-$Region.amazonaws.com" -ForegroundColor Yellow
Write-Host ""
Write-Host "Share this link with anyone!" -ForegroundColor Green
Write-Host ""
