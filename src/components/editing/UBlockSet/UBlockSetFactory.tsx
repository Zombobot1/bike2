import { useEffect, useState } from 'react'
import { fn, Fn, str } from '../../../utils/types'
import { EditableUtility } from '../../utils/EditableText/EditableUtility'
import { useUPageFocus } from '../UPage/hooks/useUPageFocus'

export interface UBlockSetFactory {
  addNewBlock: (data?: str) => void
  onBackspace: Fn
  placeholder?: str
  onClick: Fn
}

export function UBlockSetFactory(ps: UBlockSetFactory) {
  const { activeBlock } = useUPageFocus()
  const [focus, setFocus] = useState(0)
  useEffect(() => setFocus((old) => (activeBlock.id === 'factory' ? old + 1 : old)), [activeBlock])

  return (
    <EditableUtility
      type="factory"
      placeholder={ps.placeholder || "Type '/' for commands"}
      hidePlaceholder={!ps.placeholder}
      text=""
      setText={fn}
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
