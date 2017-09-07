const initialUserState = {
  username: null,
  isFetched: false,
  errorRegister: false,
  errorLogin: false,
  token: null,
  isTokenVerified: false,
  successRegister: true
}

const userReducer = (state=initialUserState, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {...state, username: action.payload.username, errorLogin: false, isFetched: true, token: action.payload.token }
    case 'LOGIN_ERROR':
      return {...state, errorLogin: true}
    case 'REGISTER_USER':
      return {...state, errorRegister: false, successRegister: true}
    case 'REGISTER_ERROR':
      return {...state, errorRegister: true, successRegister: false}
    case 'LOGOUT_USER':
      return {...state, isFetched: false, username: null, token: null}
    case 'VERIFY_TOKEN':
      return {...state, isTokenVerified: true, username: action.payload.username, token: action.payload.token}
    case 'VERIFY_TOKEN_ERROR':
      return {...state, isTokenVerified: true}
    case 'REMOVE_MESSAGES':
      return {...state, errorRegister: false, errorLogin: false, successRegister: false}
  }
  return state;
}

export default userReducer;
