import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// project-imports
import { APP_DEFAULT_PATH } from 'config';
import useAuth from 'hooks/useAuth';
import { useSelector } from '../../redux';

// ==============================|| GUEST GUARD ||============================== //

const GuestGuard = ({ children }) => {
  const { isLoggedIn, state } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  // const { menu } = useSelector((state) => state.menu);

  useEffect(() => {
    // console.log(location?.state?.from);
    const menu = localStorage.getItem('persist:root');
    const firstURL = JSON.parse(JSON.parse(menu).menu).menuItem[0].children[0].url;
    // console.log(location);
    if (isLoggedIn) {
      navigate(location?.state?.from ? location?.state?.from : firstURL, {
        state: {
          from: ''
        },
        replace: true
      });
    }
  }, [isLoggedIn, navigate, location, state]);

  return children;
};

GuestGuard.propTypes = {
  children: PropTypes.node
};

export default GuestGuard;
