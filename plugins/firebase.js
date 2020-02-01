import firebase from 'firebase'

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: 'AIzaSyA3Y4YUp2wivCPmDpeEw3_ZVn-zxx8-8WI',
    authDomain: 'zizoku-9f17b.firebaseapp.com',
    databaseURL: 'https://zizoku-9f17b.firebaseio.com',
    projectId: 'zizoku-9f17b',
    storageBucket: 'zizoku-9f17b.appspot.com',
    messagingSenderId: '444912830272',
    appId: '1:444912830272:web:ab4d42e886f9886b63dca5',
    measurementId: 'G-KT1Z41VY7L'
  })
}

export default firebase
