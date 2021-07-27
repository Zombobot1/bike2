import { ReactElement, ReactNodeArray, useEffect } from 'react'
import Slide from '@material-ui/core/Slide'
import { useMount } from '../../utils/hooks-utils'
import { styled } from '@material-ui/core'
import { atom, useAtom } from 'jotai'
import flattenChildren from 'react-flatten-children'
import { num } from '../../utils/types'
import { usePrevious } from './hooks/usePrevious'

type Child = ReactElement
type Children = Child[]

export interface Slides {
  children: Array<ReactNodeArray | ReactElement> | ReactElement
  timeout?: num
}

type Direction = 'forward' | 'backward'

class SlidesS {
  slides: Children = []
  currentSlide = 0
  insertingAt = -1
  removingAt = -1
  direction: Direction = 'forward'
}

const slidesA = atom(new SlidesS())

function useSlides_() {
  const [slidesS, setSlidesS] = useAtom(slidesA)
  const [currentSlide, setCurrentSlide] = [
    slidesS.currentSlide,
    (cs: num, d: Direction = 'forward') => setSlidesS((s) => ({ ...s, currentSlide: cs, direction: d })),
  ]

  const prevState = usePrevious(slidesS)

  return { slidesS, setSlidesS, currentSlide, setCurrentSlide, prevState }
}

export function useSlides(initialSlide = 0) {
  const { slidesS, currentSlide, setCurrentSlide, setSlidesS } = useSlides_()

  const slides = slidesS.slides
  const lastIndex = slides.length - 1

  useMount(() => {
    setCurrentSlide(initialSlide)
    return () => setSlidesS(new SlidesS())
  })

  return {
    next: () => setCurrentSlide(Math.min(currentSlide + 1, lastIndex)),
    prev: () => setCurrentSlide(Math.max(currentSlide - 1, 0), 'backward'),
    first: () => {
      if (currentSlide !== 0) setCurrentSlide(0, 'backward') // backward breaks flow if first() is called in the beginning
    },
    last: () => setCurrentSlide(lastIndex),

    currentSlide,
    isFirst: currentSlide === 0,
    isLast: currentSlide === lastIndex,
  }
}

function findRemovedI(initial: Children, removed: Children) {
  let i = 0
  while (removed[i].key === initial[i].key) i++
  return i
}

export function Slides({ children, timeout = 200 }: Slides) {
  const flatChildren = flattenChildren(children) as Children
  const { slidesS, currentSlide, setSlidesS, prevState } = useSlides_()

  useEffect(() => {
    if (prevState === undefined) setSlidesS((s) => ({ ...s, slides: flatChildren }))
    else if (flatChildren.length > prevState.slides.length) {
      setSlidesS((s) => ({
        ...s,
        insertingAt: 0,
        currentSlide: s.currentSlide + 1,
        slides: flatChildren,
      }))
    } else {
      setSlidesS((s) => ({
        ...s,
        removingAt: findRemovedI(slidesS.slides, flatChildren),
        currentSlide: s.currentSlide + 1,
      }))
    }
  }, [Array.isArray(flatChildren) ? flatChildren.length : false])

  useEffect(() => {
    if (flatChildren.length !== slidesS.slides.length) return
    setSlidesS((s) => ({ ...s, slides: flatChildren }))
  }, [JSON.stringify(flatChildren.map((c) => c.props))])

  useEffect(() => {
    if (slidesS.insertingAt > -1) {
      setTimeout(() => {
        setSlidesS((s) => ({ ...s, insertingAt: -1, currentSlide: s.currentSlide - 1, direction: 'backward' }))
      }, 0) // anomaly: without setTimeout animation gets broken
    }
  }, [slidesS.insertingAt])

  useEffect(() => {
    if (slidesS.removingAt > -1) {
      setTimeout(() => {
        setSlidesS((s) => ({
          ...s,
          removingAt: -1,
          slides: s.slides.filter((_, i) => i !== slidesS.removingAt),
          currentSlide: s.currentSlide - 1,
        }))
      }, timeout)
    }
  }, [slidesS.removingAt])

  return (
    <Container>
      {Array.isArray(flatChildren) &&
        slidesS.slides.map((c, i) => (
          <Slide
            key={c.key}
            direction={direction(i, currentSlide, slidesS.direction)}
            in={i === currentSlide}
            timeout={slidesS.insertingAt > -1 ? 0 : timeout}
            mountOnEnter
            unmountOnExit
          >
            <SlideWrapper>{c}</SlideWrapper>
          </Slide>
        ))}
      {!Array.isArray(flatChildren) && (
        <Slide direction="left" in={true}>
          <SlideWrapper>{flatChildren}</SlideWrapper>
        </Slide>
      )}
    </Container>
  )
}

function direction(i: num, currentSlide: num, direction: Direction): 'left' | 'right' {
  if (direction === 'backward') return i === currentSlide ? 'right' : 'left'
  return i === currentSlide ? 'left' : 'right'
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
