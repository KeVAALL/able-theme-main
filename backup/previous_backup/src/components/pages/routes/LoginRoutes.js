import { lazy } from 'react';

// project-imports
import GuestGuard from 'utils/route-guard/GuestGuard';
import CommonLayout from 'layout/CommonLayout';
import Loadable from 'helpers/Loadable';

// render - login
const AuthLogin = Loadable(lazy(() => import('components/pages/auth1/login')));
const AuthRegister = Loadable(lazy(() => import('components/pages/auth1/register')));
const AuthForgotPassword = Loadable(lazy(() => import('components/pages/auth1/forgot-password')));
const AuthCheckMail = Loadable(lazy(() => import('components/pages/auth1/check-mail')));
const AuthResetPassword = Loadable(lazy(() => import('components/pages/auth1/reset-password')));
const AuthCodeVerification = Loadable(lazy(() => import('components/pages/auth1/code-verification')));

// ==============================|| AUTH ROUTES ||============================== //

const LoginRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: (
        <GuestGuard>
          <CommonLayout />
        </GuestGuard>
      ),
      children: [
        {
          path: 'login',
          element: <AuthLogin />
        },
        {
          path: 'register',
          element: <AuthRegister />
        },
        {
          path: 'forgot-password',
          element: <AuthForgotPassword />
        },
        {
          path: 'check-mail',
          element: <AuthCheckMail />
        },
        {
          path: 'reset-password',
          element: <AuthResetPassword />
        },
        {
          path: 'code-verification',
          element: <AuthCodeVerification />
        }
      ]
    }
  ]
};

export default LoginRoutes;
