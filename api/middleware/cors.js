const cors = require("cors");

const corsOptions = {
  origin: [
    'http://localhost:4200',
    'https://seusite.vercel.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
};

module.exports = cors(corsOptions);
