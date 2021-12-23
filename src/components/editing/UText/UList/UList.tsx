import { Stack, styled, Typography } from '@mui/material'
import { UListDTO, UText } from '../types'
import { UText_ } from '../UText_'
import FiberManualRecordRoundedIcon from '@mui/icons-material/FiberManualRecordRounded'
import { Box } from '@mui/system'
import { useReactiveObject } from '../../../utils/hooks/hooks'
import { ucast } from '../../../../utils/utils'
import { num, str } from '../../../../utils/types'
import { KeyboardEvent, ReactNode } from 'react'
import ArrowRightRoundedIcon from '@mui/icons-material/ArrowRightRounded'
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded'

export function UList(ps: UText) {
  const [data] = useReactiveObject(ucast(ps.data, new UListDTO()))
  const setText = (d: str) => ps.setData(JSON.stringify({ ...data, text: d }))
  const setOffset = (o: num) => ps.setData(JSON.stringify({ ...data, offset: o }))

  function handleTab(e: KeyboardEvent<HTMLInputElement>, atStart = false) {
    if (!atStart || e.key !== 'Tab') return
    e.preventDefault()
    if (e.shiftKey) {
      if (data.offset === 1) ps.setType('text', data.text, 'start')
      else if (data.offset > 1) setOffset(data.offset - 1)
    } else setOffset(data.offset + 1)
    ps.openToggleParent?.(ps.id)
  }

  let leftPart = <Box sx={{ minWidth: 2 * data.offset + 'rem' }} />
  if (ps.type === 'bullet-list') {
    leftPart = (
      <LeftPartContainer offset={data.offset}>
        <FiberManualRecordRounded />
      </LeftPartContainer>
    )
  } else if (ps.type === 'numbered-list') {
    let index = 1
    if (ps.previousBlockInfo?.offset === data.offset) index += ps.previousBlockInfo?.typesStrike || 0
    leftPart = (
      <LeftPartContainer offset={data.offset}>
        <Number>{index + '.'}</Number>
      </LeftPartContainer>
    )
  } else if (ps.type === 'toggle-list') {
    leftPart = (
      <LeftPartContainer offset={data.offset}>
        <IconBox onClick={() => ps.toggleListOpen?.(ps.id)}>
          {ps.isToggleOpen ? <ArrowDropDownRoundedIcon /> : <ArrowRightRoundedIcon />}
        </IconBox>
      </LeftPartContainer>
    )
  }

  return (
    <Stack direction="row" sx={{ flex: 1 }}>
      {leftPart}
      <UText_
        {...ps}
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

const FiberManualRecordRounded = styled(FiberManualRecordRoundedIcon)(({ theme }) => ({
  width: '0.5rem',
  height: '0.5rem',
  [`${theme.breakpoints.up('sm')}`]: { width: '0.65rem', height: '0.65rem' },
}))

const Number = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  [`${theme.breakpoints.up('sm')}`]: { fontSize: '1.25rem' },
}))

const IconBox = styled(Box)(({ theme }) => ({
  width: '17px',
  height: '17px',
  borderRadius: '4px',
  transition: 'background-color 0.1s ease-in-out',
  color: theme.apm('secondary'),
  cursor: 'pointer',

  ':hover': {
    backgroundColor: theme.apm('200'),
  },

  '.MuiSvgIcon-root': {
    width: '23px',
    height: '23px',
    transform: 'scale(1.3)',
    transition: 'transform 0.2s ease-in-out',
  },
}))
