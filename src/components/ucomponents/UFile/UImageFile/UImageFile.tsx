import { useEffectedState } from '../../../../utils/hooks-utils'
import ImageRoundedIcon from '@material-ui/icons/ImageRounded'
import { srcfy } from '../../../../utils/filesManipulation'
import { UBlockComponent } from '../../types'
import { Dropzone1 } from '../../../utils/Dropzone'
import { useUImageFile } from '../useUFile'
import { styled } from '@material-ui/core'

export function UImageFile({ data, setData }: UBlockComponent) {
  const [src, setSrc] = useEffectedState(data)
  const props = useUImageFile(data, setData, (f) => setSrc(srcfy(f)))

  if (!src) return <Dropzone1 {...props} label="image" icon={<ImageRoundedIcon />} />

  return <Img src={src} alt="uimage" />
}

const Img = styled('img')({
  display: 'block',
  width: '100%',
  borderRadius: 5,
})

// resizing
// on desktop: use initial 100% width in pixels and calculate minification delta in % send it to server
// on mobile: turn off

// const Div = styled('div')({
//   position: 'relative',
// })

// const ResizeHandle = styled('div')({
//   position: 'absolute',
//   top: 0,
//   bottom: 0,
//   cursor: 'col-resize',
//   width: '1rem',
//   userSelect: 'none',
// })

// const Left = styled(ResizeHandle)({
//   left: 0,
// })

// const Right = styled(ResizeHandle)({
//   right: 0,
// })

// const Handle = styled('div')({
//   position: 'absolute',
//   inset: 0,
//   margin: 'auto',
//   width: '50%',
//   height: '4rem',
//   opacity: 0,
//   transition: 'opacity 0.1s ease-in-out',
//   border: `1px solid ${alpha(theme.palette.common.white, 0.8)}`,
//   borderRadius: '10px',
//   backgroundColor: alpha(grey[800], 0.8),
//   userSelect: 'none',
// })

// interface ResizableWidth {
//   width: num
//   children: ReactNode
// }

// function ResizableWidth({ width: initialWidth, children }: ResizableWidth) {
//   const [width, setWidth] = useState(new Width())
//   const [isHovered, setIsHovered] = useState(false)
//   const [isResizing, setIsResizing] = useState(false)

//   useEffect(() => setWidth((old) => ({ ...old, initialWidth })), [initialWidth])

//   useEffect(() => {
//     if (
//       Math.abs(width.needResize - width.previousResize) > 1 &&
//       width.widthBeforeResize + width.needResize * 2 >= width.minWidth
//     ) {
//       setWidth((old) => ({ ...old, width: old.widthBeforeResize + old.needResize * 2, previousResize: old.needResize }))
//     }
//   }, [width.needResize])

//   const onMouseDown =
//     (reverse = false) =>
//     () => {
//       const onMouseMove = (e: MouseEvent) =>
//         setWidth((old) => {
//           return { ...old, needResize: reverse ? old.needResize - e.movementX : old.needResize + e.movementX }
//         })

//       function onMouseUp() {
//         window.removeEventListener('mousemove', onMouseMove)
//         window.removeEventListener('mouseup', onMouseUp)
//         setIsResizing(false)
//       }

//       window.addEventListener('mousemove', onMouseMove)
//       window.addEventListener('mouseup', onMouseUp)
//       setIsResizing(true)
//       setWidth((old) => ({ ...old, widthBeforeResize: old.width, needResize: 0 }))
//     }

//   return (
//     <Div
//       sx={{ width: width.width, height: 300, cursor: isResizing ? 'col-resize' : 'default' }}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <Right onMouseDown={onMouseDown()}>
//         <Handle sx={{ opacity: isHovered ? 1 : 0 }} />
//       </Right>
//       <Left onMouseDown={onMouseDown(true)}>
//         <Handle sx={{ opacity: isHovered ? 1 : 0 }} />
//       </Left>
//       {children}
//     </Div>
//   )
// }

// class Width {
//   widthBeforeResize = 0
//   width = 400
//   needResize = 0
//   previousResize = 0
//   minWidth = 50
// }
// type Block = { children: ReactNode; ref: React.MutableRefObject<HTMLDivElement | null> }
// const Block = (p: Block) => <Box sx={{ width: '100%' }}>{p.children}</Box>

// export const Sandbox = () => {
//   const ref = useRef<HTMLDivElement>(null)
//   return (
//     <Stack direction="row" justifyContent="center" sx={{ width: '1000px', backgroundColor: 'lightgreen' }}>
//       <Block ref={ref}>
//         <ResizableWidth width={ref.current?.offsetWidth || 0}>
//           <Rec stretch={true} />
//         </ResizableWidth>
//       </Block>
//     </Stack>
//   )
//   // wrap sorybook Pane in Memory router
//   // return <SoryBook sories={storify([UCard, UForm, UFormBlock, UChecks, UInput, UTextS, UPageS])} />
// }
