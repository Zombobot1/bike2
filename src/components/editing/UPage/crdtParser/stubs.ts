import { _base64ToState } from './crdtParser'

// parseStateFromServer(getInitialUPageState('red'))
const empty = `AAAGzuHOpxAAAQIABScBBAAnJh9yb290bmFtZXJvb3Rjb2xvcnJlZHJvb3R1YmxvY2tzRAEFAwQHBQEBAAABA0IAAAABBAAA`
const threeSimpleBlocks = `AAAW1suc5h0ApPeC2QSWy5zmHeT3gtkEDBACCEoBAAZGCgEABkYKAQAGAB0nAQQAJwAHACgBJwAEAIcAKAEnAAQAhwAoAScABFNAcm9vdG5hbWVyb290Y29sb3JyZWRyb290dWJsb2Nrc2lkdHlwZWRhdGEwaWR0eXBlZGF0YTFpZHR5cGVkYXRhMkQBBQMEBwJEAAECRAABAkQAAQcBAQAAAQAACUIAAAECAQIBAgJBBAIEAA8AdwEwdwR0ZXh0dwExdwR0ZXh0dwEydwR0ZXh0AA==`
const one203Merged = `AAAW0ev2nRoAv7GFqQ6R6/adGv+xhakOERUCCEoBAAZGCgEABkYKAQAGRgoBAAYAJScBBAAnAAcAKAEnAAQAhwAoAScABACHACgBJwAEAIcAKAEnAARiS3Jvb3RuYW1lcm9vdGNvbG9ycmVkcm9vdHVibG9ja3NpZHR5cGVkYXRhMWlkdHlwZWRhdGEyaWR0eXBlZGF0YTBpZHR5cGVkYXRhM0QBBQMEBwJEAAECRAABAkQAAQJEAAEHAQEAAAEAAAtCAAABAgECAQIBAgJBBgIEABQAdwExdwR0ZXh0dwEydwR0ZXh0dwEwdwR0ZXh0dwEzdwR0ZXh0AA==`
const niceCat = `AAAWrY63+BuHx9/UG+2Ot/gbAsfH39QbAAYKSgEABkQADQcAKAEnAAQAJwEEACc8MWlkdHlwZWRhdGFuaWNlIGNhdHJvb3RuYW1lcm9vdGNvbG9ycmVkcm9vdHVibG9ja3MCRAAIRAEFAwQHBwAEAQEAAAEEAUIBAAJBAAIFAHcIbmljZSBjYXR3BHRleHQEAAA=`
const twoFiles = `AAAW9KKTqB0AmMGU7gm0opOoHdjBlO4JDRECCEoBAAYCQghOFgEABgJCCAAdJwEEACcABwAoAScBBAAnAAQAhwAoAScBBAAnAAReS3Jvb3RuYW1lcm9vdGNvbG9ycmVkcm9vdHVibG9ja3NpZHR5cGVkYXRhbmFtZWYxc3JjLnJ1aWR0eXBlZGF0YW5hbWVmMnNyYy5ydUQBBQMEBwJEAQJDAAJEAQJDAAcBAQAAAQAAC0IAAEEAQgBBAEIAAkECAgQAEAB3ATF3BGZpbGV3ATJ3BGZpbGUA`
const mcqSimple = `AAAWotu/mxucjMr8BeLbv5sbDdyMyvwFABEKSgEABgJCBkYKAkwSAgAGXgAhBwAoAScBBAAnAAQAJwAHAAQAJwAHAAQAhwAEACcBBAAna1hpZHR5cGVkYXRhcXVlc3Rpb25xZXhwbGFuYXRpb25lY29ycmVjdEFuc3dlcm8xb3B0aW9uc28xbzJyb290bmFtZXJvb3Rjb2xvcnJlZHJvb3R1YmxvY2tzAkQACAELAQ0CB0IARAEFAwQHBwAOAQEAAAEKQQBCAAACAEICAAJBAAIQAHcBMXcPbXVsdGlwbGUtY2hvaWNlBAAA`
const tableCell = `AAAW7t6flB4Ak9uKsxGu3p+UHtPbirMRBgoCCEoBAAYCAAQCABUnAQQAJwAHACgBJwAHACgAJwAHAARBNHJvb3RuYW1lcm9vdGNvbG9ycmVkcm9vdHVibG9ja3NpZHR5cGVkYXRhd2lkdGhyb3dzcjFEAQUDBAcCRAAFBAIHAQEAAAEAAAhCAAABAAEAAgJBAQIEAAkAdwExdwV0YWJsZX0BAA==`
const smallExercise = `AAAWvsGYxBi4w7irDv7BmMQYC/jDuKsOAA8KSgEABgJCBgMAQgZGClYAHQcAKAEnAQQAJwAHACcABAAnAAQAJwAEACcBBAAnVUVpZHR5cGVkYXRhbmFtZWZ1YmxvY2tzaWQwZGF0YTB0eXBldGV4dHJvb3RuYW1lcm9vdGNvbG9ycmVkcm9vdHVibG9ja3MCRAEBBwIBBAFEAwUDBAcHAA0BAQAAAQhBAAIAAUIDAAJBAAIOAHcBMXcIZXhlcmNpc2UEAAA=`
// it.only('s', () => {
//   _printStates(
//     [ins([b('0'), b('1'), b('2')])],
//     'threeSimpleBlocks',
//     [ins([b('1'), b('2'), b('0'), b('3')])],
//     'one203Merged',
//     [ins(b('nice cat'))],
//     'niceCat',
//     [ins([{ id: '1', type: 'file', data: { name: 'f1', src: '.ru' } }, { id: '2', type: 'file', data: { name: 'f2', src: '.ru' } },]),],
//     'twoFiles',
//     [ins([{ id: '1', type: 'multiple-choice', data: { question: 'q', explanation: 'e', correctAnswer: ['o1'], options: ['o1', 'o2'] }, },])],
//     'mcqSimple',
//     [ins([{ id: '1', type: 'table', data: [{ width: 1, rows: ['r1'] }],},])],
//     'tableCell',
//     ins([{id: '1',type: 'exercise',data: { name: 'f', ublocks: [b('0')] },},]),
//     'smallExercise',
//   )
// })

const _upageStates = {
  '0_1_2': () => _base64ToState(threeSimpleBlocks),
  empty: () => _base64ToState(empty),
  '1_2_0_3': () => _base64ToState(one203Merged),
  'nice cat': () => _base64ToState(niceCat),
  '{f1 .ru}_{f2 .ru}': () => _base64ToState(twoFiles),
  mcqSimple: () => _base64ToState(mcqSimple),
  tableCell: () => _base64ToState(tableCell),
  smallExercise: () => _base64ToState(smallExercise),
}

export const _getUPageState = (name: keyof typeof _upageStates) => _upageStates[name]()
