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

      const insertTimeStamp = format(
        data.insertTimeStamp.toDate(),
        'yyyy年M月d日'
      )
      const limitTimeStamp = format(data.limitTimeStamp.toDate(), 'yyyy-M-d')
      const limitHour = getHours(data.scheduleTimeStamp.toDate())
      const limitMinute =
        getMinutes(data.scheduleTimeStamp.toDate()) < 10
          ? `0${getMinutes(data.scheduleTimeStamp.toDate())}`
          : getMinutes(data.scheduleTimeStamp.toDate())
      const scheduleTimeStamp = `${limitHour}:${limitMinute}`

      return {
        id,
        user,
        ...data,
        insertTimeStamp,
        limitTimeStamp,
        scheduleTimeStamp
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
      const insertTimeStamp = format(
        data.insertTimeStamp.toDate(),
        'yyyy年M月d日'
      )
      const limitTimeStamp = format(data.limitTimeStamp.toDate(), 'yyyy-M-d')

      const limitHour = getHours(data.scheduleTimeStamp.toDate())
      const limitMinute =
        getMinutes(data.scheduleTimeStamp.toDate()) < 10
          ? `0${getMinutes(data.scheduleTimeStamp.toDate())}`
          : getMinutes(data.scheduleTimeStamp.toDate())
      const scheduleTimeStamp = `${limitHour}:${limitMinute}`

      return {
        id,
        user,
        ...data,
        insertTimeStamp,
        limitTimeStamp,
        scheduleTimeStamp
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
