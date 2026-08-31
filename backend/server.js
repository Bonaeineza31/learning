import 'dotenv/config.js';
import express from 'express';
import cors from 'cors';
import sequelize from './config/database.js';
import ContactRoutes from './routes/ContactRoutes.js';
import LoginRoutes from './routes/LoginRoutes.js';
import RegisterRoutes from './routes/RegisterRoutes.js';
import ProductRoutes from './routes/ProductRoutes.js';

const app = express();
const port = process.env.PORT || 3032;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

sequelize
  .sync()
  .then(() => console.log('Connected to PostgreSQL and tables synced!'))
  .catch((error) => console.error('PostgreSQL connection error:', error.message));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    database: 'postgres',
  });
});

app.use('/api/contact', ContactRoutes);
app.use('/api/login', LoginRoutes);
app.use('/api/register', RegisterRoutes);
app.use('/api/products', ProductRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

app.listen(port, () => {
  console.log('Server started at http://localhost:' + port);
});

export default app;
