@@ECHO off

:: Имя html файла, который надо открыть. Имя, а не путь: index.html

SET FILE_NAME="title.html"

::





for /f "delims=" %%a in ('filepathToURL.bat "%cd%\%FILE_NAME%"') do set URL=%%a

echo "Openning %URL% in Chrome"

start chrome "%URL%"
