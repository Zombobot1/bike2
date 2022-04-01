import { Button, styled } from '@mui/material'
import { useState } from 'react'
import { RStack, TextInput } from '../../../utils/MuiUtils'
import AddLinkRoundedIcon from '@mui/icons-material/AddLinkRounded'
import { str } from '../../../../utils/types'

import { UBlockContent } from '../../types'
import { ResizableWidth } from '../../../utils/ResizableWidth/ResizableWidth'
import { UMediaFileData } from '../../UPage/ublockTypes'

export function UVideoFile({ id, data: d, setData, readonly }: UBlockContent) {
  const data = d as UMediaFileData
  const [link, setLink] = useState('')
  const [hasError, setHasError] = useState(false)
  const onClick = () => {
    const isValid = validate(link)
    if (isValid) setData(id, { src: idFromLink(link) })
    setHasError(!isValid)
  }

  if (!data)
    return (
      <LinkFieldContainer spacing={2}>
        <TextInput
          value={link}
          onChange={(e) => setLink(e.target.value)}
          label="Youtube link"
          sx={{ flex: 1 }}
          color={hasError ? 'error' : 'primary'}
          helperText={hasError ? 'Enter a valid youtube link' : ''}
          error={hasError}
          disabled={readonly}
        />
        <Button endIcon={<AddLinkRoundedIcon />} onClick={onClick} disabled={readonly}>
          Embed
        </Button>
      </LinkFieldContainer>
    )

  return (
    <ResizableWidth
      readonly={readonly}
      width={data.width}
      updateWidth={(w) => setData(id, { width: w })}
      maxWidth={900}
    >
      <Video
        src={`https://www.youtube.com/embed/${data.src}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </ResizableWidth>
  )
}

const LinkFieldContainer = styled(RStack)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.apm('bg'),
  padding: '1rem',
}))

const Video = styled('iframe')(({ theme }) => ({
  width: '100%',
  aspectRatio: '16 / 9',
  borderRadius: theme.shape.borderRadius,
}))

const idFromLink = (link: str) => link.split('&')[0].replace('https://www.youtube.com/watch?v=', '')
const validate = (link: str) => link.includes('https://www.youtube.com/watch?v=')
