import { Button, ButtonGroup, Stack, TextField } from '@material-ui/core'
import { useState } from 'react'
import { num, nums } from '../../utils/types'
import { Rec } from './rec'
import { Slides, useSlides } from './Slides'

function One() {
  return (
    <Slides>
      <Rec key="1">1</Rec>
    </Slides>
  )
}

function Template1() {
  const slides = useSlides()
  return (
    <Stack spacing={2} sx={{ height: '150px', width: '500px' }}>
      <Slides>
        <Rec key="1">1</Rec>
        <Rec key="2">2</Rec>
        <Rec key="3">3</Rec>
      </Slides>
      <ButtonGroup variant="outlined">
        <Button onClick={slides.first}>First</Button>
        {!slides.isFirst && <Button onClick={slides.prev}>Prev</Button>}
        {!slides.isLast && <Button onClick={slides.next}>Next</Button>}
        <Button onClick={slides.last}>Last</Button>
      </ButtonGroup>
    </Stack>
  )
}

function Template2() {
  const slides = useSlides()
  return (
    <Stack spacing={2} sx={{ height: '150px', width: '500px' }}>
      <Slides>
        <Rec key="1">1</Rec>
        <Rec key="tf" color="white">
          <form onSubmit={(e) => e.preventDefault()}>
            <TextField variant="standard" autoFocus fullWidth type="password" autoComplete="one-time-code" />
          </form>
        </Rec>
        <Rec key="3">3</Rec>
      </Slides>
      <ButtonGroup variant="outlined">
        {!slides.isFirst && <Button onClick={slides.prev}>Prev</Button>}
        {!slides.isLast && <Button onClick={slides.next}>Next</Button>}
      </ButtonGroup>
    </Stack>
  )
}
interface Template3P {
  initialRecs: nums
  initialRec?: num
}

function Template3({ initialRecs, initialRec }: Template3P) {
  const slides = useSlides(initialRec)
  const [recs, setRecs] = useState(initialRecs)

  const delete_ = () => {
    setRecs((rs) => rs.filter((_, i) => i !== slides.currentSlide))
  }

  return (
    <Stack spacing={2} sx={{ height: '150px', width: '500px' }}>
      <Slides>
        {recs.map((r) => (
          <Rec key={r}>{r}</Rec>
        ))}
        <Rec key="I am also a child">I am also a child</Rec>
      </Slides>
      <ButtonGroup variant="outlined">
        <Button onClick={() => setRecs((rs) => [rs[0] - 1, ...rs])}>Insert</Button>
        {!slides.isFirst && <Button onClick={slides.prev}>Prev</Button>}
        {!slides.isLast && <Button onClick={slides.next}>Next</Button>}
        {recs.length > 1 && <Button onClick={delete_}>Delete</Button>}
      </ButtonGroup>
    </Stack>
  )
}

function Template4() {
  const slides = useSlides()
  const [recs, setRecs] = useState<nums>([])

  const insert = () => {
    setRecs((rs) => [rs[0] ? rs[0] - 1 : -1, ...rs])
  }

  return (
    <Stack spacing={2} sx={{ height: '150px', width: '500px' }}>
      <Slides>
        <Rec key="Front">Front</Rec>
        {recs.map((r) => (
          <Rec key={r} color={r % 2 === 0 ? 'red' : 'blue'}>
            {r}
          </Rec>
        ))}
      </Slides>
      <ButtonGroup variant="outlined">
        <Button onClick={insert}>Insert</Button>
        {!slides.isFirst && <Button onClick={slides.prev}>Prev</Button>}
        {!slides.isLast && <Button onClick={slides.next}>Next</Button>}
      </ButtonGroup>
    </Stack>
  )
}

export const OneSlide = () => <One />
export const SlidesOneByOne = () => <Template1 />
export const SlidesWithAutofocus = () => <Template2 />
export const HandlesFrontInsertions = () => <Template3 initialRecs={[1]} />
export const HandlesFirstElementDeletion = () => <Template3 initialRecs={[1, 2]} />
export const HandlesMiddleElementDeletion = () => <Template3 initialRecs={[1, 2, 3]} initialRec={1} />
export const HandlesInsertionAndChange = () => <Template4 />
