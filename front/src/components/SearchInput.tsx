import React, {useEffect, useRef, useState} from 'react';


const sqlKeywords = [
    // DML - Data Manipulation Language
    'SELECT', 'FROM', 'WHERE', 'INSERT', 'INTO', 'UPDATE', 'DELETE', 'MERGE',
    'VALUES', 'SET', 'DEFAULT',

    // DDL - Data Definition Language
    // 'CREATE', 'ALTER', 'DROP', 'TRUNCATE', 'RENAME',
    // 'TABLE', 'VIEW', 'INDEX', 'DATABASE', 'SCHEMA',
    // 'ADD', 'MODIFY', 'COLUMN', 'CONSTRAINT',

    // Joins
    'JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'OUTER', 'CROSS',
    'ON', 'USING',

    // Clauses
    'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET',
    'DISTINCT', 'ALL', 'TOP', 'UNION', 'UNION ALL',

    // Conditions
    'AND', 'OR', 'NOT', 'IN (\'\')', 'BETWEEN', 'LIKE \'%%\'', 'IS', 'NULL',
    'EXISTS', 'ANY', 'SOME', 'ALL',

    // Functions
    'COUNT()', 'SUM()', 'AVG', 'MIN()', 'MAX()', 'COALESCE', 'NULLIF',
    'UPPER', 'LOWER', 'SUBSTRING', 'CONCAT',

    // Transactions
    // 'BEGIN', 'COMMIT', 'ROLLBACK', 'SAVEPOINT',
    // 'TRANSACTION', 'WORK',

    // Other
    'AS', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
    'WITH', 'RECURSIVE',

  'NOW()', 'INTERVAL \'1 DAY\'', 'INTERVAL \'1 HOURS\'', 'INTERVAL \'1 WEEK\'', 'INTERVAL \'1 MONTH\'', 'INTERVAL \'1 YEAR\''
];

interface ChildProps {
    value: string
    data: string[];
    placeholder?: string;
    onSelect?: (value: string) => void;
    onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const SearchInput: React.FC<ChildProps> = ({
                                               value,
                                               data,
                                               placeholder = 'Поиск...',
                                               onSelect,
                                               onKeyPress,
                                           }) => {
    const maxSuggestions = 5
    const [inputValue, setInputValue] = useState(value);
    const inputRef = useRef<HTMLInputElement>(null);
    const displayRef = useRef<HTMLDivElement>(null);

    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeSuggestion, setActiveSuggestion] = useState(-1);

    const suggestionsRef = useRef<HTMLUListElement| null>(null);


    // Фильтрация предложений
    const getSuggestions = (value: string): string[] => {
        const inputValue = value.trim().toLowerCase();
        if (inputValue.length === 0) return [];
        const lastInput = inputValue.split(" ").reverse()[0]
        return [...data, ...sqlKeywords].filter(value => value.toLowerCase()
            .startsWith(lastInput))
            .slice(0, maxSuggestions)

    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        onSelect?.(value);

        const newSuggestions = getSuggestions(value);
        setSuggestions(newSuggestions);
        setShowSuggestions(newSuggestions.length > 0);
        setActiveSuggestion(-1);
    };

    const handleSuggestionClick = (suggestion: string) => {
        const idx = inputValue.lastIndexOf(" ");
        setInputValue(inputValue.substring(0, idx) ? inputValue.substring(0, idx) + " " + suggestion : suggestion);
        setShowSuggestions(false);
        setActiveSuggestion(-1);
        onSelect?.(suggestion);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {

        if (!showSuggestions) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setActiveSuggestion(prev =>
                    prev < suggestions.length - 1 ? prev + 1 : prev
                );
                break;

            case 'ArrowUp':
                e.preventDefault();
                setActiveSuggestion(prev => prev > 0 ? prev - 1 : -1);
                break;

            case 'Enter':
                e.preventDefault();
                if (activeSuggestion >= 0) {
                    handleSuggestionClick(suggestions[activeSuggestion]);
                }
                break;

            case 'Escape':
                setShowSuggestions(false);
                setActiveSuggestion(-1);
                break;
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                inputRef.current &&
                !inputRef.current.contains(event.target as Node) &&
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target as Node)
            ) {
                setShowSuggestions(false);
                setActiveSuggestion(-1);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // ----------------------
    const highlightText = (text: string) => {
        if (!text) return '';

        const patterns = [
            {regex: arrayToRegex(sqlKeywords), color: '#a42713'},
            {regex: /'[^']*'/g, color: '#3e8d51'},
            {regex: /\b\d+\b/g, color: '#0f4bd0'},
            {regex: arrayToRegex(data), color: '#b7711c'},
        ];

        let result = text;

        patterns.forEach(({regex, color}) => {
            result = result.replace(regex, (match) => {
                return `<span style="color: ${color}; font-weight: bold;">${match}</span>`;
            });
        });

        return result;
    };

    const arrayToRegex = (keywords: string[], flags: string = 'gi') => {
        const escapedKeywords = keywords.map(keyword =>
            keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        );

        return new RegExp(`\\b(${escapedKeywords.join('|')})\\b`, flags);
    }

    // Синхронизируем прокрутку
    const syncScroll = () => {
        if (inputRef.current && displayRef.current) {
            displayRef.current.scrollLeft = inputRef.current.scrollLeft;
        }
    };

    // Фокус на input при клике на display
    const handleDisplayClick = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    useEffect(() => {
        syncScroll();
    }, [inputValue]);

    return (
        <div style={{position: 'relative', width: '70%'}}
             onKeyPress={onKeyPress}>
            {/* Скрытый input для ввода */}
            <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                style={{
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    minHeight: '40px',
                    fontFamily: "Consolas, Monaco, 'Courier New', monospace",
                    fontSize: '14px',
                    lineHeight: '1.4',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    color: 'transparent',
                    backgroundColor: 'transparent',
                    caretColor: 'black',
                    outline: 'none',
                    fontWeight: 'normal',
                    letterSpacing: 'normal',
                    fontVariantLigatures: 'none', // Отключаем лигатуры
                    zIndex: 2,
                }}
            />

            {/* Отображаемый элемент с подсветкой */}
            <div
                ref={displayRef}
                onClick={handleDisplayClick}
                style={{
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    minHeight: '40px',
                    fontFamily: "Consolas, Monaco, 'Courier New', monospace",
                    fontSize: '14px',
                    lineHeight: '1.4',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    backgroundColor: 'white',
                    cursor: 'text',
                    overflow: 'hidden',
                    fontWeight: 'normal',
                    letterSpacing: 'normal',
                    fontVariantLigatures: 'none', // Отключаем лигатуры
                    zIndex: 1,
                }}
                dangerouslySetInnerHTML={{__html: highlightText(inputValue)}}
            />
            {showSuggestions && suggestions.length > 0 && (
                <ul
                    ref={suggestionsRef}
                    className="suggestions-list"
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        backgroundColor: 'white',
                        border: '1px solid #ccc',
                        borderTop: 'none',
                        borderRadius: '0 0 4px 4px',
                        maxHeight: '200px',
                        overflowY: 'auto',
                        zIndex: 1000,
                        margin: 0,
                        padding: 0,
                        listStyle: 'none'
                    }}
                >
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className={`suggestion-item ${
                                index === activeSuggestion ? 'active' : ''
                            }`}
                            style={{
                                padding: '8px 12px',
                                cursor: 'pointer',
                                backgroundColor: index === activeSuggestion ? '#f0f0f0' : 'transparent',
                                borderBottom: index < suggestions.length - 1 ? '1px solid #eee' : 'none'
                            }}
                            onMouseEnter={() => setActiveSuggestion(index)}
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchInput;