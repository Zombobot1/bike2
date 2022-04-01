import { _base64ToState } from './UPageStateCR'

const empty = `AAAG5o2t/B8DBAADAEIABScCBAAnLidyb290dWJsb2Nrc3JkYXRheyJ1YmxvY2tzIjpbIuKAmCJdfXR5cGUEBwEEEQQDAQAABEEAQgAAAQUAAA==`
const zero = `AAAG9On3hw8ICQADAEIGSBICQgANJwIEACcABAAnAQQAJ0U5cm9vdHVibG9ja3MwZGF0YTB0eXBldGV4dHJkYXRheyJ1YmxvY2tzIjpbIuKAmCIsIjAiXX10eXBlBAcBBAFEAAEEFQQDAQAAB0EAQgABQgAAAQoAAA==`
const z_1_2 = `AAAG+8XR5hoSEwADAEIGSBICQgZYIgJCBmgyAkIAHScCBAAnAAQAJwEEACcABAAnAQQAJwAEACcBBAAnc11yb290dWJsb2NrczBkYXRhMHR5cGV0ZXh0MWRhdGExdHlwZXRleHQyZGF0YTJ0eXBldGV4dHJkYXRheyJ1YmxvY2tzIjpbIuKAmCIsIjAiLCIxIiwiMiJdfXR5cGUEBwEEAUQAAQQBRAABBAFEAAEEHQQDAQAADUEAQgABQgABQgABQgAAARQAAA==`
const one_2_0_3 = `AAAG6OK/rgkXGQADAEIGSBICQgZYIgJCBmgyAkIGeIIBAkIAJScCBAAnAAQAJwEEACcABAAnAQQAJwAEACcBBAAnAAQAJwEEACeKAW9yb290dWJsb2NrczFkYXRhMXR5cGV0ZXh0MmRhdGEydHlwZXRleHQwZGF0YTB0eXBldGV4dDNkYXRhM3R5cGV0ZXh0cmRhdGF7InVibG9ja3MiOlsi4oCYIiwiMSIsIjIiLCIwIiwiMyJdfXR5cGUEBwEEAUQAAQQBRAABBAFEAAEEAUQAAQQhBAMBAAAQQQBCAAFCAAFCAAFCAAFCAAABGQAA`
const niceCat = `AAAG5PLhjgUICQADAEIUViACQgANJwIEACcABAAnAQQAJ1pOcm9vdHVibG9ja3NuaWNlIGNhdGRhdGFuaWNlIGNhdHR5cGV0ZXh0cmRhdGF7InVibG9ja3MiOlsi4oCYIiwibmljZSBjYXQiXX10eXBlBAcIBAhEAAEEHAQDAQAAB0EAQgABQgAAAQoAAA==`
const callout = `AAAG7+CqogkIDAADAEKGAcgBmAECQgANJwIEACcABAAnAQQAJ3Rocm9vdHVibG9ja3NjYWxsb3V0ZGF0YXsidGV4dCI6ImN1dGUgY2F0IiwidHlwZSI6ImluZm8ifXR5cGVjYWxsb3V0cmRhdGF7InVibG9ja3MiOlsi4oCYIiwiY2FsbG91dCJdfXR5cGUERwAEIQQHAQQbBAMBAAAHQQBCAAFCAAABCgAA`
const twoFiles = `AAAG1f67jQ8NEQADAEI2eIIBAkI2+AGCAgJCABUnAgQAJwAEACcBBAAnAAQAJwEEACeQAX9yb290dWJsb2Nrc2YxZGF0YXsibmFtZSI6ImYxIiwic3JjIjoiLnJ1In10eXBlZmlsZWYyZGF0YXsibmFtZSI6ImYyIiwic3JjIjoiLnJ1In10eXBlZmlsZXJkYXRheyJ1YmxvY2tzIjpbIuKAmCIsImYxIiwiZjIiXX10eXBlBAcCBBlEAAIEGUQAAQQbBAMBAAAKQQBCAAFCAAFCAAABDwAA`
const mcqSimple = `AAAG77GapRYIDAADAEKyAvQClAMCQgANJwIEACcABAAnAQQAJ7ABogFyb290dWJsb2Nrc21jcWRhdGF7InF1ZXN0aW9uIjoicSIsImV4cGxhbmF0aW9uIjoiZSIsIm9wdGlvbnMiOlsi4oCYIiwibzEiLCJvMiJdLCJjb3JyZWN0QW5zd2VyIjpbIuKAmCIsIm8xIl19dHlwZW11bHRpcGxlLWNob2ljZXJkYXRheyJ1YmxvY2tzIjpbIuKAmCIsIm1jcSJdfXR5cGUEBwMElwEEDwEEFwQDAQAAB0EAQgABQgAAAQoAAA==`
const tableCell = `AAAGxbTp/BsIDAADAEKKAcwBmAECQgANJwIEACcABAAnAQQAJ25icm9vdHVibG9ja3N0Y2RhdGFbIuKAmCIseyJ3aWR0aCI6MCwicm93cyI6WyLigJgiLCJyMSJdfV10eXBldGFibGVyZGF0YXsidWJsb2NrcyI6WyLigJgiLCJ0YyJdfXR5cGUEBwIEIwQFAQQWBAMBAAAHQQBCAAFCAAABCgAA`
const eb0 = `AAAG34P6nBYNEwADAEKEAcYBmAECQgbeAagBAkIAFScCBAAnAAQAJwEEACcABAAnAQQAJ31scm9vdHVibG9ja3NlZGF0YXsibmFtZSI6ImUiLCJ1YmxvY2tzIjpbIuKAmCIsIjAiXX10eXBlZXhlcmNpc2UwZGF0YTB0eXBldGV4dHJkYXRheyJ1YmxvY2tzIjpbIuKAmCIsImUiXX10eXBlBAcBBCAECAEEAUQAAQQVBAMBAAAKQQBCAAFCAAFCAAABDwAA`
const bl0_1 = `AAAG9K2zmAoSGAADAEIsboYBAkIGzAGWAQJCBtwBpgECQgAdJwIEACcABAAnAQQAJwAEACcBBAAnAAQAJwEEACePAXlyb290dWJsb2NrcyogMGRhdGFbIuKAmCIseyJ1YmxvY2siOiIwIn1ddHlwZWJ1bGxldC1saXN0MGRhdGEwdHlwZXRleHQxZGF0YTF0eXBldGV4dHJkYXRheyJ1YmxvY2tzIjpbIuKAmCIsIiogMCIsIjEiXX10eXBlBAcDBBQECwEEAUQAAQQBRAABBBsEAwEAAA1BAEIAAUIAAUIAAUIAAAEUAAA=`
const tl01 = `AAAG8Oyo9RISGgADAEKKAcwBpAECQgbqAbQBAkIG+gGEAgJCAB0nAgQAJwAEACcBBAAnAAQAJwEEACcABAAnAQQAJ5sBhAFyb290dWJsb2Nrcz4gMGRhdGFbIuKAmCIseyJ1YmxvY2siOiIwIn0seyJ1YmxvY2siOiIxIn1ddHlwZXRvZ2dsZS1saXN0MGRhdGEwdHlwZXRleHQxZGF0YTF0eXBldGV4dHJkYXRheyJ1YmxvY2tzIjpbIuKAmCIsIj4gMCJdfXR5cGUEBwMEIwQLAQQBRAABBAFEAAEEFwQDAQAADUEAQgABQgABQgABQgAAARQAAA==`
const bl0_1_bl2 = `AAAGwOaFkA8cJgADAEIsboYBAkIGzAGWAQJCBtwBpgECQizSAqoCAkIG8AK6AgJCAC0nAgQAJwAEACcBBAAnAAQAJwEEACcABAAnAQQAJwAEACcBBAAnAAQAJwEEACfaAbkBcm9vdHVibG9ja3MqIDBkYXRhWyLigJgiLHsidWJsb2NrIjoiMCJ9XXR5cGVidWxsZXQtbGlzdDBkYXRhMHR5cGV0ZXh0MWRhdGExdHlwZXRleHQqIDJkYXRhWyLigJgiLHsidWJsb2NrIjoiMiJ9XXR5cGVidWxsZXQtbGlzdDJkYXRhMnR5cGV0ZXh0cmRhdGF7InVibG9ja3MiOlsi4oCYIiwiKiAwIiwiMSIsIiogMiJdfXR5cGUEBwMEFAQLAQQBRAABBAFEAAMEFAQLAQQBRAABBCEEAwEAABNBAEIAAUIAAUIAAUIAAUIAAUIAAAEeAAA=`
const z_bl1 = `AAAGy9mkvQ8SFgADAEIGSBICQix+lgECQgbcAaYBAkIAHScCBAAnAAQAJwEEACcABAAnAQQAJwAEACcBBAAnjwF5cm9vdHVibG9ja3MwZGF0YTB0eXBldGV4dCogMWRhdGFbIuKAmCIseyJ1YmxvY2siOiIxIn1ddHlwZWJ1bGxldC1saXN0MWRhdGExdHlwZXRleHRyZGF0YXsidWJsb2NrcyI6WyLigJgiLCIwIiwiKiAxIl19dHlwZQQHAQQBRAADBBQECwEEAUQAAQQbBAMBAAANQQBCAAFCAAFCAAFCAAABFAAA`
const simpleList = `AAAG88T2xhUhLwADAEKuA/ADiAQCQgbOBJgEAkIG3gSoBAJCCPAEugQCQgjCBYwFAkII1AWeBQJCADUnAgQAJwAEACcBBAAnAAQAJwEEACcABAAnAQQAJwAEACcBBAAnAAQAJwEEACcABAAnAQQAJ60ChgJyb290dWJsb2Nrc2xkYXRhWyLigJgiLHsidWJsb2NrIjoiMCIsImNoaWxkcmVuIjpbIuKAmCIseyJ1YmxvY2siOiIwMSJ9LHsidWJsb2NrIjoiMDIifV19LHsidWJsb2NrIjoiMSIsImNoaWxkcmVuIjpbIuKAmCIseyJ1YmxvY2siOiIxMSJ9XX1ddHlwZWJ1bGxldC1saXN0MGRhdGEwdHlwZXRleHQxZGF0YTF0eXBldGV4dDAxZGF0YTAxdHlwZXRleHQwMmRhdGEwMnR5cGV0ZXh0MTFkYXRhMTF0eXBldGV4dHJkYXRheyJ1YmxvY2tzIjpbIuKAmCIsImwiXX10eXBlBAcBBLUBBAsBBAFEAAEEAUQAAgQCRAACBAJEAAIEAkQAAQQVBAMBAAAWQQBCAAFCAAFCAAFCAAFCAAFCAAFCAAABIwAA`
const simpleE = `AAAF/7zSZg0UAAMAQogBygGcAQJCsgLOBK4EAkIAFScCBAAnAAQAJwEEACcABAAnAQQAJ+gB1QFyb290dWJsb2Nrc2VkYXRheyJuYW1lIjoiZSIsInVibG9ja3MiOlsi4oCYIiwibWNxIl19dHlwZWV4ZXJjaXNlbWNxZGF0YXsicXVlc3Rpb24iOiJxIiwiZXhwbGFuYXRpb24iOiJlIiwib3B0aW9ucyI6WyLigJgiLCJvMSIsIm8yIl0sImNvcnJlY3RBbnN3ZXIiOlsi4oCYIiwibzEiXX10eXBlbXVsdGlwbGUtY2hvaWNlcmRhdGF7InVibG9ja3MiOlsi4oCYIiwiZSJdfXR5cGUEBwEEIgQIAwSXAQQPAQQVBAMBAAAKQQBCAAFCAAFCAAABDwAA`

const _upageStates = {
  '0_1_2': () => _base64ToState(z_1_2),
  '': () => _base64ToState(empty),
  '1_2_0_3': () => _base64ToState(one_2_0_3),
  'nice cat': () => _base64ToState(niceCat),
  '{f1 .ru}_{f2 .ru}': () => _base64ToState(twoFiles),
  mcqSimple: () => _base64ToState(mcqSimple),
  tableCell: () => _base64ToState(tableCell),
  eb0: () => _base64ToState(eb0),

  '0': () => _base64ToState(zero),
  callout: () => _base64ToState(callout),
  '* 0_1': () => _base64ToState(bl0_1),
  '* 0_1_* 2': () => _base64ToState(bl0_1_bl2),
  '0_* 1': () => _base64ToState(z_bl1),
  '{* 0 [01, 02] * 1 [11]}': () => _base64ToState(simpleList),
  '>0 >1': () => _base64ToState(tl01),
  '{e, [{q, [o1, o2]}]}': () => _base64ToState(simpleE),
}

export type _UPageStates = keyof typeof _upageStates
export const _getUPageState = (name: _UPageStates) => _upageStates[name]()
