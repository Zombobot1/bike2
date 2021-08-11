import { useEffectedState } from '../../../../utils/hooks-utils'
import ImageRoundedIcon from '@material-ui/icons/ImageRounded'
import { srcfy } from '../../../../utils/filesManipulation'
import { UBlockComponent } from '../../types'
import { Dropzone1 } from '../../../utils/Dropzone'
import { useUImageFile } from '../useUFile'

export function UImageFile({ data, setData }: UBlockComponent) {
  const [src, setSrc] = useEffectedState(data)
  const props = useUImageFile(data, setData, (f) => setSrc(srcfy(f)))

  if (!src) return <Dropzone1 {...props} label="image" icon={<ImageRoundedIcon />} />

  return <img src={src} alt="uimage" />
}
