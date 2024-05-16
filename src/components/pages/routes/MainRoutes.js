import { lazy } from 'react';

// project-imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'helpers/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';
import Issuer from '../issuer/issuer';
import FixDeposit from '../fixedDeposit/fixedDeposit';
import Investor from '../investor/investor';
import Investment from '../transaction/investment';

// Product
const Product = Loadable(lazy(() => import('components/pages/productType/productType')));

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
