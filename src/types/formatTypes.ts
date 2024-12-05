type AllowedFormat = 'jpg' | 'png' | 'webp' | 'avif' | 'gif';

// Define the Options interface
interface Options {
  width: number;
  height: number;
  fileName?: string;
  format: AllowedFormat;
}

// Define types for query parameters
interface QueryParams {
  width?: string;
  height?: string;
  fileName?: string;
  format?: string;
}

export { AllowedFormat, Options, QueryParams };
