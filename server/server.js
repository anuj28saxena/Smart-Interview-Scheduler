
import app from './src/app.js';
import connectDB from './src/config/database.js';
import config from './src/config/config.js';

async function startServer() {
  try {
    await connectDB();

    app.listen(config.PORT, () => {
      console.log(`Server is running on port ${config.PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
}

startServer();
