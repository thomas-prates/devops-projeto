import express, { Request, Response } from 'express';
import taskRoutes from './routes/tasks';

const app = express();

app.use(express.json());

// Middleware de logging
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  
  next();
});

// Middleware de tratamento de erros
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error(`[${new Date().toISOString()}] ERROR: ${err.message}`);
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.get('/health', (req: Request, res: Response) => {
  console.log(`[${new Date().toISOString()}] Health check requested`);
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use(taskRoutes);

app.use((req: Request, res: Response) => {
  console.log(`[${new Date().toISOString()}] 404 Not Found: ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Not found' });
});

export default app;
