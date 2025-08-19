import { combineReducers } from 'redux'
import signupReducer from './signupSlice.js'
import loginReducer from './loginSlice.js'

const rootReducer = combineReducers({
  signup: signupReducer,
  login: loginReducer
})

export default rootReducer
