import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { bool, str, strs } from '../../../utils/types'
import { useRef, useState } from 'react'
import { max, safeSplit } from '../../../utils/algorithms'
import { Box, Button, MenuItem } from '@mui/material'
import { UMenu, useMenu } from '../UMenu/UMenu'

export interface UAutocomplete {
  options: strs
  value: str
  placeholder: str
}

export function UAutocomplete({ placeholder, options, value: initialValue }: UAutocomplete) {
  const [value, setValue] = useState(initialValue)
  const width = max(options, (o) => o.length).length * 16
  return (
    <Autocomplete
      disableClearable
      value={value}
      onChange={(_, v) => setValue(v || '')}
      options={options}
      sx={{ width }}
      renderInput={(params) => <TextField {...params} autoFocus variant="standard" placeholder={placeholder} />}
      renderOption={(props, option, { inputValue }) => {
        const parts = highlight(option, inputValue)
        return (
          <li {...props}>
            <div>
              {parts.map((part, index) => (
                <span
                  key={index}
                  style={{
                    fontWeight: part.isBold ? 700 : 400,
                  }}
                >
                  {part.text}
                </span>
              ))}
            </div>
          </li>
        )
      }}
    />
  )
}

type BoldedText = { text: str; isBold: bool }
type BoldedTexts = BoldedText[]

function highlight(option: str, input: str): BoldedTexts {
  if (option === input) return [{ text: option, isBold: true }]

  const parts = option.split(input).filter(Boolean)

  const r: BoldedTexts = []
  for (let i = 0; i < parts.length; i++) {
    r.push({ text: parts[i], isBold: false })
    if (parts.length > 1 && i !== parts.length - 1) r.push({ text: input, isBold: true })
  }

  if (option.startsWith(input)) r.unshift({ text: input, isBold: true })
  if (option.endsWith(input)) r.push({ text: input, isBold: true })

  return r
}

export function SelectText({ placeholder, options, value: initialValue }: UAutocomplete) {
  const ref = useRef<HTMLButtonElement>(null)
  const [value, setValue] = useState(initialValue)
  const { isOpen, toggleOpen, close } = useMenu()
  return (
    <>
      <Button onClick={toggleOpen} ref={ref}>
        {value}
      </Button>
      <UMenu isOpen={isOpen} btnRef={ref} close={close}>
        {options.map((o, i) => (
          <MenuItem value={i} key={i} onClick={() => setValue(o)}>
            {o}
          </MenuItem>
        ))}
      </UMenu>
    </>
  )
}
