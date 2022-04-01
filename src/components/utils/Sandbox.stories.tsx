export function T() {
  // return <App />
  return null
}

// function App() {
//   const Wrapper = styled(Stack)`
//     background: #1f2937;
//     width: 50%;
//     height: 100%;
//   `

//   const Item = styled('div')`
//     background: #f9fafb;
//     width: 200px;
//     height: 250px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     font-size: 80px;
//     text-shadow: 0 10px 10px #d1d5db;
//     box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
//     border-radius: 8px;
//     transform: ${() => {
//       let rotation = Math.random() * (5 - -5) + -5
//       return `rotate(${rotation}deg)`
//     }};
//   `

//   return (
//     <div style={{ width: '100%', height: '100%' }}>
//       <Wrapper onVote={(item, vote) => console.info(item.props, vote)}>
//         <Item data-value="waffles">🧇</Item>
//         <Item data-value="pancakes">🥞</Item>
//         <Item data-value="donuts">🍩</Item>
//       </Wrapper>
//     </div>
//   )
// }

// const Frame = styled('div')`
//   width: 100%;
//   overflow: hidden;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   position: relative;
// `

// export const Stack = ({ onVote, children, ...props }) => {
//   const [stack, setStack] = useState(flattenChildren(children))

//   // return new array with last item removed
//   const pop = (array) => {
//     return array.filter((_, index) => {
//       return index < array.length - 1
//     })
//   }

//   const handleVote = (item, vote) => {
//     // update the stack
//     let newStack = pop(stack)
//     setStack(newStack)

//     // run function from onVote prop, passing the current item and value of vote
//     onVote(item, vote)
//   }

//   return (
//     <>
//       <Frame {...props}>
//         {stack.map((item, index) => {
//           let isTop = index === stack.length - 1
//           return (
//             <Card
//               drag={isTop} // Only top card is draggable
//               key={item.key || index}
//               onVote={(result) => handleVote(item, result)}
//             >
//               {item}
//             </Card>
//           )
//         })}
//       </Frame>
//     </>
//   )
// }

// const StyledCard = styled(motion.div)`
//   position: absolute;
// `

// export const Card = ({ children, style, onVote, id, ...props }) => {
//   // motion stuff
//   const cardElem = useRef(null)

//   const x = useMotionValue(0)
//   const controls = useAnimation()

//   const [constrained, setConstrained] = useState(true)

//   const [direction, setDirection] = useState()

//   const [velocity, setVelocity] = useState()

//   const getVote = (childNode, parentNode) => {
//     const childRect = childNode.getBoundingClientRect()
//     const parentRect = parentNode.getBoundingClientRect()
//     let result = parentRect.left >= childRect.right ? false : parentRect.right <= childRect.left ? true : undefined
//     return result
//   }

//   // determine direction of swipe based on velocity
//   const getDirection = () => {
//     return velocity >= 1 ? 'right' : velocity <= -1 ? 'left' : undefined
//   }

//   const getTrajectory = () => {
//     setVelocity(x.getVelocity())
//     setDirection(getDirection())
//   }

//   const flyAway = (min) => {
//     const flyAwayDistance = (direction) => {
//       const parentWidth = cardElem.current.parentNode.getBoundingClientRect().width
//       const childWidth = cardElem.current.getBoundingClientRect().width
//       return direction === 'left' ? -parentWidth / 2 - childWidth / 2 : parentWidth / 2 + childWidth / 2
//     }

//     if (direction && Math.abs(velocity) > min) {
//       setConstrained(false)
//       controls.start({
//         x: flyAwayDistance(direction),
//       })
//     }
//   }

//   useEffect(() => {
//     const unsubscribeX = x.onChange(() => {
//       const childNode = cardElem.current
//       const parentNode = cardElem.current.parentNode
//       const result = getVote(childNode, parentNode)
//       result !== undefined && onVote(result)
//     })

//     return () => unsubscribeX()
//   })

//   return (
//     <StyledCard
//       animate={controls}
//       dragConstraints={constrained && { left: 0, right: 0, top: 0, bottom: 0 }}
//       dragElastic={1}
//       ref={cardElem}
//       style={{ x }}
//       onDrag={getTrajectory}
//       onDragEnd={() => flyAway(500)}
//       whileTap={{ scale: 1.1 }}
//       {...props}
//     >
//       {children}
//     </StyledCard>
//   )
// }

export default {
  title: 'Sandbox/Sandbox',
}
