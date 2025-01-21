import { config } from 'dotenv';
import * as path from 'path';

config();

beforeAll(() => {
  const testImageDir =
    process.env.TEST_IMAGE_DIR || path.join(__dirname, '../images/test');
  console.log(`Test images directory: ${testImageDir}`);

});
