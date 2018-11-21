import express from 'express';
import db from './db/db';

const app = express();

app.get('/api/v1/chat', (req, res) => {
  res.status(200).send({
    success: true,
    message: 'chat received',
    chat: db,
  });
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('server is running on ' + PORT);
});