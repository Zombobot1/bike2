import { Stack, Typography } from '@mui/material'
import { UListDTO, UText } from '../types'
import { UText_ } from '../UText_'
import FiberManualRecordRoundedIcon from '@mui/icons-material/FiberManualRecordRounded'
import { Box } from '@mui/system'
import { useReactiveObject } from '../../../utils/hooks/hooks'
import { cast } from '../../../../utils/utils'
import { num, str } from '../../../../utils/types'
import { KeyboardEvent, ReactNode, useEffect } from 'react'

export function UList(props: UText) {
  const [data] = useReactiveObject(cast(props.data, new UListDTO()))
  const setText = (d: str) => props.setData(JSON.stringify({ ...data, text: d }))
  const setOffset = (o: num) => props.setData(JSON.stringify({ ...data, offset: o }))

  useEffect(() => {
    if (props.addInfo) props.addInfo(props.id, { offset: data.offset, type: props.type })
  }, [data.offset])

  function handleTab(e: KeyboardEvent<HTMLInputElement>, atStart = false) {
    if (!atStart || e.key !== 'Tab') return
    e.preventDefault()
    if (e.shiftKey) {
      if (data.offset === 1) props.setType('text', data.text, 'start')
      else if (data.offset > 1) setOffset(data.offset - 1)
    } else setOffset(data.offset + 1)
  }

  let leftPart = <Box sx={{ minWidth: 2 * data.offset + 'rem' }} />
  if (props.type === 'bullet-list') {
    leftPart = (
      <LeftPartContainer offset={data.offset}>
        <FiberManualRecordRoundedIcon sx={{ width: '0.75rem', height: '0.75rem' }} />
      </LeftPartContainer>
    )
  } else if (props.type === 'numbered-list') {
    let index = 1
    if (props.previousBlockInfo?.offset === data.offset) index += props.previousBlockInfo?.typesStrike || 0
    leftPart = (
      <LeftPartContainer offset={data.offset}>
        <Typography sx={{ fontSize: '1.35rem' }}>{index + '.'}</Typography>
      </LeftPartContainer>
    )
  }

  return (
    <Stack direction="row" sx={{ flex: 1 }}>
      {leftPart}
      <UText_
        {...props}
        data={data.text}
        offset={data.offset}
        setData={setText}
        placeholder="List"
        component="pre"
        handleKeyDown={handleTab}
      />
    </Stack>
  )
}

function LeftPartContainer({ children, offset }: { children: ReactNode; offset: num }) {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{ paddingLeft: 0.75 + 2 * (offset - 1) + 'rem', paddingRight: '0.75rem' }}
    >
      {children}
    </Stack>
  )
}
