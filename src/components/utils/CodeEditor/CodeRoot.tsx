import { Box, styled } from '@mui/material'
import { COLORS } from '../../application/theming/theme'

// based on https://github.com/PrismJS/prism-themes/blob/master/themes/prism-synthwave84.css
export const CodeRoot = styled(Box)(({ theme }) => ({
  'div[class*="language-"]': {
    tabSize: 2,
    fontSize: '1.25rem',

    color: theme.isDark() ? '#f92aad' : '#00a7fb',
    textShadow: theme.isDark() ? '0 0 2px #100c0f, 0 0 5px #dc078e33, 0 0 10px #fff3' : undefined,
    background: 'none',
    fontFamily: "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    textAlign: 'left',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    hyphens: 'none',
  },

  ...(theme.isDark() ? dark : light),
}))

const dark = {
  '.token.comment,.token.block-comment,.token.prolog,.token.doctype,.token.cdata': {
    color: '#8e8e8e',
  },

  '.token.punctuation': {
    color: '#ccc',
  },

  '.token.tag,.token.attr-name,.token.namespace,.token.number,.token.unit,.token.hexcode,.token.deleted': {
    color: '#e2777a',
  },

  '.token.property,.token.selector': {
    color: '#72f1b8',
    textShadow: '0 0 2px #100c0f, 0 0 10px #257c5575, 0 0 35px #21272475',
  },

  '.token.boolean,.token.selector .token.id,.token.function': {
    color: '#fdfdfd',
    textShadow: '0 0 2px #001716, 0 0 3px #03edf975, 0 0 5px #03edf975, 0 0 8px #03edf975',
  },

  '.token.class-name': {
    color: '#ffdbde',
    textShadow: '0 0 2px #000, 0 0 10px #fc1f2c, 0 0 5px #fc1f2cdb, 0 0 25px #fc1f1fcf',
  },

  '.token.constant, .token.symbol': {
    color: '#f92aad',
    textShadow: '0 0 2px #100c0f, 0 0 5px #dc078e33, 0 0 10px #fff3',
  },

  '.token.important,.token.atrule,.token.keyword,.token.selector .token.class,.token.builtin ': {
    color: '#ffeac8',
    textShadow: '0 0 2px #393a33, 0 0 8px #f39f05, 0 0 2px #f39f05eb',
  },

  '.token.string,.token.char,.token.attr-value,.token.regex,.token.variable': {
    color: COLORS.secondary,
  },

  '.token.operator,.token.entity,.token.url': {
    color: '#67cdcc',
  },

  '.token.important,.token.bold': {
    fontWeight: 'bold',
  },

  '.token.italic': {
    fontStyle: 'italic',
  },

  '.token.entity': {
    cursor: 'help',
  },

  '.token.inserted': {
    color: 'green',
  },
}

// based on https://github.com/PrismJS/prism-themes/blob/master/themes/prism-material-light.css
const light = {
  '.token.id,.token.important': {
    color: '#7c4dff',
    fontWeight: 'bold',
  },

  '.token.prolog,.token.doctype,.token.comment': {
    color: '#aabfc9',
  },

  '.token.punctuation,.token.property,.token.operator,.token.inserted,.token.class,.token.char,.token.cdata,.token.builtin,.token.attr-name':
    {
      color: '#39adb5',
    },

  '.token.regex,.token.class-name': {
    color: '#0cc168',
  },

  '.token.string,.token.pseudo-element,.token.pseudo-class,.token.attribute,.token.attr-value': {
    color: '#f6a434',
  },

  '.token.symbol,.token.keyword,.token.constant,.token.atrule': {
    color: '#7c4dff',
  },

  '.token.boolean,.token.function': {
    color: '#ef3bad',
  },

  '.token.unit,.token.number,.token.hexcode': {
    color: '#f76d47',
  },

  '.token.variable,.token.url,.token.tag,.token.selector,.token.entity,.token.deleted': {
    color: '#e53935',
  },
}
