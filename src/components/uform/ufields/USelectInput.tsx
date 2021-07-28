import { Checkbox, FormControlLabel, Radio } from '@material-ui/core'
import { useValidationColor } from './useValidationColor'
import { Validity } from '../types'

export interface USelectInputP {
  selectMultiple: boolean
  _id: string
  label: string
  onChange: (v: string) => void
  checked: boolean
  validity: Validity
  readonly: boolean
}

export function USelectInput({ selectMultiple, _id, label, validity, onChange, checked, readonly }: USelectInputP) {
  const color = useValidationColor(validity)

  const sx =
    validity === 'NONE'
      ? undefined
      : {
          '& .MuiFormControlLabel-label.Mui-disabled': { color },
          '& .PrivateSwitchBase-root': {
            color: `${color} !important`,
            '&.Mui-checked': { color },
          },
        }

  return (
    <FormControlLabel
      value={label}
      control={selectMultiple ? <Checkbox /> : <Radio />}
      label={label}
      sx={sx}
      checked={checked}
      disabled={readonly}
      onChange={() => onChange(label)}
    />
  )
}
