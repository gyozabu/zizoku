import firebase from '~/plugins/firebase'

export const convertTimestamp = (key, value) => {
  const timestamp = firebase.firestore.Timestamp

  if (key === 'limitTimeStamp') {
    const date = new Date(value)
    return timestamp.fromDate(date)
  } else {
    const date = new Date()
    const hour = value.replace(/:.*/, '')
    const minute = value.replace(/.*:/, '')
    date.setHours(hour)
    date.setMinutes(minute)
    return timestamp.fromDate(date)
  }
}
