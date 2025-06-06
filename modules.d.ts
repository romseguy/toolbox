declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_API: string;
      NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY: string;
      DATABASE_URL: string;
      MAGIC_SECRET: string;
      SECRET: string;
    }
    interface Global {
      mongo: {
        conn: {
          client: MongoClient;
          db: Db;
        } | null;
        models: Models | null;
        promise: Promise<{
          client: MongoClient;
          db: Db;
        }> | null;
      };
    }
  }
}

declare module "@chakra-ui/react";
