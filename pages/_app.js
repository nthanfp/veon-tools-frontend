import { AppWrapper } from '../contexts/state';
import { AuthWrapper } from '../contexts/AuthContext';

import '../styles/flatly.css';
// import 'sweetalert2/src/sweetalert2.scss';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <AppWrapper>
        <AuthWrapper>
          <Component {...pageProps} />
        </AuthWrapper>
      </AppWrapper>
    </>
  );
}

export default MyApp;
