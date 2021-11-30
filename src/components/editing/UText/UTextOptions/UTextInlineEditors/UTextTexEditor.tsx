import { bool, Fn, num, SetStr, str } from '../../../../../utils/types'
import { useEffect, useState } from 'react'
import { TeXEditor } from '../../../../utils/CodeEditor/TeXEditor'
import { Box, styled } from '@mui/material'
import {
  codeOffset,
  htmlToElement,
  removeCode,
  replaceAllCodeToHTML,
  replaceCode,
} from '../../../../utils/Selection/htmlAsStr'
import { renderTex } from '../../../../utils/CodeEditor/renderTex'
import { safe } from '../../../../../utils/utils'
import { insertCode, selectedText, selectionCoordinates } from '../../../../utils/Selection/selection'
import { InlineEditorExit, SetFocus, TexMapRef } from '../../../types'
import { sanitize } from '../../sanitazer'
import { UText_ } from '../../UText_'

export type ToggleTex = (offset: num, o?: { removeSlash: bool }) => void

export interface UTextTexEditor {
  saveTex: (exit?: 'click' | 'key') => void
  updateTex: SetStr
  activeTex: { b: num; x: num; id: str; tex: str }
  readonly: bool
  isActive: bool
  toggleTex: ToggleTex
}

export function UTextTexEditor({ activeTex, updateTex, saveTex, readonly }: UTextTexEditor) {
  return (
    <TexBox
      sx={{
        top: activeTex.b,
        left: activeTex.x - 400 / 16 / 2,
      }}
      data-cy="tex-box"
    >
      <TeXEditor tex={activeTex.tex} setTex={updateTex} close={saveTex} type="small" readonly={readonly} />
    </TexBox>
  )
}

const TexBox = styled(Box, { label: 'TexBox' })({ position: 'absolute', zIndex: 2 })

type Ref = React.RefObject<HTMLDivElement>
export function useTex(
  mapRef: TexMapRef,
  ps: UText_,
  text: str,
  setText: SetStr,
  setFocus: SetFocus,
  refocus: Fn,
  ref: Ref,
): UTextTexEditor {
  const [activeTex, setActiveTex] = useState(new ActiveTex())

  useEffect(() => {
    const el = htmlToElement(`<pre>${ps.data}</pre>`)
    const needRerender = Array.from(el.getElementsByTagName('code'))
      .map((e) => {
        const id = e.getAttribute('data-id') || ''
        if (!mapRef.current.has(id) || mapRef.current.get(id)?.tex !== e.textContent) return e
        return null
      })
      .filter(Boolean) as HTMLElement[]

    needRerender.forEach((e) => {
      const id = e.getAttribute('data-id') || ''
      mapRef.current.set(id, { tex: e.innerHTML, html: renderTex(e.innerHTML) })
    })
    if (!needRerender.length) return

    setText(replaceAllCodeToHTML(ps.data, mapRef.current))
    refocus()
  }, [ps.data])

  useEffect(() => {
    const cleanUps: Fn[] = []
    safe(ref.current)
      .querySelectorAll('code')
      .forEach((n) => {
        const id = n.getAttribute('data-id') || ''

        if (id === activeTex.id) n.classList.add('active')
        else n.classList.remove('active')

        const click = () => {
          const { x: px, y: py } = safe(ref.current).getBoundingClientRect()
          const { x, bottom: b } = n.getBoundingClientRect()
          setActiveTex({
            x: x - px - 40,
            b: b - py + 20,
            id,
            tex: mapRef.current.get(id)?.tex || '',
            offset: codeOffset(text, id),
          })
          setFocus(undefined)
        }

        n.addEventListener('click', click)
        cleanUps.push(() => n.removeEventListener('click', click))
      })
    return () => cleanUps.forEach((f) => f())
  })

  const saveTex = (exitedBy: InlineEditorExit = 'key') => {
    let newData = text
    const target = mapRef.current.get(activeTex.id)

    if (target?.wasUpdated || !target?.tex) {
      const tex = target?.tex || ''
      const html = target?.html || ''

      if (!tex) {
        newData = removeCode(text, activeTex.id)
        mapRef.current.delete(activeTex.id)
      } else {
        newData = replaceCode(text, activeTex.id, html)
      }

      setText(newData)
      ps.addData?.(ps.id, sanitize(newData, mapRef))
    }

    if (exitedBy === 'key') setFocus({ type: 'start-integer', xOffset: activeTex.offset })
    if (exitedBy === 'click' && newData !== text) ps.setData(newData)

    setActiveTex(new ActiveTex())
  }

  const updateTex = (tex: str) => {
    mapRef.current.set(activeTex.id, { tex, html: renderTex(tex), wasUpdated: true })
    const element = document.querySelectorAll(`[data-id="${activeTex.id}"]`)[0]
    element.innerHTML = mapRef.current.get(activeTex.id)?.html || ''
  }

  const toggleTex = (offset: num, { removeSlash = false } = {}) => {
    const id = String(Math.max(...[...Array.from(mapRef.current.keys()), '0'].map(Number)) + 1)
    const { x, b } = selectionCoordinates(safe(ref.current))
    const tex = selectedText() || ''
    const html = renderTex(tex)
    setActiveTex({ id, x, b, offset: offset + 1, tex })
    mapRef.current.set(id, { tex, html })
    if (removeSlash) setText(insertCode(safe(ref.current), id, html, { removeSlashOffset: offset }))
    else setText(insertCode(safe(ref.current), id, html))
  }

  return { activeTex, saveTex, updateTex, toggleTex, isActive: !!activeTex.id, readonly: ps.readonly || false }
}

class ActiveTex {
  x = 0
  b = 0
  offset = 0
  id = ''
  tex = ''
}
