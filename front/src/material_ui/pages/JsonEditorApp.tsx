import React, { useState, useRef } from 'react';
import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    Button,
    Paper,
    Grid,
    IconButton,
    Tooltip,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import {
    PlayArrow,
    Replay,
    ContentCopy,
    ClearAll,
    DarkMode,
    LightMode,
} from '@mui/icons-material';
import Editor from '@monaco-editor/react';

// Типы для наших данных
interface JsonEditorData {
    leftJson: string;
    rightJson: string;
}

const JsonEditorApp: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [data, setData] = useState<JsonEditorData>({
        leftJson: '{\n  "name": "John",\n  "age": 30,\n  "city": "New York"\n}',
        rightJson: '{}',
    });

    const [darkMode, setDarkMode] = useState(false);
    const leftEditorRef = useRef<any>(null);
    const rightEditorRef = useRef<any>(null);

    // Функция для валидации JSON
    const isValidJson = (jsonString: string): boolean => {
        try {
            JSON.parse(jsonString);
            return true;
        } catch {
            return false;
        }
    };

    // Конвертация JSON (левая панель -> правая панель)
    const handleConvert = () => {
        if (!isValidJson(data.leftJson)) {
            alert('Invalid JSON in left panel!');
            return;
        }

        try {
            const parsed = JSON.parse(data.leftJson);
            // Пример преобразования - можно заменить на нужную логику
            const converted = {
                ...parsed,
                converted: true,
                timestamp: new Date().toISOString(),
            };

            setData(prev => ({
                ...prev,
                rightJson: JSON.stringify(converted, null, 2),
            }));
        } catch (error) {
            alert('Error converting JSON: ' + (error as Error).message);
        }
    };

    // Деконвертация JSON (правая панель -> левая панель)
    const handleDeconvert = () => {
        if (!isValidJson(data.rightJson)) {
            alert('Invalid JSON in right panel!');
            return;
        }

        try {
            const parsed = JSON.parse(data.rightJson);
            // Пример обратного преобразования
            const { converted, timestamp, ...deconverted } = parsed;

            setData(prev => ({
                ...prev,
                leftJson: JSON.stringify(deconverted, null, 2),
            }));
        } catch (error) {
            alert('Error deconverting JSON: ' + (error as Error).message);
        }
    };

    // Очистка обеих панелей
    const handleClearAll = () => {
        setData({
            leftJson: '{}',
            rightJson: '{}',
        });
    };

    // Копирование из левой панели
    const handleCopyLeft = () => {
        navigator.clipboard.writeText(data.leftJson);
    };

    // Копирование из правой панели
    const handleCopyRight = () => {
        navigator.clipboard.writeText(data.rightJson);
    };

    // Форматирование JSON в левой панели
    const handleFormatLeft = () => {
        if (isValidJson(data.leftJson)) {
            try {
                const formatted = JSON.stringify(JSON.parse(data.leftJson), null, 2);
                setData(prev => ({ ...prev, leftJson: formatted }));
            } catch (error) {
                alert('Error formatting JSON: ' + (error as Error).message);
            }
        }
    };

    // Форматирование JSON в правой панели
    const handleFormatRight = () => {
        if (isValidJson(data.rightJson)) {
            try {
                const formatted = JSON.stringify(JSON.parse(data.rightJson), null, 2);
                setData(prev => ({ ...prev, rightJson: formatted }));
            } catch (error) {
                alert('Error formatting JSON: ' + (error as Error).message);
            }
        }
    };

    // Обработчики изменения редакторов
    const handleLeftEditorChange = (value: string | undefined) => {
        setData(prev => ({ ...prev, leftJson: value || '' }));
    };

    const handleRightEditorChange = (value: string | undefined) => {
        setData(prev => ({ ...prev, rightJson: value || '' }));
    };

    // Получение ссылок на редакторы
    const handleLeftEditorDidMount = (editor: any) => {
        leftEditorRef.current = editor;
    };

    const handleRightEditorDidMount = (editor: any) => {
        rightEditorRef.current = editor;
    };

    return (
        <Box sx={{ flexGrow: 1, height: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Шапка с заголовком и кнопками */}
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        JSON Editor & Converter
                    </Typography>

                    <Tooltip title="Toggle theme">
                        <IconButton
                            color="inherit"
                            onClick={() => setDarkMode(!darkMode)}
                        >
                            {darkMode ? <LightMode /> : <DarkMode />}
                        </IconButton>
                    </Tooltip>

                    <Button
                        color="inherit"
                        startIcon={<ClearAll />}
                        onClick={handleClearAll}
                    >
                        Clear All
                    </Button>
                </Toolbar>
            </AppBar>

            {/* Основной контент */}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: isMobile ? 'column' : 'row', p: 1, gap: 1 }}>
                {/* Левая панель */}
                <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column' }} elevation={3}>
                    <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider', display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                            Input JSON
                        </Typography>
                        <Tooltip title="Format JSON">
                            <Button size="small" onClick={handleFormatLeft}>
                                Format
                            </Button>
                        </Tooltip>
                        <Tooltip title="Copy to clipboard">
                            <IconButton size="small" onClick={handleCopyLeft}>
                                <ContentCopy />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                        <Editor
                            height="100%"
                            defaultLanguage="json"
                            value={data.leftJson}
                            onChange={handleLeftEditorChange}
                            onMount={handleLeftEditorDidMount}
                            theme={darkMode ? 'vs-dark' : 'light'}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                wordWrap: 'on',
                                automaticLayout: true,
                                formatOnPaste: true,
                                formatOnType: true,
                            }}
                        />
                    </Box>
                </Paper>

                {/* Центральная панель с кнопками */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: isMobile ? 'row' : 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 1,
                    minWidth: isMobile ? 'auto' : 120,
                    p: 1
                }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<PlayArrow />}
                        onClick={handleConvert}
                        fullWidth={isMobile}
                        size={isMobile ? 'small' : 'medium'}
                    >
                        Convert
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<Replay />}
                        onClick={handleDeconvert}
                        fullWidth={isMobile}
                        size={isMobile ? 'small' : 'medium'}
                    >
                        Deconvert
                    </Button>
                </Box>

                {/* Правая панель */}
                <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column' }} elevation={3}>
                    <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider', display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                            Output JSON
                        </Typography>
                        <Tooltip title="Format JSON">
                            <Button size="small" onClick={handleFormatRight}>
                                Format
                            </Button>
                        </Tooltip>
                        <Tooltip title="Copy to clipboard">
                            <IconButton size="small" onClick={handleCopyRight}>
                                <ContentCopy />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                        <Editor
                            height="100%"
                            defaultLanguage="xml"
                            value={data.rightJson}
                            onChange={handleRightEditorChange}
                            onMount={handleRightEditorDidMount}
                            theme={darkMode ? 'vs-dark' : 'light'}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                wordWrap: 'on',
                                automaticLayout: true,
                                readOnly: false,
                            }}
                        />
                    </Box>
                </Paper>
            </Box>

            {/* Статус бар */}
            <Box sx={{ p: 1, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" color={isValidJson(data.leftJson) ? 'success.main' : 'error.main'}>
                    Left: {isValidJson(data.leftJson) ? 'Valid JSON' : 'Invalid JSON'}
                </Typography>
                <Typography variant="caption" color={isValidJson(data.rightJson) ? 'success.main' : 'error.main'}>
                    Right: {isValidJson(data.rightJson) ? 'Valid JSON' : 'Invalid JSON'}
                </Typography>
            </Box>
        </Box>
    );
};

export default JsonEditorApp;