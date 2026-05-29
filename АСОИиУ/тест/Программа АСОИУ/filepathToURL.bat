@ECHO OFF
set FILE_PATH=%1
shift

:: echo %FILE_PATH%
:: set FILE_PATH=%cd%\%FILE_PATH%
:: echo %FILE_PATH%

for /f "delims=" %%R in ("%FILE_PATH%") do set FILE_URL=%%~fR%
set FILE_URL=file:///%FILE_URL%
set FILE_URL=%FILE_URL:///\\=//%
set FILE_URL=%FILE_URL:\=/%
echo %FILE_URL%
