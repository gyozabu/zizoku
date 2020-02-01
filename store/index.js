export const strict = false

export const state = () => ({
  user: null,
  post: false
})

export const mutations = {
  setUser(state, payload) {
    state.user = payload
  },
  setPost(state, payload) {
    state.post = payload
  }
}

export const actions = {
  setUser({ commit }, payload) {
    commit('setUser', payload)
  },
  setPost({ commit }, payload) {
    commit('setPost', payload)
  }
}

export const getters = {
  isAuthenticated(state) {
    return !!state.user
  }
}
