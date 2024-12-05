type allowedFormat = 'jpeg' | 'png' | 'webp' | 'avif' | 'gif';

interface Options {
  width: number;
  height: number;
  fileName?: string;
  format: allowedFormat;
}

export { allowedFormat, Options };