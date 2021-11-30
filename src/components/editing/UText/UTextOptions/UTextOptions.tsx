import {
  Fade,
  Icon,
  Paper,
  Stack,
  styled,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import { RefObject, useState } from 'react'
import FormatBoldRoundedIcon from '@mui/icons-material/FormatBoldRounded'
import FormatItalicRoundedIcon from '@mui/icons-material/FormatItalicRounded'
import FormatUnderlinedRoundedIcon from '@mui/icons-material/FormatUnderlinedRounded'
import FormatStrikethroughRoundedIcon from '@mui/icons-material/FormatStrikethroughRounded'
import CodeRoundedIcon from '@mui/icons-material/CodeRounded'
import FormatColorFillRoundedIcon from '@mui/icons-material/FormatColorFillRounded'
import InsertLinkRoundedIcon from '@mui/icons-material/InsertLinkRounded'
import { Hr, SVGIC } from '../../../utils/MuiUtils'
import { ReactComponent as TEXII } from '../../UBlock/BlockAutocomplete/texInline.svg'
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded'
import { UMenu, UMenuControls, UOption, useMenu } from '../../../utils/UMenu/UMenu'
import { ReactComponent as AI } from './a.svg'
import { ReactComponent as AFI } from './aF.svg'
import { useLocalStorage } from '../../../utils/hooks/useLocalStorage'
import { safe } from '../../../../utils/utils'
import { bool, SetStr, str, strs } from '../../../../utils/types'
import { UArrayStr, useArray } from '../../../utils/hooks/useArray'
import { useMount } from '../../../utils/hooks/hooks'
import {
  cursorOffset,
  selectionCoordinates,
  ToggleableTags,
  toggleEmClass,
  toggleTagMutable,
} from '../../../utils/Selection/selection'
import { COLORS } from '../../../application/theming/theme'
import { UTextTexEditor } from './UTextInlineEditors/UTextTexEditor'
import { UTextLinkEditor } from './UTextInlineEditors/UTextLinkEditor'

export interface UTextOptions {
  textRef: RefObject<HTMLDivElement>
  texEditorPs: UTextTexEditor
  linkEditorPs: UTextLinkEditor
  alwaysShow?: bool // for sorybook only
}

const UO = UOption
export function UTextOptions({ textRef, alwaysShow, texEditorPs, linkEditorPs }: UTextOptions) {
  const [coordinates, setCoordinates] = useState(new Coordinates())
  const [isActive, setIsActive] = useState(alwaysShow || false)
  const [textColor, setTextColor] = useState('')

  const styles = useArray()
  const menu = useMenu()

  useMount(() => {
    const sRef = safe(textRef.current)
    let isBlurred = false

    const onChange = () => {
      const selection = window.getSelection()
      const selectedText = selection?.toString() || ''

      if (!selectedText) {
        setIsActive(false)
        setCoordinates({ x: 0, b: 0 })
        if (isBlurred) {
          document.removeEventListener('selectionchange', onChange)
        }
        menu.close() // when clicked inside block click away is not triggered in UMenu
      } else {
        const newStyles = getStyles(safe(selection?.getRangeAt(0)).startContainer)
        styles.reset(newStyles)
        setTextColor(findColorInStyles(newStyles))
        setIsActive(true)
        setCoordinates(selectionCoordinates(sRef))
      }
    }

    const onFocus = () => {
      isBlurred = false
      document.addEventListener('selectionchange', onChange) // isDisconnected flag introduction doesn't help on preventing unnecessary additions
    }

    const onBlur = () => {
      isBlurred = true
    }

    sRef.addEventListener('focus', onFocus)
    sRef.addEventListener('blur', onBlur)

    return () => {
      sRef.removeEventListener('selectstart', onFocus)
      sRef.removeEventListener('blur', onBlur)
      document.removeEventListener('selectionchange', onChange)
    }
  })

  return (
    <Fade in={isActive || texEditorPs.isActive || linkEditorPs.isActive} timeout={{ exit: 0 }}>
      <div>
        {!texEditorPs.isActive && !linkEditorPs.isActive && (
          <Options
            textRef={textRef}
            coordinates={coordinates}
            menu={menu}
            textColor={textColor}
            texEditorPs={texEditorPs}
            linkEditorPs={linkEditorPs}
            setTextColor={setTextColor}
            styles={styles}
          />
        )}
        {linkEditorPs.isActive && <UTextLinkEditor {...linkEditorPs} />}
        {texEditorPs.isActive && <UTextTexEditor {...texEditorPs} />}
      </div>
    </Fade>
  )
}

interface Options_ {
  textRef: RefObject<HTMLDivElement>
  styles: UArrayStr
  menu: UMenuControls
  setTextColor: SetStr
  coordinates: Coordinates
  textColor: str
  texEditorPs: UTextTexEditor
  linkEditorPs: UTextLinkEditor
}

function Options({ styles, menu, setTextColor, textRef, coordinates, textColor, texEditorPs, linkEditorPs }: Options_) {
  const theme = useTheme()
  const { lastUsedColor, setLastUsedColor } = useLastUsedColor()

  const onColor = (color: str) => () => {
    if (color === color) {
      setTextColor('')
      styles.deleteElement('color')
    } else {
      setTextColor(color)
      styles.push('color')
      setLastUsedColor(color)
    }
    toggleEmClass(safe(textRef.current), classForColor(color) || '')
  }

  const toggleTex = () => {
    texEditorPs.toggleTex(cursorOffset(safe(textRef.current)))
  }

  const sx = { '.A': { fill: theme.isDark() ? 'white' : theme.palette.primary.main } }
  const groupSX = {
    transform: 'translateY(0.25px)', // ToggleButtonGroup has strange offset
    '.MuiButtonBase-root': { border: `1px solid ${theme.apm('100')}` },
  }
  const darkMultiplier = theme.isDark() ? 1 / 4 : 1
  return (
    <Paper
      elevation={8 * darkMultiplier}
      sx={{
        width: 'fit-content',
        position: 'absolute',
        top: coordinates.b,
        left: coordinates.x ? coordinates.x - 364 / 2 : 0,
        zIndex: 2, // otherwise overlapped by file dropzone
      }}
    >
      <ToggleButtonGroup value={styles.data} aria-label="text formatting" sx={groupSX} size="small">
        {/* Failed to avoid copy pasting because ToggleButtonGroup breaks */}
        <ToggleButton value="link" aria-label="link" onClick={linkEditorPs.toggleLink}>
          <Tooltip
            title={
              <Stack>
                <Typography sx={{ userSelect: 'none' }}>Add link</Typography>
                <Typography color="gray" sx={{ userSelect: 'none' }}>
                  ⌘+K
                </Typography>
              </Stack>
            }
            componentsProps={tipSX}
          >
            <InsertLinkRoundedIcon />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="bold" aria-label="bold" onClick={() => toggle(textRef, 'b')}>
          <Tooltip
            title={
              <Stack>
                <Typography sx={{ userSelect: 'none' }}>Bold</Typography>
                <Typography color="gray" sx={{ userSelect: 'none' }}>
                  ⌘+B
                </Typography>
              </Stack>
            }
            componentsProps={tipSX}
          >
            <FormatBoldRoundedIcon />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="italic" aria-label="italic" onClick={() => toggle(textRef, 'i')}>
          <Tooltip
            title={
              <Stack>
                <Typography sx={{ userSelect: 'none' }}>Italic</Typography>
                <Typography color="gray" sx={{ userSelect: 'none' }}>
                  ⌘+I
                </Typography>
              </Stack>
            }
            componentsProps={tipSX}
          >
            <FormatItalicRoundedIcon />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="underlined" aria-label="underlined" onClick={() => toggle(textRef, 'u')}>
          <Tooltip
            title={
              <Stack>
                <Typography sx={{ userSelect: 'none' }}>Underlined</Typography>
                <Typography color="gray" sx={{ userSelect: 'none' }}>
                  ⌘+U
                </Typography>
              </Stack>
            }
            componentsProps={tipSX}
          >
            <FormatUnderlinedRoundedIcon />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="strikethrough" aria-label="strikethrough" onClick={() => toggle(textRef, 's')}>
          <Tooltip
            title={
              <Stack>
                <Typography sx={{ userSelect: 'none' }}>Strike-through</Typography>
                <Typography color="gray" sx={{ userSelect: 'none' }}>
                  ⌘+⇧+S
                </Typography>
              </Stack>
            }
            componentsProps={tipSX}
          >
            <FormatStrikethroughRoundedIcon />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="code" aria-label="code" onClick={() => toggle(textRef, 'mark')}>
          <Tooltip
            title={
              <Stack>
                <Typography sx={{ userSelect: 'none' }}>Mark as code</Typography>
                <Typography color="gray" sx={{ userSelect: 'none' }}>
                  ⌘+E
                </Typography>
              </Stack>
            }
            componentsProps={tipSX}
          >
            <CodeRoundedIcon />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="equation" aria-label="equation" onClick={toggleTex}>
          <Tooltip
            title={
              <Stack>
                <Typography sx={{ userSelect: 'none' }}>Create equation</Typography>
                <Typography color="gray" sx={{ userSelect: 'none' }}>
                  ⌘+⇧+E
                </Typography>
              </Stack>
            }
            componentsProps={tipSX}
          >
            <Icon>
              <TEXII style={{ fill: 'currentColor', transform: 'translateY(-6px) scale(1.2)' }} />
            </Icon>
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="color" aria-label="color" ref={menu.btnRef} onClick={menu.toggleOpen} data-cy="colors">
          <Tooltip
            title={
              <Stack>
                <Typography sx={{ userSelect: 'none' }}>Text color</Typography>
                <Typography color="gray" sx={{ userSelect: 'none' }}>
                  ⌘+⇧+H
                </Typography>
              </Stack>
            }
            componentsProps={tipSX}
          >
            <FormatColorFillRoundedIcon />
          </Tooltip>
          <Down />
          {/* if Down is placed in fragment inside tooltip it will never show up, if placed in div it breaks layout */}
        </ToggleButton>
      </ToggleButtonGroup>
      <UMenu {...menu} elevation={12 * darkMultiplier}>
        {lastUsedColor && (
          <UOption
            text="Last used"
            onClick={onColor(lastUsedColor)}
            icon={safe(colorAndInfo.get(lastUsedColor))}
            sx={sx}
            shortcut="Ctrl+Shift+H"
          />
        )}
        {lastUsedColor && <Hr />}
        <UO text={RedL} onClick={onColor(RedL)} icon={ARed} sx={sx} selected={textColor === RedL} />
        <UO text={GreenL} onClick={onColor(GreenL)} icon={AGreen} sx={sx} selected={textColor === GreenL} />
        <UO text={BlueL} onClick={onColor(BlueL)} icon={ABlue} sx={sx} selected={textColor === BlueL} />
        <UO text={PurpleL} onClick={onColor(PurpleL)} icon={APurple} sx={sx} selected={textColor === PurpleL} />
        <UO text={PinkL} onClick={onColor(PinkL)} icon={APink} sx={sx} selected={textColor === PinkL} />
        <Hr />
        <UO text={RedBL} onClick={onColor(RedBL)} icon={AFRed} sx={sx} selected={textColor === RedBL} />
        <UO text={GreenBL} onClick={onColor(GreenBL)} icon={AFGreen} sx={sx} selected={textColor === GreenBL} />
        <UO text={BlueBL} onClick={onColor(BlueBL)} icon={AFBlue} sx={sx} selected={textColor === BlueBL} />
        <UO text={PurpleBL} onClick={onColor(PurpleBL)} icon={AFPurple} sx={sx} selected={textColor === PurpleBL} />
        <UO text={PinkBL} onClick={onColor(PinkBL)} icon={AFPink} sx={sx} selected={textColor === PinkBL} />
      </UMenu>
    </Paper>
  )
}

function getStyles(node: Node): strs {
  const parentName = node.parentNode?.nodeName || ''

  if (['PRE', 'H2', 'H3', 'H4'].includes(parentName)) return []

  let type = ''
  if (parentName === 'A') type = 'link'
  else if (parentName === 'B') type = 'bold'
  else if (parentName === 'I') type = 'italic'
  else if (parentName === 'U') type = 'underlined'
  else if (parentName === 'S') type = 'strikethrough'
  else if (parentName === 'MARK') type = 'code'
  else if (parentName === 'EM') type = (node.parentNode as HTMLElement).getAttribute('class') || ''

  return [type, ...getStyles(safe(node.parentNode))]
}

function findColorInStyles(styles: strs): str {
  const colorClasses = Array.from(classAndColor.keys())
  const colorClass = styles.find((s) => colorClasses.includes(s))
  if (colorClass) return safe(classAndColor.get(colorClass))
  return ''
}

const toggle = (ref: RefObject<HTMLDivElement>, tag: ToggleableTags) => toggleTagMutable(safe(ref.current), tag)

const tipSX = {
  tooltip: {
    sx: { backgroundColor: COLORS.black },
  },
}

// L - label, D - dark
const PinkL = 'Pink'
const PurpleL = 'Purple'
const BlueL = 'Blue'
const GreenL = 'Green'
const RedL = 'Red'

const PinkBL = 'Pink Background'
const PurpleBL = 'Purple Background'
const BlueBL = 'Blue Background'
const GreenBL = 'Green Background'
const RedBL = 'Red Background'

const Red = '#d44c47'
const RedD = '#ea878c'
const RedB = RedD
const RedBD = '#520105'

const Green = '#448361'
const GreenD = '#71b283'
const GreenB = GreenD
const GreenBD = '#073822'

const Blue = '#337ea9'
const BlueD = '#66aada'
const BlueB = BlueD
const BlueBD = '#03325e'

const Purple = '#9065b0'
const PurpleD = '#b098d9'
const PurpleB = PurpleD
const PurpleBD = '#2f008b'

const Pink = '#c14c8a'
const PinkD = '#df84d1'
const PinkB = PinkD
const PinkBD = '#5a024c'

const scale = 1.3

const ARed = SVGIC(AI, { scale, color: Red, colorDark: RedD })
const AGreen = SVGIC(AI, { scale, color: Green, colorDark: GreenD })
const ABlue = SVGIC(AI, { scale, color: Blue, colorDark: BlueD })
const APurple = SVGIC(AI, { scale, color: Purple, colorDark: PurpleD })
const APink = SVGIC(AI, { scale, color: Pink, colorDark: PinkD })

const AFRed = SVGIC(AFI, { color: RedB, colorDark: RedBD })
const AFGreen = SVGIC(AFI, { color: GreenB, colorDark: GreenBD })
const AFBlue = SVGIC(AFI, { color: BlueB, colorDark: BlueBD })
const AFPurple = SVGIC(AFI, { color: PurpleB, colorDark: PurpleBD })
const AFPink = SVGIC(AFI, { color: PinkB, colorDark: PinkBD })

export function useLastUsedColor() {
  const [lastUsedColor, setLastUsedColor] = useLocalStorage('lastUsedColor', '')
  const lastUsedColorClass = lastUsedColor ? classForColor(lastUsedColor) : ''
  return { lastUsedColor, setLastUsedColor, lastUsedColorClass: lastUsedColorClass }
}

function classForColor(color: str): str {
  return `${color.includes(' Background') ? color.replace(' Background', '-b').toLowerCase() : color.toLowerCase()}`
}

const classAndColor = new Map([
  ['red', RedL],
  ['green', GreenL],
  ['blue', BlueL],
  ['purple', PurpleL],
  ['pink', PinkL],
  ['red-b', RedBL],
  ['green-b', GreenBL],
  ['blue-b', BlueBL],
  ['purple-b', PurpleBL],
  ['pink-b', PinkBL],
])

const colorAndInfo = new Map([
  [RedL, ARed],
  [GreenL, AGreen],
  [BlueL, ABlue],
  [PurpleL, APurple],
  [PinkL, APink],
  [RedBL, AFRed],
  [GreenBL, AFGreen],
  [BlueBL, AFBlue],
  [PurpleBL, AFPurple],
  [PinkBL, AFPink],
])

export function coloredTextSX(isDark: bool) {
  if (isDark) {
    return {
      '.red': { color: RedD },
      '.green': { color: GreenD },
      '.blue': { color: BlueD },
      '.purple': { color: PurpleD },
      '.pink': { color: PinkD },

      '.red-b': { backgroundColor: RedBD },
      '.green-b': { backgroundColor: GreenBD },
      '.blue-b': { backgroundColor: BlueBD },
      '.purple-b': { backgroundColor: PurpleBD },
      '.pink-b': { backgroundColor: PinkBD },
    }
  }

  return {
    '.red': { color: Red },
    '.green': { color: Green },
    '.blue': { color: Blue },
    '.purple': { color: Purple },
    '.pink': { color: Pink },

    '.red-b': { backgroundColor: RedB },
    '.green-b': { backgroundColor: GreenB },
    '.blue-b': { backgroundColor: BlueB },
    '.purple-b': { backgroundColor: PurpleB },
    '.pink-b': { backgroundColor: PinkB },
  }
}

const Down = styled(ArrowDropDownRoundedIcon)({ transform: 'scale(1.3)' })

class Coordinates {
  x = 0
  b = 0
}
