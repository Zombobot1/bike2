import { Box, Popper, styled, Typography, useTheme } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { UBlockImplementation } from '../types'
import katex from 'katex'
import 'katex/dist/katex.css'

import { useReactive } from '../../utils/hooks/hooks'
import { safe } from '../../../utils/utils'
import { ReactComponent as TEXI } from '../UBlock/BlockAutocomplete/tex.svg'
import { RStack, SVGI } from '../../utils/MuiUtils'

import { TeXEditor } from '../../utils/CodeEditor/TeXEditor'
import { PaddedBox } from '../UBlock/PaddedBox'

export function UEquation({ data, setData, readonly }: UBlockImplementation) {
  const [eq, setEq] = useReactive(data)
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef(null)
  const latexRef = useRef(null)
  const theme = useTheme()

  useEffect(() => {
    if (eq) katex.render(eq, safe(latexRef.current), { displayMode: true, throwOnError: false })
  }, [eq])

  const close = () => {
    if (eq !== data) setData(eq)
    setIsOpen(false)
  }

  return (
    <PaddedBox>
      <MathBox sx={{ backgroundColor: eq ? 'default' : theme.apm('bg') }} ref={ref} onClick={() => setIsOpen(true)}>
        {!eq && (
          <RStack spacing={2}>
            <TEX fontSize="large" />
            <Typography color="text.secondary">Click to add a TeX equation</Typography>
          </RStack>
        )}
        {eq && <Box ref={latexRef} sx={{ width: '100%', height: '100%' }} />}
        <Popper open={isOpen} anchorEl={ref.current}>
          <TeXEditor tex={eq} setTex={setEq} close={close} type="big" readonly={readonly} />
        </Popper>
      </MathBox>
    </PaddedBox>
  )
}

const TEX = SVGI(TEXI)

const MathBox = styled(Box)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  padding: '0.5rem 0.25rem',
  cursor: 'pointer',

  ':hover': {
    backgroundColor: theme.apm('bg'),
  },

  ':active': {
    backgroundColor: theme.apm('bg-hover'),
  },

  '.katex': {
    fontSize: '1.25rem',
  },

  [`${theme.breakpoints.up('sm')}`]: {
    padding: '1rem 0.5rem',
    '.katex': {
      fontSize: '1.75rem',
    },
  },
}))
