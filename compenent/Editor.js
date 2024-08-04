import React, { useState } from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBold, faItalic, faUnderline, faStrikethrough, faHeading, faParagraph, faListUl, faListOl, faLink, faUndo, faRedo, faAlignLeft, faAlignCenter, faAlignRight, faAlignJustify, faPalette, faFont } from '@fortawesome/free-solid-svg-icons';
import { Button, Dialog, DialogContentText, DialogTitle, DialogContent, TextField, DialogActions, Menu, MenuItem } from '@mui/material';
import styles from '../styles/Editor.module.css';
import Placeholder from "@tiptap/extension-placeholder";
import '@fortawesome/fontawesome-svg-core/styles.css';

export const TextEditor = ({ selectedItem, setSelectedItem }) => {
  const [open, setOpen] = useState(false);
  const [link, setLink] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link,
      FontFamily,
      Underline,
      Highlight,
      Color,
      Placeholder.configure({
        placeholder: "Bir şeyler yazın…",
      }),
    ],
    editorProps: {
      attributes: {
        class: styles.myCustomEditor,
      },
    },
    content: selectedItem.icerik || '',
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      setSelectedItem({ ...selectedItem, icerik: content });
    },
  });

  if (!editor) {
    return null;
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddLink = () => {
    if (link) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: link }).run();
    }
    handleClose();
  };

  const handleFontMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFontMenuClose = (fontFamily) => {
    if (fontFamily) {
      editor.chain().focus().setFontFamily(fontFamily).run();
    }
    setAnchorEl(null);
  };

  const fontFamilies = [
    'Libre Franklin', 'Arial', 'Roboto', 'Open Sans', 'Lobster',
    'Merriweather', 'Georgia', 'Courier New', 'Times New Roman',
    'Verdana', 'Tahoma', 'Trebuchet MS', 'Impact', 'Comic Sans MS',
    'Lucida Sans'
  ];

  return (
    <>
      <div className={styles.editorContainer}>
        <div className={styles.editorToolbar}>
          <button onClick={() => editor.chain().focus().toggleBold().run()}>
            <FontAwesomeIcon icon={faBold} />
          </button>
          <button onClick={() => editor.chain().focus().toggleItalic().run()}>
            <FontAwesomeIcon icon={faItalic} />
          </button>
          <button onClick={() => editor.chain().focus().toggleUnderline().run()}>
            <FontAwesomeIcon icon={faUnderline} />
          </button>
          <button onClick={() => editor.chain().focus().toggleStrike().run()}>
            <FontAwesomeIcon icon={faStrikethrough} />
          </button>
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
            <FontAwesomeIcon icon={faHeading} /> 1
          </button>
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
            <FontAwesomeIcon icon={faHeading} /> 2
          </button>
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
            <FontAwesomeIcon icon={faHeading} /> 3
          </button>
          <button onClick={() => editor.chain().focus().setParagraph().run()}>
            <FontAwesomeIcon icon={faParagraph} />
          </button>
          <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
            <FontAwesomeIcon icon={faListUl} />
          </button>
          <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>
            <FontAwesomeIcon icon={faListOl} />
          </button>
          <button onClick={handleClickOpen}>
            <FontAwesomeIcon icon={faLink} />
          </button>
          <button onClick={() => editor.chain().focus().undo().run()}>
            <FontAwesomeIcon icon={faUndo} />
          </button>
          <button onClick={() => editor.chain().focus().redo().run()}>
            <FontAwesomeIcon icon={faRedo} />
          </button>
          <button onClick={() => editor.chain().focus().setTextAlign('left').run()}>
            <FontAwesomeIcon icon={faAlignLeft} />
          </button>
          <button onClick={() => editor.chain().focus().setTextAlign('center').run()}>
            <FontAwesomeIcon icon={faAlignCenter} />
          </button>
          <button onClick={() => editor.chain().focus().setTextAlign('right').run()}>
            <FontAwesomeIcon icon={faAlignRight} />
          </button>
          <button onClick={() => editor.chain().focus().setTextAlign('justify').run()}>
            <FontAwesomeIcon icon={faAlignJustify} />
          </button>
          <button onClick={handleFontMenuOpen}>
            <FontAwesomeIcon icon={faFont} />
          </button>
          <button onClick={() => editor.chain().focus().setColor('red').run()}>
            <FontAwesomeIcon icon={faPalette} style={{ color: 'red' }} />
          </button>
          <button onClick={() => editor.chain().focus().setColor('blue').run()}>
            <FontAwesomeIcon icon={faPalette} style={{ color: 'blue' }} />
          </button>
          <button onClick={() => editor.chain().focus().setColor('green').run()}>
            <FontAwesomeIcon icon={faPalette} style={{ color: 'green' }} />
          </button>
          <button onClick={() => editor.chain().focus().setColor('orange').run()}>
            <FontAwesomeIcon icon={faPalette} style={{ color: 'orange' }} />
          </button>
        </div>

        {editor && (
          <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
            <button onClick={() => editor.chain().focus().toggleBold().run()}>
              <FontAwesomeIcon icon={faBold} />
            </button>
            <button onClick={() => editor.chain().focus().toggleItalic().run()}>
              <FontAwesomeIcon icon={faItalic} />
            </button>
            <button onClick={() => editor.chain().focus().toggleUnderline().run()}>
              <FontAwesomeIcon icon={faUnderline} />
            </button>
            <button onClick={() => editor.chain().focus().toggleStrike().run()}>
              <FontAwesomeIcon icon={faStrikethrough} />
            </button>
          </BubbleMenu>
        )}

        <div style={{ height: '100%', width: '100%' }}>
          <EditorContent editor={editor} className={styles.editorContent} />
        </div>

        <Dialog open={open} onClose={handleClose} PaperProps={{ style: { borderRadius: 10, boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' } }}>
          <DialogTitle>Bağlantı Ekle</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Lütfen eklemek istediğiniz bağlantının URL'sini girin.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="link"
              label="Bağlantı URL"
              type="url"
              fullWidth
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Vazgeç
            </Button>
            <Button onClick={handleAddLink} color="primary">
              Ekle
            </Button>
          </DialogActions>
        </Dialog>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => handleFontMenuClose(null)}
          sx={{
            '& .MuiPaper-root': {
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              maxHeight: 300, // Limit the height of the menu
              overflowY: 'auto' // Add scrolling if the menu is too long
            }
          }}
        >
          {fontFamilies.map((fontFamily) => (
            <MenuItem
              key={fontFamily}
              onClick={() => handleFontMenuClose(fontFamily)}
              sx={{
                fontFamily,
                padding: '8px 16px', // Add padding for better readability
                transition: 'background-color 0.3s', // Add transition for hover effect
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#f5f5f5' // Hover effect
                }
              }}
            >
              {fontFamily}
            </MenuItem>
          ))}
        </Menu>

      </div>
    </>
  );
};

