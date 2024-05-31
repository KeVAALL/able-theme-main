import { lazy } from 'react';

// project-imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'helpers/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';
import Issuer from '../issuer/issuer';
import FixDeposit from '../fixedDeposit/fixedDeposit';
import Investor from '../investor/investor';
import Investment from '../transaction/investment';
import UserList from '../userList/userList';
import Role from '../userList/role';
import { element } from 'prop-types';
import Dashboard from '../dashboard/dashboard';

// Product
const Product = Loadable(lazy(() => import('components/pages/productType/productType')));
// User
const UserProfile = Loadable(lazy(() => import('components/pages/userProfile/user')));
const UserTabPersonal = Loadable(lazy(() => import('../../organisms/user/TabPersonal')));
const UserTabPayment = Loadable(lazy(() => import('../../organisms/user/TabPayment')));
const UserTabPassword = Loadable(lazy(() => import('../../organisms/user/TabPassword')));
const UserTabSettings = Loadable(lazy(() => import('../../organisms/user/TabSettings')));
const FormsBasic = Loadable(lazy(() => import('components/pages/formBasic/basic-form')));

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
          path: 'dashboard',
          element: <Dashboard />
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
          path: 'transaction',
          children: [
            {
              path: 'investment',
              element: <Investment />
            }
          ]
        },
        {
          path: 'product',
          children: [
            {
              path: 'add_product',
              element: <></>
            },
            {
              path: 'product',
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
          path: 'user_master',
          children: [
            {
              path: 'role',
              element: <Role />
            },
            {
              path: 'users',
              element: <UserList />
            }
          ]
        },
        {
          path: 'user',
          element: <UserProfile />,
          children: [
            {
              path: 'personal',
              element: <UserTabPersonal />
            },
            {
              path: 'payment',
              element: <UserTabPayment />
            },
            {
              path: 'password',
              element: <UserTabPassword />
            },
            {
              path: 'settings',
              element: <UserTabSettings />
            }
          ]
        }
      ]
    }
  ]
};

export default MainRoutes;
