import {
  ISSCROLLTOBOTTOM
} from './mutationTypes'


const mutations = {
  [ISSCROLLTOBOTTOM](state, paload) {
    state.isScrollToBottom = paload
  }
}

export default mutations