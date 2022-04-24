import { Box, styled, useTheme } from '@mui/material'
import { gen } from '../../utils/algorithms'
import './styles.css'
import ExampleTheme from './ExampleTheme'
import LexicalComposer from '@lexical/react/LexicalComposer'
import RichTextPlugin from '@lexical/react/LexicalRichTextPlugin'
import ContentEditable from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import AutoFocusPlugin from '@lexical/react/LexicalAutoFocusPlugin'
import TreeViewPlugin from './plugins/TreeViewPlugin'
import ToolbarPlugin from './plugins/ToolbarPlugin'
import LexicalOnChangePlugin from '@lexical/react/LexicalOnChangePlugin'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table'
import { ListItemNode, ListNode } from '@lexical/list'
import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { AutoLinkNode, LinkNode } from '@lexical/link'
import LinkPlugin from '@lexical/react/LexicalLinkPlugin'
import ListPlugin from '@lexical/react/LexicalListPlugin'
import LexicalMarkdownShortcutPlugin from '@lexical/react/LexicalMarkdownShortcutPlugin'

import ListMaxIndentLevelPlugin from './plugins/ListMaxIndentLevelPlugin'
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin'
import AutoLinkPlugin from './plugins/AutoLinkPlugin'
import { str } from '../../utils/types'
import { useRef } from 'react'
import { EditorState, EditorThemeClasses } from 'lexical'

function Placeholder() {
  return <div className="editor-placeholder">Enter some rich text...</div>
}

const editorConfig = {
  // The editor theme
  theme: ExampleTheme as EditorThemeClasses,
  // Handling of errors during update
  onError(error: Error) {
    throw error
  },
  // Any custom nodes go here
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
  ],
}

// const editorState: EditorState = {
//   _nodeMap: [
//     [
//       'root',
//       {
//         __children: ['2'],
//         __dir: 'ltr',
//         __format: 0,
//         __indent: 0,
//         __key: 'root',
//         __parent: null,
//         __type: 'root',
//       },
//     ],
//     [
//       '2',
//       {
//         __type: 'paragraph',
//         __parent: 'root',
//         __key: '2',
//         __children: ['3'],
//         __format: 0,
//         __indent: 0,
//         __dir: 'ltr',
//       },
//     ],
//     [
//       '3',
//       {
//         __type: 'text',
//         __parent: '2',
//         __key: '3',
//         __text: 'A really nice cat',
//         __format: 0,
//         __style: '',
//         __mode: 0,
//         __detail: 0,
//       },
//     ],
//   ],
//   _selection: {
//     anchor: {
//       key: '3',
//       offset: 17,
//       type: 'text',
//     },
//     focus: {
//       key: '3',
//       offset: 17,
//       type: 'text',
//     },
//     type: 'range',
//   },
// }

function Editor() {
  // const editorStateRef = useRef(editorState)
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container">
        {/* <ToolbarPlugin /> */}
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<Placeholder />}
            // initialEditorState={editorState}
          />
          {/* <HistoryPlugin />
          <TreeViewPlugin />
          <AutoFocusPlugin />
          <CodeHighlightPlugin />
          <ListPlugin />
          <LinkPlugin />
          <AutoLinkPlugin />
          <ListMaxIndentLevelPlugin maxDepth={7} />
          <LexicalMarkdownShortcutPlugin /> */}
          {/* <LexicalOnChangePlugin
            onChange={(editorState) => {
              console.log(JSON.stringify(editorState, null, 2))
              editorStateRef.current = editorState
            }}
          /> */}
        </div>
      </div>
    </LexicalComposer>
  )
}

export function T() {
  const theme = useTheme()
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: theme.apm('100'),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Editor />
    </Box>
  )
}

export default {
  title: 'Sandbox/Sandbox',
}
