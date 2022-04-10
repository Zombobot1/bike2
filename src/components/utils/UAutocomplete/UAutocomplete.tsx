import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { bool, num, str, strs } from '../../../utils/types'
import { useState } from 'react'
import { max } from '../../../utils/algorithms'
import { Button } from '@mui/material'
import { LongMenu, useLongMenu } from '../UMenu/LongMenu'
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded'

export interface UAutocomplete {
  options: strs
  selected: str
  onSelect: (t: str, i: num) => void
  placeholder: str
  width?: str
}

export function UAutocomplete({ options, selected, onSelect, placeholder, width }: UAutocomplete) {
  const ps = useLongMenu(options, selected, onSelect)

  return (
    <>
      <Button
        ref={ps.btnRef}
        onClick={ps.toggleOpen}
        sx={{ textTransform: 'none', '.MuiButton-endIcon': { margin: '0 !important' } }}
        endIcon={<ArrowDropDownRoundedIcon />}
      >
        {ps.selectedOption}
      </Button>
      <LongMenu {...ps} placeholder={placeholder} disablePortal={true} sx={{ width }} />
    </>
  )
}

// problem: popper sometimes overlaps textfield
export function MUIBasedAutocomplete({ placeholder, options, selected: initialValue }: UAutocomplete) {
  const [value, setValue] = useState(initialValue)
  const width = max(options, (o) => o.length).length * 16
  return (
    <Autocomplete
      disablePortal
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
