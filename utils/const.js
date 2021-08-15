if (process.env.STAGE === 'PROD') {
  var API_URL = 'https://veon-tools-backend.herokuapp.com/api';
} else {
  // var API_URL = 'http://localhost:3001/api';
  var API_URL = 'https://veon-tools-backend.herokuapp.com/api';
}

export { API_URL };
