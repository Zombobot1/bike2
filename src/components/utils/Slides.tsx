import { ReactNode, useEffect } from 'react'
import Slide from '@material-ui/core/Slide'
import { useMount } from '../../utils/hooks-utils'
import { styled } from '@material-ui/core'
import { useAtom } from 'jotai'
import { atomWithReset, useResetAtom } from 'jotai/utils'
import flattenChildren from 'react-flatten-children'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Children = ReactNode[] //ReactElement<any, any>[]

export interface Slides {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: ReactNode
}

const Container = styled('div', { label: 'Slides' })({
  height: '100%',
  width: '100%',
  overflow: 'hidden',
  position: 'relative',
})

const SlideWrapper = styled('div', { label: 'SlideWrapper' })({
  position: 'absolute',
  height: '100%',
  width: '100%',
})

const slidesA = atomWithReset<Children>([])
const currentSlideA = atomWithReset(0)

export function useSlides(initialSlide = 0) {
  const [currentSlide, setCurrentSlide] = useAtom(currentSlideA)

  const [slides] = useAtom(slidesA)
  const lastIndex = slides.length - 1

  const resetCurrentSlide = useResetAtom(currentSlideA)
  const resetSlides = useResetAtom(slidesA)

  useMount(() => {
    setCurrentSlide(initialSlide)
    return () => {
      resetCurrentSlide()
      resetSlides()
    }
  })

  const slides_ = {
    next: () => setCurrentSlide((cs) => Math.min(cs + 1, lastIndex)),
    prev: () => setCurrentSlide((cs) => Math.max(cs - 1, 0)),
    first: () => setCurrentSlide(0),
    last: () => setCurrentSlide(lastIndex),

    currentSlide,
    isFirst: currentSlide === 0,
    isLast: currentSlide === lastIndex,
  }

  return slides_
}

export function Slides({ children }: Slides) {
  const flatChildren = flattenChildren(children)
  const [_, setSlides] = useAtom(slidesA)
  const [currentSlide] = useAtom(currentSlideA)

  useEffect(() => {
    setSlides(Array.isArray(flatChildren) ? flatChildren : [flatChildren])
  }, [Array.isArray(flatChildren) ? flatChildren.length : false])

  return (
    <Container>
      {Array.isArray(flatChildren) &&
        flatChildren.map((c, i) => (
          <Slide
            key={i}
            direction={i === currentSlide ? 'left' : 'right'}
            in={i === currentSlide}
            mountOnEnter
            unmountOnExit
          >
            <SlideWrapper>{c}</SlideWrapper>
          </Slide>
        ))}
      {!Array.isArray(flatChildren) && (
        <Slide direction="left" in={true} mountOnEnter unmountOnExit>
          <SlideWrapper>{flatChildren}</SlideWrapper>
        </Slide>
      )}
    </Container>
  )
}
