import { combineReducers } from 'redux'
import signupReducer from './signupSlice.js'
import loginReducer from './loginSlice.js'
import courseReducer from './courseSlice.js'
import sprintReducer from './sprintSlice.js'

const rootReducer = combineReducers({
  signup: signupReducer,
  login: loginReducer,
  courses: courseReducer,
  sprints: sprintReducer,
})

export default rootReducer
