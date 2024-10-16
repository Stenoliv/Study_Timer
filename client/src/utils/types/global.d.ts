export {};

declare global {
  interface window {
    toast: {
      success: (msg: string, duration?: number) => void;
      error: (msg: string, duration?: number) => void;
      info: (msg: string, duration?: number) => void;
    };
  }
}
