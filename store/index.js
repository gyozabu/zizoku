import { format, getHours, getMinutes } from 'date-fns'
import firebase from '~/plugins/firebase'

const db = firebase.firestore()

export const strict = false

export const state = () => ({
  user: null,
  post: false,
  posts: null,
  userPosts: null
})

export const mutations = {
  setUser(state, payload) {
    state.user = payload
  },
  setPost(state, payload) {
    state.post = payload
  },
  setPosts(state, payload) {
    state.posts = payload
  },
  setUserPosts(state, payload) {
    state.userPosts = payload
  }
}

export const actions = {
  setUser({ commit }, payload) {
    commit('setUser', payload)
  },
  setPost({ commit }, payload) {
    commit('setPost', payload)
  },
  async loadPosts({ commit }) {
    const collections = await db.collection('post').get()
    const userCollections = await db.collection('user').get()

    const users = userCollections.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data()
      }
    })
    const posts = collections.docs.map((doc) => {
      const id = doc.id
      const data = doc.data()
      const user = users.find((x) => x.id === data.userId)

      const insertTimestamp = format(
        data.insertTimestamp.toDate(),
        'yyyy年M月d日'
      )
      const limitTimestamp = format(data.limitTimestamp.toDate(), 'yyyy-M-d')
      const limitHour = getHours(data.scheduleTimestamp.toDate())
      const limitMinute =
        getMinutes(data.scheduleTimestamp.toDate()) < 10
          ? `0${getMinutes(data.scheduleTimestamp.toDate())}`
          : getMinutes(data.scheduleTimestamp.toDate())
      const scheduleTimestamp = `${limitHour}:${limitMinute}`

      return {
        id,
        user,
        ...data,
        insertTimestamp,
        limitTimestamp,
        scheduleTimestamp
      }
    })
    commit('setPosts', posts)
  },
  async loadUserPosts({ commit }, userId) {
    const userDoc = await db
      .collection('user')
      .doc(userId)
      .get()
    const user = userDoc.data()

    const postDoc = await db
      .collection('post')
      .where('userId', '==', userId)
      .get()

    const posts = postDoc.docs.map((doc) => {
      const id = doc.id
      const data = doc.data()
      const insertTimestamp = format(
        data.insertTimestamp.toDate(),
        'yyyy年M月d日'
      )
      const limitTimestamp = format(data.limitTimestamp.toDate(), 'yyyy-M-d')

      const limitHour = getHours(data.scheduleTimestamp.toDate())
      const limitMinute =
        getMinutes(data.scheduleTimestamp.toDate()) < 10
          ? `0${getMinutes(data.scheduleTimestamp.toDate())}`
          : getMinutes(data.scheduleTimestamp.toDate())
      const scheduleTimestamp = `${limitHour}:${limitMinute}`

      return {
        id,
        user,
        ...data,
        insertTimestamp,
        limitTimestamp,
        scheduleTimestamp
      }
    })

    commit('setUserPosts', posts)
  },
  async updatePost({ commit }, payload) {
    const { id, data } = payload
    const postRef = await db.collection('post').doc(id)
    await postRef.update(data)
  },
  clearPosts({ commit }, payload) {
    commit('setPosts', null)
  }
}

export const getters = {
  isAuthenticated(state) {
    return !!state.user
  }
}
