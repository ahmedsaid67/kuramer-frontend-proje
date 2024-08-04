// components/TextEditor.js
import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import ListItem from '@tiptap/extension-list-item';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import Heading from '@tiptap/extension-heading';
import Bold from '@tiptap/extension-bold';
import styles from '../styles/Deneme.module.css'

const TextEditor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link,
      ListItem,
      BulletList,
      OrderedList,
      Heading,
      Bold,
    ],
    content: '',
  });

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = prompt('Enter the URL');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  return (
    <div>
      <div className="editor-toolbar">
        <button onClick={() => editor.chain().focus().toggleBold().run()}>Bold</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
        <button onClick={() => editor.chain().focus().setParagraph().run()}>Paragraph</button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()}>Bullet List</button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>Ordered List</button>
        <button onClick={addLink}>Add Link</button>
        {/* Add more buttons for font, color, etc. */}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default TextEditor;
