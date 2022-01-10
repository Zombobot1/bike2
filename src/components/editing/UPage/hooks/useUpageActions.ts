import { fn, str, strs } from '../../../../utils/types'

class Actions {
  deletePages: (ids: strs) => void = fn
  createPage: (id: str) => void = fn
}

export let actions = new Actions()
export const setActions = (new_: Actions) => {
  actions = new_
}
