if (process.env.MODE === 'PROD') {
  var API_URL = 'https://veon-tools-backend.herokuapp.com/api';
} else {
  var API_URL = 'http://localhost:3001/api';
}

export { API_URL };
