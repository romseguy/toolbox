import { Magic } from "magic-sdk";
import { OAuthExtension } from "@magic-ext/oauth";

const createClient = (key: string) => {
  return (
    typeof window != "undefined" &&
    new Magic(key, {
      extensions: [new OAuthExtension()],
      locale: "fr"
    })
  );
};

export const client = createClient(
  process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY
);
