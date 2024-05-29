/* eslint-disable no-debugger */
import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer } from 'react';

// third-party
import { Chance } from 'chance';
import jwtDecode from 'jwt-decode';
import { toInteger } from 'lodash';

// reducer - state management
import { LOGIN, LOGOUT } from 'redux/reducers/actions';
import authReducer from 'redux/reducers/auth';

// project-imports
import Loader from 'components/atoms/loader/Loader';
import axios from 'utils/axios';

const chance = new Chance();

// constant
const initialState = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
};

const verifyToken = (serviceToken) => {
  if (!serviceToken) {
    return false;
  }
  const decoded = jwtDecode(serviceToken);

  /**
   * Property 'exp' does not exist on type '<T = unknown>(token: string, options?: JwtDecodeOptions | undefined) => T'.
   */
  return decoded.exp > Date.now() / 1000;
};

const setSession = (serviceToken, userID, applicationID) => {
  // console.log(serviceToken);
  console.log(typeof userID);
  if (serviceToken) {
    localStorage.setItem('serviceToken', serviceToken);
    localStorage.setItem('userID', userID);
    localStorage.setItem('applicationID', applicationID);
    axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
    // axios.defaults.headers.common.userID = userID;
  } else {
    localStorage.removeItem('serviceToken');
    delete axios.defaults.headers.common.Authorization;
    // delete axios.defaults.headers.common.userID;
  }
};

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //

const JWTContext = createContext(null);

export const JWTProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // console.log('JWT Provider Running');
    const init = async () => {
      try {
        const serviceToken = localStorage.getItem('serviceToken');
        const userID = localStorage.getItem('userID');
        const applicationID = localStorage.getItem('applicationID');
        console.log(verifyToken(serviceToken));
        if (serviceToken && verifyToken(serviceToken)) {
          console.log(typeof userID);
          console.log('Token found');
          setSession(serviceToken, toInteger(userID), toInteger(applicationID));

          dispatch({
            type: LOGIN,
            payload: {
              isLoggedIn: true
              // user
            }
          });
        } else {
          dispatch({
            type: LOGOUT
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: LOGOUT
        });
      }
    };

    init();
  }, []);

  const login = async (email_id, password) => {
    // const response = await axios.post('/api/account/login', { email: email_id, password });
    const response = await axios.post('/user/login', { email_id, password });
    // return response;

    console.log(response);
    if (response.status === 200 && response.data.data.is_resetpassword) {
      return response;
    }
    if (response.status === 200) {
      const user = response.data;
      console.log(response.data);

      // setSession(serviceToken);
      setSession(user.data.token, user.data.user_id, user.data.application_id);
      dispatch({
        type: LOGIN,
        payload: {
          isLoggedIn: true,
          user
        }
      });
      return response;
    }
  };

  const register = async (email, password, firstName, lastName) => {
    // todo: this flow need to be recode as it not verified
    const id = chance.bb_pin();
    const response = await axios.post('/api/account/register', {
      id,
      email,
      password,
      firstName,
      lastName
    });
    let users = response.data;

    if (window.localStorage.getItem('users') !== undefined && window.localStorage.getItem('users') !== null) {
      const localUsers = window.localStorage.getItem('users');
      users = [
        ...JSON.parse(localUsers),
        {
          id,
          email,
          password,
          name: `${firstName} ${lastName}`
        }
      ];
    }

    window.localStorage.setItem('users', JSON.stringify(users));
  };

  const logout = () => {
    setSession(null);
    dispatch({ type: LOGOUT });
  };

  const resetPassword = async () => {};

  const updateProfile = () => {};

  if (state.isInitialized !== undefined && !state.isInitialized) {
    return <Loader />;
  }

  return <JWTContext.Provider value={{ ...state, login, logout, register, resetPassword, updateProfile }}>{children}</JWTContext.Provider>;
};

JWTProvider.propTypes = {
  children: PropTypes.node
};

export default JWTContext;
