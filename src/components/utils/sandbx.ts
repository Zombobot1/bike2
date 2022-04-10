export function T() {
  // const data = JSON.stringify(safeSplit(longS, '\n\n').map((d) => ({ type: 'some-long-type', data: d, id: uuid() })))
  // console.info(formatBytes(new TextEncoder().encode(data).length)) // 139KB pure data
  return null
}

export default {
  title: 'Sandbox/Sandbox',
}

const _old = `<div class="entry-content">
<p><em>Age Group: 0-6 years</em></p>
<p>Once upon a time there was a cat.  Her name was Pussy . She used to live in a small, beautiful house in a village.</p>
<p>It was summer and the sun was shining brightly in the sky. Pussy, the cat, was getting bored at home and thought, “Why shouldn’t I go out for a drive in the countryside and then to the beach.”</p>
<p>She came out of her house and took out her red-colored car. She started driving towards the beach.</p>
<p>Suddenly she heard a sound –  “<em>maa- maa</em>“.</p>
<p>She looked around and saw , there was a sheep standing by the road.</p>
<p>The sheep asked Pussy, “Hi! Can you drop me to the market please? I need to buy some vegetables and I have missed my bus”.<span id="more-11190"></span></p>
<p>Pussy replied, “Yes off course, please come in”.</p>
<p>Both the cat and the sheep started driving towards the market. They reached the market and Pussy dropped the sheep off.</p>
<p>Pussy thought, “I must rush now otherwise I will be late for the beach.” She started driving again.</p>
<p>Suddenly a big bear came and stopped in front of her car. The bear said, “Where are you going silly cat?”</p>
<p>Pussy was scared and replied, “I am going to the beach”.</p>
<p>The bear said, “Can you take me along with you?”</p>
<p>Pussy thought, “If I say no to him , then he might harm me.” So she said, “Yes Sir, please come in”.</p>
<p>Now both the cat and the bear started towards the beach.</p>
<p>They were about to reach the beach, but suddenly… the car stopped in the middle of the road.</p>
<p>The bear asked the cat, “What happened? Why the car has stopped?”</p>
<p>Pussy replied, “Sir, please wait, let me check”.</p>
<p>Pussy checked the car – she checked under the bonnet and looked at the wheels – but she could not find the problem. She looked around to see if there was anyone she could ask for help.</p>
<p>She saw a monkey sitting on a tree, eating bananas. Pussy asked the monkey, “Can you please help me? My car has stopped suddenly and I need to go to the beach”.</p>
<p>The monkey told her, “Wait, let me finish my bananas , then I will come down’. Both the cat and the bear waited for the monkey  to finish the bananas.</p>
<p>Finally the monkey finished his bananas and came down. He looked around the car and peeked at the engine. He fiddled around with a few wires and soon had the car fixed. The car was now working perfectly.</p>
<p>Pussy and the bear were happy. Now they could go to the  beach.</p>
<p>Pussy said, “Thank you” to the monkey.</p>
<p>Monkey said, “If you are really thankful, then please take me along to the beach with you”.</p>`

const _new_ = `<div class="entry-content">
<p><em>Age Group: 0-6 years</em></p>
<p>Once upon a time there 12 34 56 was a cat.  Her name was Pussy . She used to live in a small, beautiful house in a village.</p>
<p>It was summer and the sun was shining brightly in the sky. Pussy, the cat, was getting bored at home and thought, “Why shouldn’t I go out for a drive in the countryside and then to the beach.”</p>
<p>She came of her house and took out her red-colored car. She started driving towards the beach.</p>
<p>Suddenly she heard a sound –  “<em>maa- maa</em>“.</p>
<p>She looked around and saw , there was a sheep standing by the road.</p>
<p>The sheep asked Pussy, “Hi! Can you drop 32 to the market please? I need to buy some vegetables and I have missed my bus”.<span id="more-11190"></span></p>
<p>Pussy replied, “Yes off 1, please come in”.</p>
<p>Both the cat and the sheep started driving towards the market. They the market and Pussy dropped the sheep off.</p>
<p>Pussy thought, “I must  now otherwise I will be late for the beach.” She started driving again.</p>
<p>Suddenly a big bear came and stopped in front of her car. The bear said, “Where are you going silly cat?”</p>
<p>Pussy was scared and replied, “I am going to the beach”.</p>
<p>The bear said, “Can you take 4me along with you?”</p>
<p>Pussy thought, “If I say no to him , then he might harm me.” So she said, “Yes Sir, please come in”.</p>
<p>Now both the cat and the bear started towards the beach.</p>
<p>They were about to reach the beach, but suddenly… the car stopped in the middle of the road.</p>
<p>The bear asked the cat, “What happened? Why the car has stopped?”</p>
<p>Pussy replied, “23Sir, please wait, let me check”.</p>
<p>Pussy checked car – she checked under the bonnet and looked at the wheels – but she could not find the problem. She looked around to see if there was anyone she could ask for help.</p>
<p>She saw a monkey sitting on a tree, eating bananas. Pussy asked the monkey, “Can you please help me? My car has stopped suddenly and I need to go to the beach”.</p>
<p>The monkey told her, “Wait, let me finish my , then I will3 down’. Both the cat and the bear waited for the monkey  to finish the bananas.</p>
<p>Finally the monkey finished his bananas and came down. He looked around car and 4 at the engine. He fiddled around with a few wires and soon had the car fixed. The car was now working perfectly.</p>
<p>Pussy and the bear were happy. Now they could go to the  beach.</p>
<p>Pussy said, “Thank you” to the monkey.</p>
<p>Monkey said, “If you are really, then please take me along to the beach with you”.</p>`

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
