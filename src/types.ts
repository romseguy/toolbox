import { TOKEN_NAME } from "features/auth";

type UserMetadata = {
  email: string;
  userId: string;
  userName: string;
  isAdmin?: boolean;
};

export type Session = {
  [TOKEN_NAME]?: string | null;
  user: UserMetadata | null;
};
