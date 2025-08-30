<!DOCTYPE html>
<html lang="en" class="h-full">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tiptap Rich Text Editor</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        /* Custom styles for Tiptap editor */
        .tiptap {
            padding: 0.75rem;
            border-radius: 0.5rem;
            border: 1px solid #d1d5db; /* gray-300 */
            min-height: 15rem; /* 240px */
            outline: none;
            transition: border-color 0.2s;
        }
        .tiptap:focus {
            border-color: #3b82f6; /* blue-500 */
        }
        .tiptap > * + * {
            margin-top: 0.75em;
        }
        .tiptap ul, .tiptap ol {
            padding: 0 1rem;
        }
        .tiptap h1, .tiptap h2, .tiptap h3, .tiptap h4, .tiptap h5, .tiptap h6 {
            line-height: 1.1;
        }
        .tiptap code {
            background-color: rgba(97, 97, 97, 0.1);
            color: #616161;
            padding: 0.25em 0.5em;
            border-radius: 0.25em;
        }
        .tiptap pre {
            background: #0D0D0D;
            color: #FFF;
            font-family: 'JetBrainsMono', monospace;
            padding: 0.75rem 1rem;
            border-radius: 0.5rem;
        }
        .tiptap pre code {
            color: inherit;
            padding: 0;
            background: none;
            font-size: 0.8rem;
        }
        .tiptap img {
            max-width: 100%;
            height: auto;
        }
        .tiptap blockquote {
            padding-left: 1rem;
            border-left: 2px solid rgba(13, 13, 13, 0.1);
        }
        .tiptap hr {
            border: none;
            border-top: 2px solid rgba(13, 13, 13, 0.1);
            margin: 2rem 0;
        }
        .is-active {
            background-color: #e5e7eb; /* gray-200 */
        }
    </style>
</head>
<body class="bg-gray-100 flex items-center justify-center h-full font-sans antialiased p-4">

    <div id="root" class="w-full max-w-4xl"></div>

    <!-- React and Babel -->
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

    <!-- Tiptap Dependencies (UMD builds) -->
    <script src="https://unpkg.com/prop-types@15.7.2/prop-types.js"></script>
    <script src="https://unpkg.com/@tiptap/core@2.4.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/pm@2.4.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/react@2.4.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/starter-kit@2.4.0/dist/index.umd.js"></script>

    <script type="text/babel">
        const { useEditor, EditorContent } = TiptapReact;
        const { StarterKit } = TiptapStarterKit;

        // MenuBar Component for editor controls
        const MenuBar = ({ editor }) => {
            if (!editor) {
                return null;
            }

            const menuItems = [
                { action: () => editor.chain().focus().toggleBold().run(), name: 'bold', icon: 'B', isActive: editor.isActive('bold') },
                { action: () => editor.chain().focus().toggleItalic().run(), name: 'italic', icon: 'I', isActive: editor.isActive('italic') },
                { action: () => editor.chain().focus().toggleStrike().run(), name: 'strike', icon: 'S', isActive: editor.isActive('strike') },
                { action: () => editor.chain().focus().toggleCode().run(), name: 'code', icon: '</>', isActive: editor.isActive('code') },
                { type: 'divider' },
                { action: () => editor.chain().focus().setParagraph().run(), name: 'paragraph', icon: 'P', isActive: editor.isActive('paragraph') },
                { action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), name: 'h1', icon: 'H1', isActive: editor.isActive('heading', { level: 1 }) },
                { action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), name: 'h2', icon: 'H2', isActive: editor.isActive('heading', { level: 2 }) },
                { action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), name: 'h3', icon: 'H3', isActive: editor.isActive('heading', { level: 3 }) },
                { type: 'divider' },
                { action: () => editor.chain().focus().toggleBulletList().run(), name: 'bullet list', icon: '•', isActive: editor.isActive('bulletList') },
                { action: () => editor.chain().focus().toggleOrderedList().run(), name: 'ordered list', icon: '1.', isActive: editor.isActive('orderedList') },
                { action: () => editor.chain().focus().toggleCodeBlock().run(), name: 'code block', icon: '{}', isActive: editor.isActive('codeBlock') },
                { type: 'divider' },
                { action: () => editor.chain().focus().toggleBlockquote().run(), name: 'blockquote', icon: '“', isActive: editor.isActive('blockquote') },
                { action: () => editor.chain().focus().setHorizontalRule().run(), name: 'horizontal rule', icon: '—' },
                { type: 'divider' },
                { action: () => editor.chain().focus().undo().run(), name: 'undo', icon: '↶' },
                { action: () => editor.chain().focus().redo().run(), name: 'redo', icon: '↷' },
            ];

            return (
                <div className="flex flex-wrap items-center gap-1 border border-gray-300 bg-white p-2 rounded-t-lg">
                    {menuItems.map((item, index) => (
                        item.type === 'divider' ?
                        <div key={index} className="w-[1px] h-6 bg-gray-300 mx-1"></div> :
                        <button
                            key={index}
                            onClick={item.action}
                            className={`px-2 py-1 rounded-md text-sm font-semibold transition-colors
                                ${item.isActive ? 'bg-gray-900 text-white' : 'hover:bg-gray-200 text-gray-700'}
                                ${!editor.can()[item.name] && item.name !== 'redo' && item.name !== 'undo' ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                            disabled={!editor.can()[item.name] && item.name !== 'redo' && item.name !== 'undo'}
                            title={item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                        >
                            {item.icon}
                        </button>
                    ))}
                </div>
            );
        };

        // The main Tiptap Editor Component
        const TiptapEditor = () => {
            const editor = useEditor({
                extensions: [
                    StarterKit,
                ],
                content: `
                    <h2>
                      Hi there,
                    </h2>
                    <p>
                      This is a basic Tiptap editor. You can start typing here. Use the toolbar above to format your text.
                    </p>
                    <ul>
                      <li>That’s a bullet list.</li>
                      <li>With a few items.</li>
                    </ul>
                    <p>
                      Enjoy! 🎉
                    </p>
                `,
                editorProps: {
                    attributes: {
                        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none',
                    },
                },
            });

            return (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <MenuBar editor={editor} />
                    <EditorContent editor={editor} className="p-4" />
                </div>
            );
        };
        
        // App Component
        const App = () => {
            return (
                <div className="flex flex-col gap-4">
                    <h1 className="text-3xl font-bold text-gray-800 text-center">Tiptap Rich Text Editor</h1>
                    <p className="text-gray-600 text-center">A modern, clean, and intuitive text editor built with Tiptap, React, and Tailwind CSS.</p>
                    <TiptapEditor />
                </div>
            );
        }

        const container = document.getElementById('root');
        const root = ReactDOM.createRoot(container);
        root.render(<App />);

    </script>

</body>
</html>
