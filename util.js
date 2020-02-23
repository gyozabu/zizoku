import firebase from '~/plugins/firebase'

export const convertToTimestamp = (key, value) => {
  const Timestamp = firebase.firestore.Timestamp

  if (key === 'limitTimestamp') {
    const date = new Date(value)
    return Timestamp.fromDate(date)
  } else {
    const date = new Date()
    const hour = value.replace(/:.*/, '')
    const minute = value.replace(/.*:/, '')
    date.setHours(hour)
    date.setMinutes(minute)
    return Timestamp.fromDate(date)
  }
}
