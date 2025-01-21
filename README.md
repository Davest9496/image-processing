# Image Processing API

This project implements a robust image processing API using Node.js and Express. The service provides a straightforward way to resize images through a RESTful API endpoint, with built-in caching for improved performance. Users can upload/drag and drop images and specify desired dimensions, receiving back the processed image in their chosen format.

## Project Overview

The Image Processing API serves as a practical demonstration of building scalable Node.js applications with TypeScript. The application showcases important concepts including:

- RESTful API design and implementation
- Efficient image processing using third-pary library - #Sharp
- In-memory caching for optimized performance
- Strong type safety with TypeScript
- Clean architecture with separation of concerns for easy scaling and maintenance
- Comprehensive testing with Jasmine

## Getting Started

### Prerequisites

Before running this project, you'll need to have these tools installed on your system:

- Node.js (v14 or higher)
- npm (pre-installed with Node.js)
- TypeScript (v4.0 or higher)

### Installation

Follow these steps to get the project running on your local machine:

1. Clone the repository:
   - git clone https://github.com/yourusername/image-processing.git
   - cd image-processing
   

2. Install dependencies:
   - npm install


3. Build the project:
   - npm run build

4. Start the server:
   - npm start

The server will start on port 3000 by default...

## Project Structure

The project follows a modular architecture for maintainability and scalability:

src/
├── routes/
│   ├── api/
│   │   └── resizeImage.ts    # Image processing endpoint
│   └── router.ts             # Main router configuration
├── services/
│   └── imageProcessor.ts     # Image processing service
├── utilities/
│   ├── cache.ts             # Caching utility
│   └── logger.ts            # Logging utility
├── views/
│   ├── index.ejs            # Upload form template
│   └── result.ejs           # Result page template
└── index.ts                 # Application entry point

## API Documentation

### Resize Endpoint

**POST /api/images/resize**

Resizes an uploaded image according to specified dimensions.

Request:
- Method: POST
- Content-Type: multipart/form-data
- Body Parameters:
  - image: Image file (jpg, jpeg, png, gif, webp, or avif)
  - width: Desired width in pixels
  - height: Desired height in pixels
  - format: Output format (jpg, png, webp) - optional, defaults to jpg

Response:
- Success: 200 OK with the processed image
- Error: 400 Bad Request with error details

## Testing

The project includes comprehensive test coverage using Jasmine. Tests are organized into three categories:

1. Service Tests: Verify image processing functionality
2. Route Tests: Ensure API endpoints work correctly
3. Server Tests: Test the server connectivity

To run the tests:

# Run all tests
npm test

# Run specific test suites
npm run test:unit     # Run service tests
npm run test:routes   # Run route tests
npm run test:server   # Run server configuration tests


## Built With

- [Express](https://expressjs.com/) - Web framework for Node.js
- [Sharp](https://sharp.pixelplumbing.com/) - High-performance image processing
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Multer](https://github.com/expressjs/multer) - Middleware for handling multipart/form-data and uploads
- [EJS](https://ejs.co/) - Embedded JavaScript templating
- [Jasmine](https://jasmine.github.io/) - Testing framework

## Features

- Image resizing with dimension specifications
- Multiple output format support (JPG, PNG, WebP)
- Easy one-click download of processed Image
- In-memory caching of processed images
- Clean and intuitive web user interface
- Validation of input parameters against too large or invalid  values
- Error handling with informative messages
- Comprehensive test coverage

## Development

The project uses several npm scripts to aid development:

- npm run dev          # Start development server
- npm run lint         # Run ESLint
- npm run prettier     # Format code
- npm run build        # Compile TypeScript and copy all assets


## Deployment

Deployment on vercel:
- https://image-processing-woad.vercel.app/api

## License

This project is licensed under the ISC License.

## Author

Dave Ejezie

## Acknowledgments

Special thanks to the Sharp image processing library for its exceptional performance and ease of use, and to Udacity for their wonderful and instructive course that has thought me the skills needed to put this software in palce.