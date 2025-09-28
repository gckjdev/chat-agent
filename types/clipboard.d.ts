/**
 * TypeScript declarations for clipboard API support
 * Extends global interfaces for better type safety
 */

declare global {
  interface Navigator {
    clipboard?: {
      writeText(text: string): Promise<void>;
      readText?(): Promise<string>;
    };
  }

  interface Window {
    isSecureContext?: boolean;
  }
}

export {};
