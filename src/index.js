const express = require('express');
const worldCupRoutes = require('./routes/worldCupRoutes');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/api', worldCupRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
