import { useEffect, useState } from 'react';

// project-imports
import Routes from 'components/pages/routes';
import ThemeCustomization from 'themes';
import { ToastContainer } from 'react-toastify';

import Loader from 'components/atoms/loader/Loader';
import RTLLayout from 'helpers/RTLLayout';
import ScrollTop from 'helpers/ScrollTop';
import Snackbar from 'helpers/@extended/Snackbar';
import Notistack from 'helpers/third-party/Notistack';

// auth-provider
import { JWTProvider as AuthProvider } from 'contexts/JWTContext';

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  if (loading) return <Loader />;

  return (
    <ThemeCustomization>
      <RTLLayout>
        <ScrollTop>
          <AuthProvider>
            <>
              <Notistack>
                <ToastContainer />
                <Routes />
                <Snackbar />
              </Notistack>
            </>
          </AuthProvider>
        </ScrollTop>
      </RTLLayout>
    </ThemeCustomization>
  );
};

export default App;
