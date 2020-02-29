import firebase from '~/plugins/firebase'

export const convertToTimestamp = (key, value) => {
  const Timestamp = firebase.firestore.Timestamp

  if (key === 'limitTimestamp') {
    const date = new Date(value)
    return Timestamp.fromDate(date)
  } else {
    const currentDate = new Date()
    const insertDate = new Date()
    const hour = value.replace(/:.*/, '')
    const minute = value.replace(/.*:/, '')
    insertDate.setHours(hour)
    insertDate.setMinutes(minute)
    if (currentDate > insertDate) insertDate.setDate(insertDate.getDate() + 1)
    return Timestamp.fromDate(insertDate)
  }
}
