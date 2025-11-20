import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    Button,
    Paper,
    TextField,
    IconButton,
    Tooltip,
    useTheme,
    useMediaQuery,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Divider,
    Chip,
    CircularProgress,
} from '@mui/material';
import {
    Send,
    ContentCopy,
    ClearAll,
    DarkMode,
    LightMode,
    SmartToy,
    Person,
    Delete,
    RestartAlt,
} from '@mui/icons-material';

// Типы для сообщений
interface Message {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
}

interface ChatAppData {
    messages: Message[];
    currentInput: string;
    isProcessing: boolean;
}

const ChatApp: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [data, setData] = useState<ChatAppData>({
        messages: [
            {
                id: '1',
                content: 'Привет! Я ваш AI-помощник. Чем могу помочь?',
                role: 'assistant',
                timestamp: new Date(),
            },
        ],
        currentInput: '',
        isProcessing: false,
    });

    const [darkMode, setDarkMode] = useState(false);

    // Автопрокрутка к последнему сообщению
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [data.messages]);

    // Обработчик отправки сообщения
    const handleSendMessage = async () => {
        if (!data.currentInput.trim() || data.isProcessing) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            content: data.currentInput.trim(),
            role: 'user',
            timestamp: new Date(),
        };

        // Добавляем сообщение пользователя
        setData(prev => ({
            ...prev,
            messages: [...prev.messages, userMessage],
            currentInput: '',
            isProcessing: true,
        }));

        // Имитация ответа AI (замените на реальный API вызов)
        setTimeout(() => {
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: generateResponse(userMessage.content),
                role: 'assistant',
                timestamp: new Date(),
            };

            setData(prev => ({
                ...prev,
                messages: [...prev.messages, assistantMessage],
                isProcessing: false,
            }));
        }, 1500);
    };

    // Генерация ответа (заглушка - замените на реальную логику)
    const generateResponse = (userInput: string): string => {
        const responses = [
            `Я понял ваш запрос: "${userInput}". Это интересный вопрос!`,
            `Спасибо за сообщение! По поводу "${userInput}" я могу сказать...`,
            `Отличный вопрос! Насчет "${userInput}" мой ответ такой...`,
            `Я обрабатываю ваш запрос "${userInput}". Вот что я могу предложить...`,
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    };

    // Обработчик нажатия Enter
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Очистка истории чата
    const handleClearChat = () => {
        setData(prev => ({
            ...prev,
            messages: [],
        }));
    };

    // Сброс к начальному состоянию
    const handleResetChat = () => {
        setData({
            messages: [
                {
                    id: '1',
                    content: 'Привет! Я ваш AI-помощник. Чем могу помочь?',
                    role: 'assistant',
                    timestamp: new Date(),
                },
            ],
            currentInput: '',
            isProcessing: false,
        });
    };

    // Копирование сообщения
    const handleCopyMessage = (content: string) => {
        navigator.clipboard.writeText(content);
    };

    // Удаление сообщения
    const handleDeleteMessage = (messageId: string) => {
        setData(prev => ({
            ...prev,
            messages: prev.messages.filter(msg => msg.id !== messageId),
        }));
    };

    // Быстрые подсказки
    const quickPrompts = [
        'Объясни понятно',
        'Напиши код для',
        'Переведи на английский',
        'Подведи итог',
        'Какие есть альтернативы?',
    ];

    const handleQuickPrompt = (prompt: string) => {
        setData(prev => ({
            ...prev,
            currentInput: prompt,
        }));
    };

    return (
        <Box sx={{
            flexGrow: 1,
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: darkMode ? '#1e1e1e' : '#f5f5f5',
        }}>
            {/* Шапка с заголовком и кнопками */}
            <AppBar
                position="static"
                elevation={2}
                sx={{
                    backgroundColor: darkMode ? '#2d2d2d' : '#1976d2',
                }}
            >
                <Toolbar>
                    <SmartToy sx={{ mr: 2 }} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        AI Chat Assistant
                    </Typography>

                    <Tooltip title="Переключить тему">
                        <IconButton
                            color="inherit"
                            onClick={() => setDarkMode(!darkMode)}
                            sx={{ mr: 1 }}
                        >
                            {darkMode ? <LightMode /> : <DarkMode />}
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Очистить чат">
                        <IconButton
                            color="inherit"
                            onClick={handleClearChat}
                            sx={{ mr: 1 }}
                        >
                            <ClearAll />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Сбросить чат">
                        <IconButton
                            color="inherit"
                            onClick={handleResetChat}
                        >
                            <RestartAlt />
                        </IconButton>
                    </Tooltip>
                </Toolbar>
            </AppBar>

            {/* Область сообщений */}
            <Box sx={{
                flexGrow: 1,
                overflow: 'auto',
                p: isMobile ? 1 : 2,
                display: 'flex',
                flexDirection: 'column',
            }}>
                {/* Быстрые подсказки */}
                {data.messages.length <= 1 && (
                    <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                        {quickPrompts.map((prompt, index) => (
                            <Chip
                                key={index}
                                label={prompt}
                                onClick={() => handleQuickPrompt(prompt)}
                                variant="outlined"
                                clickable
                                size="small"
                            />
                        ))}
                    </Box>
                )}

                {/* Список сообщений */}
                <List sx={{ width: '100%', maxWidth: '800px', mx: 'auto', flexGrow: 1 }}>
                    {data.messages.map((message, index) => (
                        <React.Fragment key={message.id}>
                            <ListItem
                                alignItems="flex-start"
                                sx={{
                                    flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
                                    textAlign: message.role === 'user' ? 'right' : 'left',
                                }}
                            >
                                <ListItemAvatar sx={{
                                    minWidth: 'auto',
                                    mx: message.role === 'user' ? 1 : 0,
                                }}>
                                    <Avatar sx={{
                                        bgcolor: message.role === 'user' ?
                                            (darkMode ? '#90caf9' : '#1976d2') :
                                            (darkMode ? '#66bb6a' : '#2e7d32'),
                                        width: 32,
                                        height: 32,
                                    }}>
                                        {message.role === 'user' ? <Person /> : <SmartToy />}
                                    </Avatar>
                                </ListItemAvatar>

                                <Paper
                                    elevation={1}
                                    sx={{
                                        p: 2,
                                        maxWidth: '70%',
                                        backgroundColor: message.role === 'user' ?
                                            (darkMode ? '#1565c0' : '#e3f2fd') :
                                            (darkMode ? '#424242' : '#ffffff'),
                                        color: darkMode ? '#ffffff' : 'inherit',
                                        borderRadius: message.role === 'user' ?
                                            '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                    }}
                                >
                                    <ListItemText
                                        primary={
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    whiteSpace: 'pre-wrap',
                                                    wordBreak: 'break-word',
                                                }}
                                            >
                                                {message.content}
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    display: 'block',
                                                    mt: 1,
                                                    opacity: 0.7,
                                                }}
                                            >
                                                {message.timestamp.toLocaleTimeString()}
                                            </Typography>
                                        }
                                    />

                                    {/* Кнопки действий для сообщения */}
                                    <Box sx={{
                                        display: 'flex',
                                        gap: 0.5,
                                        mt: 1,
                                        justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                                    }}>
                                        <Tooltip title="Копировать">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleCopyMessage(message.content)}
                                            >
                                                <ContentCopy fontSize="small" />
                                            </IconButton>
                                        </Tooltip>

                                        {message.role === 'user' && (
                                            <Tooltip title="Удалить">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDeleteMessage(message.id)}
                                                >
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </Box>
                                </Paper>
                            </ListItem>

                            {index < data.messages.length - 1 && (
                                <Divider variant="inset" component="li" sx={{ my: 1 }} />
                            )}
                        </React.Fragment>
                    ))}

                    {/* Индикатор загрузки */}
                    {data.isProcessing && (
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar sx={{
                                    bgcolor: darkMode ? '#66bb6a' : '#2e7d32',
                                    width: 32,
                                    height: 32,
                                }}>
                                    <SmartToy />
                                </Avatar>
                            </ListItemAvatar>
                            <Paper
                                elevation={1}
                                sx={{
                                    p: 2,
                                    backgroundColor: darkMode ? '#424242' : '#ffffff',
                                    color: darkMode ? '#ffffff' : 'inherit',
                                    borderRadius: '18px 18px 18px 4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                }}
                            >
                                <CircularProgress size={20} />
                                <Typography variant="body2">AI печатает...</Typography>
                            </Paper>
                        </ListItem>
                    )}

                    <div ref={messagesEndRef} />
                </List>
            </Box>

            {/* Панель ввода */}
            <Box sx={{
                p: 2,
                borderTop: 1,
                borderColor: 'divider',
                backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
            }}>
                <Box sx={{
                    maxWidth: '800px',
                    mx: 'auto',
                    display: 'flex',
                    gap: 1,
                    alignItems: 'flex-end',
                }}>
                    <TextField
                        fullWidth
                        multiline
                        maxRows={4}
                        value={data.currentInput}
                        onChange={(e) => setData(prev => ({ ...prev, currentInput: e.target.value }))}
                        onKeyPress={handleKeyPress}
                        placeholder="Введите ваше сообщение..."
                        variant="outlined"
                        size="small"
                        disabled={data.isProcessing}
                    />

                    <Tooltip title="Отправить (Enter)">
            <span>
              <IconButton
                  color="primary"
                  onClick={handleSendMessage}
                  disabled={!data.currentInput.trim() || data.isProcessing}
                  sx={{
                      backgroundColor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                          backgroundColor: 'primary.dark',
                      },
                      '&:disabled': {
                          backgroundColor: 'action.disabled',
                      },
                  }}
              >
                <Send />
              </IconButton>
            </span>
                    </Tooltip>
                </Box>

                {/* Подсказка под полем ввода */}
                <Typography
                    variant="caption"
                    sx={{
                        display: 'block',
                        textAlign: 'center',
                        mt: 1,
                        opacity: 0.6,
                    }}
                >
                    Shift + Enter для новой строки, Enter для отправки
                </Typography>
            </Box>
        </Box>
    );
};

export default ChatApp;