// components/adminComponents/TiptapEditor.jsx
'use client';
import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';

const TiptapEditor = ({ value, setValue }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      BulletList,
      // Emoji extension removed - pasted emojis still work as characters
    ],
    content: value,
    onUpdate: ({ editor }) => setValue(editor.getHTML()),
    immediatelyRender: false,
  });

  if (!isMounted || !editor) return null;

  return (
    <div>
      <div className="flex gap-2 mb-2 flex-wrap">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className="px-2 py-1 border rounded">B</button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className="px-2 py-1 border rounded">I</button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className="px-2 py-1 border rounded">U</button>

        <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className="px-2 py-1 border rounded">Left</button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className="px-2 py-1 border rounded">Center</button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className="px-2 py-1 border rounded">Right</button>

        <button type="button" onClick={() => editor.chain().focus().setHeading({ level: 1 }).run()} className="px-2 py-1 border rounded">H1</button>
        <button type="button" onClick={() => editor.chain().focus().setHeading({ level: 2 }).run()} className="px-2 py-1 border rounded">H2</button>

        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className="px-2 py-1 border rounded">List</button>
      </div>

      <div className="border rounded p-2 bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TiptapEditor;
