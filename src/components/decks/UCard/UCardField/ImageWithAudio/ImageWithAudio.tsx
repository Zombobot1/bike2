import { IconButton, styled } from '@material-ui/core'
import VolumeUpRoundedIcon from '@material-ui/icons/VolumeUpRounded'
import { ReactComponent as LeftRounding } from './leftImageOuterCircle.svg'
import { ReactComponent as RightRounding } from './rightImageOuterCircle.svg'
import fluffy from '../../../../../content/fluffy.jpg'

const Img = styled('img')({
  display: 'block',
  width: '100%',
  borderRadius: 8,
})

const BtnWrapper = styled('div')({
  position: 'absolute',
  bottom: -23,
  left: '50%',
  transform: 'translateX(-50%)',
  borderRadius: '50%',
  backgroundColor: 'white',
})

const Left = styled(LeftRounding)({
  position: 'absolute',
  top: 15,
  left: -8,
})

const Right = styled(RightRounding)({
  position: 'absolute',
  top: 15,
  right: -8,
})

const ImgWithBtn = styled('div')({
  position: 'relative',
  width: '100%',
})

export function ImageWithAudio() {
  return (
    <div style={{ width: '458px' }}>
      <ImgWithBtn>
        <Img src={fluffy} alt="f" />
        <BtnWrapper>
          <Left />
          <IconButton color="primary">
            <VolumeUpRoundedIcon sx={{ width: 30, height: 30 }} />
          </IconButton>
          <Right />
        </BtnWrapper>
      </ImgWithBtn>
    </div>
  )
}
