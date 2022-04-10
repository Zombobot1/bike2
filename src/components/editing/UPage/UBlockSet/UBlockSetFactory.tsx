import { useEffect, useState } from 'react'
import { str, Fn, f } from '../../../../utils/types'
import { EditableUtility } from '../../../utils/EditableText/EditableUtility'
import { useUPageCursor } from '../useUPageInfo'

export interface UBlockSetFactory {
  addNewBlock: (data?: str) => void
  onBackspace: Fn
  placeholder?: str
  onClick: Fn
}

export function UBlockSetFactory(ps: UBlockSetFactory) {
  const { cursor } = useUPageCursor()
  const [focus, setFocus] = useState(0)

  useEffect(() => setFocus((old) => (cursor.focus?.id === 'factory' ? old + 1 : old)), [cursor.focus])

  return (
    <EditableUtility
      type="factory"
      placeholder={ps.placeholder || "Type '/' for commands"}
      hidePlaceholder={!ps.placeholder}
      text=""
      setText={f}
      onEnter={ps.addNewBlock}
      createBlock={ps.addNewBlock}
      onBackspace={ps.onBackspace}
      onArrowUp={ps.onBackspace}
      focus={focus}
      onClick={ps.onClick}
      cy="ublock-f"
    />
  )
}
