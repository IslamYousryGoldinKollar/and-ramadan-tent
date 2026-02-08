'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { useState, useCallback } from 'react'
import { Bold, Italic, Heading1, Heading2, List, ListOrdered, LinkIcon, ImageIcon, Code, Undo, Redo } from 'lucide-react'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export function RichTextEditor({ content, onChange, placeholder = 'Start writing...' }: RichTextEditorProps) {
  const [showHtml, setShowHtml] = useState(false)
  const [htmlSource, setHtmlSource] = useState(content)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false, allowBase64: true }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      setHtmlSource(html)
      onChange(html)
    },
  })

  const toggleHtmlMode = useCallback(() => {
    if (showHtml) {
      // Switching from HTML to WYSIWYG
      editor?.commands.setContent(htmlSource)
      onChange(htmlSource)
    } else {
      // Switching to HTML mode
      setHtmlSource(editor?.getHTML() || '')
    }
    setShowHtml(!showHtml)
  }, [showHtml, htmlSource, editor, onChange])

  const addImage = useCallback(() => {
    const url = window.prompt('Enter image URL:')
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  const addLink = useCallback(() => {
    const url = window.prompt('Enter URL:')
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }, [editor])

  if (!editor) return null

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          disabled={showHtml}
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          disabled={showHtml}
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
          disabled={showHtml}
        >
          <Heading1 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          disabled={showHtml}
        >
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          disabled={showHtml}
        >
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          disabled={showHtml}
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <ToolbarButton onClick={addLink} disabled={showHtml}>
          <LinkIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={addImage} disabled={showHtml}>
          <ImageIcon className="w-4 h-4" />
        </ToolbarButton>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={showHtml}>
          <Undo className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={showHtml}>
          <Redo className="w-4 h-4" />
        </ToolbarButton>
        <div className="flex-1" />
        <button
          onClick={toggleHtmlMode}
          className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
            showHtml ? 'bg-eand-red text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Code className="w-3 h-3" />
          {showHtml ? 'WYSIWYG' : 'HTML'}
        </button>
      </div>

      {/* Editor / HTML Source */}
      {showHtml ? (
        <textarea
          value={htmlSource}
          onChange={(e) => {
            setHtmlSource(e.target.value)
            onChange(e.target.value)
          }}
          className="w-full min-h-[300px] p-4 font-mono text-sm bg-gray-900 text-green-400 focus:outline-none resize-y"
          spellCheck={false}
        />
      ) : (
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none p-4 min-h-[300px] focus-within:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[280px] [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-gray-400 [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0"
        />
      )}
    </div>
  )
}

function ToolbarButton({
  children,
  onClick,
  active,
  disabled,
}: {
  children: React.ReactNode
  onClick: () => void
  active?: boolean
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-1.5 rounded transition-colors ${
        active ? 'bg-eand-red text-white' : 'text-gray-600 hover:bg-gray-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  )
}
