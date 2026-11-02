@echo off
cd /d "%~dp0"
echo LegacyLab: http://127.0.0.1:4173
echo Keep this window open while viewing the local website.
node tools/serve.mjs
