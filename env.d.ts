declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_KEY: string;
    }
  }
}

export {};
