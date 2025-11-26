'use client';
import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import Emoji from '@tiptap/extension-emoji';

const TiptapEditor = ({ value, setValue }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Only run on client
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Emoji,
      Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      BulletList,
    ],
    content: value,
    onUpdate: ({ editor }) => setValue(editor.getHTML()),
    immediatelyRender: false // Fix SSR hydration mismatch!
  });

  if (!isMounted || !editor) {
    return null; // Don't render until client
  }

  return (
    <div>
      <div className="flex gap-2 mb-2 flex-wrap">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()}>U</button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()}>Left</button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()}>Center</button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()}>Right</button>
        <button type="button" onClick={() => editor.chain().focus().setHeading({ level: 1 }).run()}>H1</button>
        <button type="button" onClick={() => editor.chain().focus().setHeading({ level: 2 }).run()}>H2</button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}>List</button>
        <button type="button" onClick={() => editor.chain().focus().insertContent('😊').run()}>Emoji</button>
      </div>
      <div className="border rounded p-2 bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TiptapEditor;
