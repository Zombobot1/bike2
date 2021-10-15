import { Button, Stack, styled, Typography } from '@mui/material'
import { useRouter } from '../../utils/hooks/useRouter'
import { ReactComponent as Image404SVG } from './404.svg'
import { ReactComponent as LeftBlobSVG } from './leftBlob.svg'
import { ReactComponent as RightBlobSVG } from './rightBlob.svg'
import { ReactComponent as WaveSVG } from './wave.svg'

const LeftBlob = styled(LeftBlobSVG)(({ theme }) => ({
  position: 'absolute',
  display: 'none',
  left: 0,
  top: 0,
  width: '23rem',
  path: {
    fill: theme.palette.primary.main,
  },
  [`${theme.breakpoints.up('md')}`]: {
    display: 'block',
  },
}))

const RightBlob = styled(RightBlobSVG)(({ theme }) => ({
  position: 'absolute',
  display: 'none',
  right: 0,
  bottom: 0,
  width: '23rem',
  path: {
    fill: theme.palette.primary.main,
  },
  [`${theme.breakpoints.up('md')}`]: {
    display: 'block',
  },
}))

const Wave = styled(WaveSVG)(({ theme }) => ({
  position: 'absolute',
  bottom: -10,

  path: {
    fill: theme.palette.primary.main,
  },

  [`${theme.breakpoints.up('md')}`]: {
    display: 'none',
  },
}))

const Image404 = styled(Image404SVG)(({ theme }) => ({
  width: '25rem',
  '.primary': {
    fill: theme.palette.primary.main,
  },
  '.primary-l': {
    fill: theme.palette.primary.light,
  },
  '.primary-d': {
    fill: theme.palette.primary.dark,
  },
  [`${theme.breakpoints.up('md')}`]: {
    width: '45rem',
  },
}))

const Page = styled('div')({
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
  height: '100%',
})

const Content = styled(Stack)({
  position: 'relative',
  width: '100%',
  height: '100%',
})

const Whooops = styled(Typography)({
  fontWeight: 600,
  fontSize: '2rem',
})

const Text = styled(Typography)({
  fontWeight: 600,
  fontSize: '1.2rem',
})

export function Page404() {
  const { history } = useRouter()
  return (
    <Page>
      <Wave />
      <LeftBlob />
      <Content justifyContent="center" alignItems="center" spacing={2}>
        <Image404 />
        <Whooops>Whooops!</Whooops>
        <Text color="text.secondary">The page you are looking for is not found :(</Text>
        <Button
          onClick={() => {
            console.log('pushing')
            history.push('/')
          }}
          variant="contained"
          size="large"
          data-cy="go-home"
        >
          Go back home
        </Button>
      </Content>
      <RightBlob />
    </Page>
  )
}
