import { f, str, strs } from '../../../../utils/types'

class Actions {
  deletePages: (ids: strs) => void = f
  createPage: (id: str) => void = f
}

export let actions = new Actions()
export const setActions = (new_: Actions) => {
  actions = new_
}
