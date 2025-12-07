import React, { useState, useEffect } from 'react';
import { Input } from 'antd';

const { TextArea } = Input;

// Simple Rich Text Editor using TextArea with formatting hints
const SimpleRichTextEditor = ({ value, onChange, placeholder, rows = 6 }) => {
    const [editorValue, setEditorValue] = useState(value || '');

    useEffect(() => {
        setEditorValue(value || '');
    }, [value]);

    const handleChange = (e) => {
        const newValue = e.target.value;
        setEditorValue(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };

    const insertText = (beforeText, afterText = '') => {
        const textarea = document.activeElement;
        if (textarea && textarea.tagName === 'TEXTAREA') {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const selectedText = editorValue.substring(start, end);
            const newText = editorValue.substring(0, start) + 
                           beforeText + selectedText + afterText + 
                           editorValue.substring(end);
            setEditorValue(newText);
            if (onChange) {
                onChange(newText);
            }
            
            // Restore cursor position
            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(
                    start + beforeText.length, 
                    end + beforeText.length
                );
            }, 0);
        }
    };

    const toolbarStyle = {
        marginBottom: '8px',
        padding: '8px',
        border: '1px solid #d9d9d9',
        borderBottom: 'none',
        borderRadius: '6px 6px 0 0',
        backgroundColor: '#fafafa'
    };

    const buttonStyle = {
        marginRight: '8px',
        padding: '4px 8px',
        border: '1px solid #d9d9d9',
        borderRadius: '4px',
        backgroundColor: '#fff',
        cursor: 'pointer',
        fontSize: '12px'
    };

    const textAreaStyle = {
        borderRadius: '0 0 6px 6px',
        borderTop: 'none'
    };

    return (
        <div>
            <div style={toolbarStyle}>
                <button
                    type="button"
                    style={buttonStyle}
                    onClick={() => insertText('<strong>', '</strong>')}
                    title="Bold"
                >
                    <strong>B</strong>
                </button>
                <button
                    type="button"
                    style={buttonStyle}
                    onClick={() => insertText('<em>', '</em>')}
                    title="Italic"
                >
                    <em>I</em>
                </button>
                <button
                    type="button"
                    style={buttonStyle}
                    onClick={() => insertText('<u>', '</u>')}
                    title="Underline"
                >
                    <u>U</u>
                </button>
                <button
                    type="button"
                    style={buttonStyle}
                    onClick={() => insertText('\n• ', '')}
                    title="Bullet Point"
                >
                    •
                </button>
                <button
                    type="button"
                    style={buttonStyle}
                    onClick={() => insertText('\n\n', '')}
                    title="New Line"
                >
                    ↵
                </button>
                <span style={{ fontSize: '12px', color: '#666', marginLeft: '16px' }}>
                    Tip: Chọn text rồi click định dạng, hoặc sử dụng HTML tags
                </span>
            </div>
            <TextArea
                value={editorValue}
                onChange={handleChange}
                placeholder={placeholder}
                rows={rows}
                style={textAreaStyle}
            />
        </div>
    );
};

export default SimpleRichTextEditor;
