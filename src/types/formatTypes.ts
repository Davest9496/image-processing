// Define formats accepted by sharp
type AllowedFormat = 'jpg' | 'png' | 'webp' | 'avif' | 'gif';

// Define the Options interface
interface ResizeOptions {
  width?: number;
  height?: number;
  filename?: string;
  format: AllowedFormat;
}

// Define types for query parameters
interface QueryParams {
  width: string;
  height: string;
  filename: string;
  format?: string;
}

export { AllowedFormat, ResizeOptions, QueryParams };
