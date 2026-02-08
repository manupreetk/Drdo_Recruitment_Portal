const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars FIRST
dotenv.config({ path: path.join(__dirname, '.env') });

// Debug (keep for now)
console.log('Environment Check:');
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Loaded ✓' : 'NOT LOADED ✗');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Loaded ✓' : 'NOT LOADED ✗');

// Connect DB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/documents', require('./routes/documents'));

app.get('/', (req, res) => {
  res.json({ message: 'Government Recruitment Portal API' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
