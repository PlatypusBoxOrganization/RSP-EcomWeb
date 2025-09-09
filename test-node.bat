@echo off
echo Testing Node.js...
node --version > node-version.txt 2>&1
type node-version.txt
del node-version.txt
