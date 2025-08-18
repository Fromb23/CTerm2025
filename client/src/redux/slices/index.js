import { combineReducers } from 'redux'
import signupReducer from './signupSlice.js'

const rootReducer = combineReducers({
  signup: signupReducer
})

export default rootReducer
