if (process.env.NEXT_PUBLIC_STAGE === 'DEV') {
  var API_URL = 'http://localhost:3001/api';
} else {
  var API_URL = 'https://veon-tools-backend.herokuapp.com/api';
}

export { API_URL };
