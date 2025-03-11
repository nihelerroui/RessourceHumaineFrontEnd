// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8089/spring',
  defaultauth: 'fakebackend', // Adding this to use the fake backend
  firebaseConfig: {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: ''
  }
};