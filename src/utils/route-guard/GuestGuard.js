import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// project-imports
import { APP_DEFAULT_PATH } from 'config';
import useAuth from 'hooks/useAuth';

// ==============================|| GUEST GUARD ||============================== //

const GuestGuard = ({ children }) => {
  const { isLoggedIn, state } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('Refreshing' + ' ' + isLoggedIn);
    if (isLoggedIn) {
      navigate(location?.state?.from ? location?.state?.from : APP_DEFAULT_PATH, {
        state: {
          from: ''
        },
        replace: true
      });
    }
  }, [isLoggedIn, navigate, location, state]);

  console.log(children);
  return children;
};

GuestGuard.propTypes = {
  children: PropTypes.node
};

export default GuestGuard;
