import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// third-party
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { LicenseInfo } from '@mui/x-date-pickers-pro';

// fonts
import 'assets/fonts/inter/inter.css';

// scroll bar
import 'simplebar/dist/simplebar.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// apex-chart
import 'assets/third-party/react-table.css';

// project-imports
import App from './App';
import { store, persister } from './redux';
import { ConfigProvider } from 'contexts/ConfigContext';
import { QueryClientProvider, QueryClient } from 'react-query';

const queryClient = new QueryClient();
const container = document.getElementById('root');
const root = createRoot(container);
LicenseInfo.setLicenseKey('8620848f-22e6-4b41-a124-38ac9afa4bb6');

// ==============================|| MAIN - REACT DOM RENDER  ||============================== //

root.render(
  <ReduxProvider store={store}>
    <PersistGate loading={null} persistor={persister}>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider>
          {/* <BrowserRouter basename={process.env.REACT_APP_BASE_NAME}> */}
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ConfigProvider>
      </QueryClientProvider>
    </PersistGate>
  </ReduxProvider>
);
