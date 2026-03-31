const dotenv = require('dotenv')
dotenv.config();
const PORT = process.env.PORT || 3000;
const express = require('express')
const app = express();

const cors = require('cors');

const mongoose = require('mongoose');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://calpy-ris.netlify.app',
    'https://calpy-ris.netlify.app/'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("CORS Blocked Origin:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const authRoutes = require('./routes/userLogin');

app.use('/api/auth', authRoutes);


app.get('/', (req, res) => {
    res.send('Welcome to Calpy backend')
})

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: err.message });
});


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`Server running at ${PORT}`);
    });
  })
  .catch(err => {
    console.log("MongoDB FULL ERROR:");
    console.log(err);
  });