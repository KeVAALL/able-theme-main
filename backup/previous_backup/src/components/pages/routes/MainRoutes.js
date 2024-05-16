import { lazy } from 'react';

// project-imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'helpers/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';
import Issuer from '../issuer/issuer';
import FixDeposit from '../fixedDeposit/fixedDeposit';
import Investor from '../investor/investor';

// Product
const Product = Loadable(lazy(() => import('components/pages/productType/productType')));

const FormsBasic = Loadable(lazy(() => import('components/pages/formBasic/basic-form')));

// pages routing
const AuthLogin = Loadable(lazy(() => import('components/pages/auth1/login')));
const AuthRegister = Loadable(lazy(() => import('components/pages/auth1/register')));
const AuthForgotPassword = Loadable(lazy(() => import('components/pages/auth1/forgot-password')));
const AuthResetPassword = Loadable(lazy(() => import('components/pages/auth1/reset-password')));
const AuthCheckMail = Loadable(lazy(() => import('components/pages/auth1/check-mail')));
const AuthCodeVerification = Loadable(lazy(() => import('components/pages/auth1/code-verification')));

const AuthLogin2 = Loadable(lazy(() => import('components/pages/auth2/login2')));
const AuthRegister2 = Loadable(lazy(() => import('components/pages/auth2/register2')));
const AuthForgotPassword2 = Loadable(lazy(() => import('components/pages/auth2/forgot-password2')));
const AuthResetPassword2 = Loadable(lazy(() => import('components/pages/auth2/reset-password2')));
const AuthCheckMail2 = Loadable(lazy(() => import('components/pages/auth2/check-mail2')));
const AuthCodeVerification2 = Loadable(lazy(() => import('components/pages/auth2/code-verification2')));

const AuthLogin3 = Loadable(lazy(() => import('components/pages/auth3/login3')));

const MaintenanceError = Loadable(lazy(() => import('components/pages/error/404')));
const MaintenanceError500 = Loadable(lazy(() => import('components/pages/error/500')));

// ==============================|| MAIN ROUTES ||============================== //

const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: (
        <AuthGuard>
          <MainLayout />
        </AuthGuard>
      ),
      children: [
        {
          path: 'dash_board',
          element: <></>
        },
        {
          path: 'investor',
          children: [
            {
              path: 'investor_list',
              element: <Investor />
            },
            {
              path: 'add_new_investor',
              element: <></>
            },
            {
              path: 'transaction_list',
              element: <></>
            }
          ]
        },
        {
          path: 'product',
          children: [
            {
              path: 'product_type',
              element: <Product />
            },
            {
              path: 'fixed_deposit',
              element: <FixDeposit />
            }
          ]
        },
        {
          path: 'issuer',
          element: <Issuer />
          // element: <></>
        },
        {
          path: 'form',
          children: [
            {
              path: 'basic',
              element: <FormsBasic />
            }
          ]
        }
      ]
    }
  ]
};

export default MainRoutes;
