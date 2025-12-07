import React, { useState, useEffect } from 'react';

// Dynamic import for React Quill to avoid SSR issues
const ReactQuill = React.lazy(() => import('react-quill'));

const RichTextEditor = ({ value, onChange, placeholder, height = 200 }) => {
    const [editorValue, setEditorValue] = useState(value || '');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        setEditorValue(value || '');
    }, [value]);

    const handleChange = (content) => {
        setEditorValue(content);
        if (onChange) {
            onChange(content);
        }
    };

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            [{ 'align': [] }],
            ['link', 'image'],
            ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'color', 'background',
        'list', 'bullet', 'indent',
        'align',
        'link', 'image'
    ];

    // Fallback to simple textarea if React Quill is not available
    if (!isClient) {
        return (
            <textarea
                value={editorValue}
                onChange={(e) => handleChange(e.target.value)}
                placeholder={placeholder}
                style={{
                    width: '100%',
                    height: height,
                    padding: '12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px',
                    fontSize: '14px',
                    resize: 'vertical'
                }}
            />
        );
    }

    return (
        <React.Suspense fallback={
            <textarea
                value={editorValue}
                onChange={(e) => handleChange(e.target.value)}
                placeholder={placeholder}
                style={{
                    width: '100%',
                    height: height,
                    padding: '12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px',
                    fontSize: '14px',
                    resize: 'vertical'
                }}
            />
        }>
            <div style={{ minHeight: height + 42 }}>
                <ReactQuill
                    theme="snow"
                    value={editorValue}
                    onChange={handleChange}
                    placeholder={placeholder}
                    modules={modules}
                    formats={formats}
                    style={{ height: height }}
                />
            </div>
        </React.Suspense>
    );
};


// Inline CSS from RichTextEditor.css
const richTextEditorStyles = `
@import url('https://cdn.quilljs.com/1.3.6/quill.snow.css');
.ql-editor {
    min-height: 150px;
    font-size: 14px;
    line-height: 1.6;
}
.ql-container {
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
}
.ql-toolbar {
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
}
.ql-editor.ql-blank::before {
    color: #bfbfbf;
    font-style: italic;
}
.ql-snow .ql-toolbar {
    border: 1px solid #d9d9d9;
    border-bottom: none;
}
.ql-snow .ql-container {
    border: 1px solid #d9d9d9;
    border-top: none;
}
.ql-snow .ql-editor {
    padding: 12px 15px;
}
.ql-snow .ql-toolbar .ql-formats {
    margin-right: 15px;
}
.ql-container.ql-snow:focus-within {
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}
.ql-toolbar.ql-snow:focus-within {
    border-color: #40a9ff;
}
`;

// Inject style tag once
if (typeof document !== 'undefined' && !document.getElementById('rich-text-editor-styles')) {
  const style = document.createElement('style');
  style.id = 'rich-text-editor-styles';
  style.innerHTML = richTextEditorStyles;
  document.head.appendChild(style);
}

export default RichTextEditor;
