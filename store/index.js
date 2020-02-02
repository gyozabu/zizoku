import firebase from '~/plugins/firebase'

const db = firebase.firestore()

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
  },
  async updatePost({ commit }, payload) {
    const { id, data } = payload
    const postRef = await db.collection('post').doc(id)
    await postRef.update(data)
  }
}

export const getters = {
  isAuthenticated(state) {
    return !!state.user
  }
}
