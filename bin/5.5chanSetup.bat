@setlocal EnableDelayedExpansion
@echo off

:setDir

set /p libDir= What directory would you like to store the libraries in(Do not put slash at end)?^


set /p confirmedLibDir= Are you sure, %libDir% is the directory you want to store the libraries in? Type yes or no.^

 
if "%confirmedLibDir%"=="yes" goto dirCheck else goto setDir

:dirCheck

if exist %libDir% (goto dwnLibs) else (echo This directory is not a valid directory & goto setDir)

:dwnLibs

powershell -command "wget https://nodejs.org/dist/v6.11.4/node-v6.11.4-win-x86.zip -O '%libDir%/node.zip'"
powershell -command "wget https://fastdl.mongodb.org/win32/mongodb-win32-x86_64-3.0.5.zip -O '%libDir%/mongodb.zip'"
powershell -command "wget https://github.com/ServiceStack/redis-windows/raw/master/downloads/redis-latest.zip -O '%libDir%/redis.zip'"
powershell -command "wget https://github.com/Draconitix/5.5chan/raw/master/wikiDist/pg_Running-5.5chan-on-your-machine/Console-2.00b148-Beta_32bit.zip -O '%libDir%/console.zip'"
powershell -command "wget https://github.com/git-for-windows/git/releases/download/v2.14.2.windows.2/Git-2.14.2.2-64-bit.exe -O '%libDir%/Git-2.14.2.2-64-bit.exe'"

"C:/Program Files/7-Zip/7z.exe" x "%libDir%/node.zip" -o"%libDir%/"
"C:/Program Files/7-Zip/7z.exe" x "%libDir%/mongodb.zip" -o"%libDir%/"
"C:/Program Files/7-Zip/7z.exe" x "%libDir%/redis.zip" -o"%libDir%/redis/"
"C:/Program Files/7-Zip/7z.exe" x "%libDir%/console.zip" -o"%libDir%/"

"%libDir%/Git-2.14.2.2-64-bit.exe"

cd "%libDir%"

del "*.zip"
del "Git-2.14.2.2-64-bit.exe"

setx PATH "%libDir%\redis;%libDir%\node-v6.11.4-win-x86;%libDir%\node-v6.11.4-win-x86\node_modules\;%libDir%\mongodb-win32-x86_64-3.0.5\bin\;%libDir%\Console2\;C:\Users\%username%\AppData\Local\Programs\Git\"

echo Everything is ready to go. Just open a new cmd window before using the libraries. The new path doesnt apply to the current cmd session you are in(a.k.a this window)
