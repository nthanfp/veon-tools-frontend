import { AppWrapper } from '../contexts/state';
import { AuthWrapper } from '../contexts/AuthContext';

import '../styles/flatly.css';

function MyApp({ Component, pageProps }) {
  console.log(process.env.STAGE);

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
