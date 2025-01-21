import { config } from 'dotenv';
import * as path from 'path';

// Load environment variables from .env file
config();

beforeAll(() => {
  // You can now safely use process.env variables
  const testImageDir =
    process.env.TEST_IMAGE_DIR || path.join(__dirname, '../images/test');
  console.log(`Test images directory: ${testImageDir}`);

});
