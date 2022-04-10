import { bool, num, str } from '../../utils/types'

const DAY1 = 86_400
const DAY2 = DAY1 * 2
const DAY3 = DAY1 * 3
const DAY7 = DAY1 * 7
const DAY15 = DAY1 * 15
const DAY30 = DAY1 * 30

interface ScheduleStage {
  id: str
  color: str
  interval: num
  deleted?: bool
}
type ScheduleStages = ScheduleStage[]

interface Schedule {
  name: str
  stages: ScheduleStages
}

const usual: Schedule = {
  name: 'Usual',
  stages: [
    { id: 'error-RBJn', color: '#FC5C5C', interval: 0 },
    { id: 'day1-zXLG', color: '#FCA95C', interval: DAY1 },
    { id: 'day2-FBgk', color: '#FFE602', interval: DAY2 },
    { id: 'day3-zuYt', color: '#98D92D', interval: DAY3 },
    { id: 'day7-V1JQ', color: '#34E1F9', interval: DAY7 },
    { id: 'day15-wNC5', color: '#6C38FF', interval: DAY15 },
    { id: 'day30-U4WD', color: '#B251FF', interval: DAY30 },
  ],
}

const short: Schedule = {
  name: 'Short',
  stages: [
    { id: 'error-dYxV', color: '#FC5C5C', interval: 0 },
    { id: 'day1-tU7W', color: '#FCA95C', interval: DAY1 },
    { id: 'day7-Fkl3', color: '#34E1F9', interval: DAY7 },
    { id: 'day30-cbpK', color: '#B251FF', interval: DAY30 },
  ],
}

export const defaultSchedules = {
  usual,
  short,
}

// const scheduleNewCard = (schedule: Schedule, e: CardEstimation): CardStage => {
//   let stageIndex = null
//   if (e === 'BAD') stageIndex = 0
//   else stageIndex = e === 'EASY' ? 2 : 1
//   return getCardStageFromScheduleStage(schedule.stages[stageIndex])
// }

// const scheduleStudyingCard = ({ schedule, currentStage, priority }: Card, e: CardEstimation): CardStage => {
//   if (!currentStage) throw new ConsistencyE('Studying card cannot exist without a stage')

//   let nextStage = null
//   if (e === 'BAD') {
//     if (priority === 'HIGH') nextStage = schedule.errorStage
//     else if (priority === 'LOW') nextStage = getNextStage(schedule, currentStage)
//     else nextStage = getErrorStage(schedule, currentStage)
//   } else if (e === 'POOR') {
//     if (priority === 'LOW') nextStage = getNextStage(schedule, currentStage)
//     else nextStage = currentStage
//   } else if (e === 'EASY') nextStage = getNextStage(schedule, getNextStage(schedule, currentStage))
//   else nextStage = getNextStage(schedule, currentStage)
//   return getCardStageFromScheduleStage(nextStage)
// }

// const scheduleRepeatingCard = (card: Card, e: CardEstimation): CardStage => {
//   if (!card.currentStage) throw new ConsistencyE('Repeating card cannot exist without a stage')

//   const { _id, color, timeInterval, stageType } = card.currentStage
//   let nextStage: ScheduleStage = { _id, color, timeInterval, stageType }

//   let timeMultiplier = PRIORITY_AND_TIME_MULTIPLIER[card.priority]
//   if (e === 'EASY') timeMultiplier *= 2
//   else if (e === 'POOR') timeMultiplier = 1
//   else if (e === 'BAD') {
//     const newInterval = nextStage.timeInterval * (1 / timeMultiplier)
//     if (newInterval <= card.schedule.lastStage.timeInterval) {
//       nextStage = getPreviousStage(card.schedule, card.currentStage)
//       timeMultiplier = 1
//     } else timeMultiplier = 1 / timeMultiplier
//   }

//   nextStage.timeInterval *= timeMultiplier

//   return getCardStageFromScheduleStage(nextStage)
// }

// const scheduleFailedNewCard = (schedule: Schedule, currentStage: CardStage, e: CardEstimation): CardStage => {
//   const nextStage = e === 'BAD' ? currentStage : schedule.firstStage
//   return getCardStageFromScheduleStage(nextStage)
// }

// const scheduleFailedCard = (schedule: Schedule, e: CardEstimation, currentStage?: CardStage): CardStage => {
//   if (!currentStage) throw new ConsistencyE('Failed card cannot exist without a stage')
//   if (!currentStage.previousStageId) return scheduleFailedNewCard(schedule, currentStage, e)

//   let nextStage = null
//   const stageBeforeFailure = getStageById(schedule, currentStage.previousStageId)
//   const stageBeforeStageBeforeFailure = getPreviousStage(schedule, stageBeforeFailure)
//   if (e === 'BAD') {
//     nextStage = currentStage
//     nextStage.previousStageId = stageBeforeStageBeforeFailure._id
//   } else nextStage = stageBeforeStageBeforeFailure
//   return getCardStageFromScheduleStage(nextStage)
// }

// export const scheduleCard = (c: Card, e: CardEstimation): CardStage => {
//   switch (c.repetitionStatus) {
//     case 'NEW':
//       return scheduleNewCard(c.schedule, e)
//     case 'STUDYING':
//       return scheduleStudyingCard(c, e)
//     case 'FAILED':
//       return scheduleFailedCard(c.schedule, e, c.currentStage)
//     case 'REPEATING':
//       return scheduleRepeatingCard(c, e)
//     default:
//       throw new ConsistencyE('Unknown card status')
//   }
// }
