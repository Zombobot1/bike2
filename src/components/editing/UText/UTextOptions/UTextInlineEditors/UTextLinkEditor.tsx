import { bool, Fn, num, SetStr, str } from '../../../../../utils/types'
import { KeyboardEvent, useEffect, useState } from 'react'
import { ClickAwayListener, Paper } from '@mui/material'
import { TextInput } from '../../../../utils/MuiUtils'
import { InlineEditorExit, SetFocus } from '../../../types'
import { safe } from '../../../../../utils/utils'
import { removeTag, replaceTag } from '../../../../utils/Selection/htmlAsStr'
import { cursorOffsetAndSelection, selectionCoordinates, toggleTags } from '../../../../utils/Selection/selection'

export interface UTextLinkEditor {
  saveLink: (exit?: 'click' | 'key') => void
  updateLink: SetStr
  onLinkKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void
  toggleLink: Fn
  activeLink: { b: num; x: num; address: str }
  isActive: bool
}

export function UTextLinkEditor({ activeLink, onLinkKeyDown, saveLink, updateLink }: UTextLinkEditor) {
  return (
    <ClickAwayListener onClickAway={() => saveLink('click')}>
      <Paper
        elevation={8}
        sx={{
          width: '20rem',
          padding: '1rem',
          position: 'absolute',
          top: activeLink.b,
          left: activeLink.x - (20 * 16) / 2,
        }}
      >
        <TextInput
          value={activeLink.address}
          onChange={(e) => updateLink(e.target.value)}
          onKeyDown={onLinkKeyDown}
          variant="standard"
          placeholder="Type link address"
          fullWidth
          autoFocus
        />
      </Paper>
    </ClickAwayListener>
  )
}

type Ref = React.RefObject<HTMLDivElement>
export function useLinks(text: str, setText: SetStr, setFocus: SetFocus, setData: SetStr, ref: Ref): UTextLinkEditor {
  const [activeLink, setActiveLink] = useState(new ActiveLink())

  useEffect(() => {
    const cleanUps: Fn[] = []
    safe(ref.current)
      .querySelectorAll('a')
      .forEach((n) => {
        const click = () => window.open(n.getAttribute('href') || '', '_blank')
        n.addEventListener('click', click)
        cleanUps.push(() => n.removeEventListener('click', click))
      })
    return () => cleanUps.forEach((f) => f())
  })

  const saveLink = (exitedBy: InlineEditorExit = 'key') => {
    let newData = text
    if (!activeLink.address) {
      setText(removeTag(text, 'strong')) // no setData
    } else {
      newData = replaceTag(text, 'strong', `a href=${activeLink.address} target="_blank"`)
      setText(newData)
    }

    if (exitedBy === 'click' && newData !== text) setData(newData)
    if (exitedBy === 'key') setFocus({ type: 'start-integer', xOffset: activeLink.text.length + activeLink.offset })

    setActiveLink(new ActiveLink())
  }

  const toggleLink = () => {
    setActiveLink({
      ...cursorOffsetAndSelection(safe(ref.current)),
      ...selectionCoordinates(safe(ref.current)),
      address: '',
    })
    setText(toggleTags(safe(ref.current), 'strong', 'a'))
  }

  const onLinkKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter' && e.key !== 'Escape') return
    e.preventDefault()
    e.stopPropagation()
    saveLink()
  }

  const updateLink = (address: str) => setActiveLink((old) => ({ ...old, address }))

  return { activeLink, saveLink, toggleLink, onLinkKeyDown, updateLink, isActive: !!activeLink.b }
}

class ActiveLink {
  x = 0
  b = 0
  offset = 0
  text = ''
  address = ''
}
