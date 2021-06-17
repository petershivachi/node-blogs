const express = require('express');
const app = express();
const connectDB = require('./config/db');

app.get('/', (req, res) => res.send('API Running...'));

//Connect Database
connectDB();

//Initialise middleware
app.use(express.json({ extended: false }));

//Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/blogs', require('./routes/api/blogs'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
});