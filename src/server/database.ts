import type { Db } from "mongodb";
import mongoose, { Model } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";
//import { IOrg, OrgSchema } from "features/org";
import { IUser, UserSchema } from "features/user";

let cached = global.mongo;
if (!cached) {
  cached = global.mongo = { conn: null, models: null, promise: null };
}
console.log(process.env.DATABASE_URL);
const options: mongoose.ConnectOptions = {
  auth: { username: "lbf", password: process.env.SECRET },
  authSource: "admin",
  useNewUrlParser: true,
  useUnifiedTopology: true,
  bufferCommands: false,
  useFindAndModify: false,
  useCreateIndex: true
};
const connection = mongoose.createConnection(process.env.DATABASE_URL, {
  autoIndex: false
});
const clientPromise = connection.then((connection) => connection.getClient());
const modelsPromise = connection.then((connection) => {
  return {
    //Org: connection.model<IOrg>("Org", OrgSchema),
    User: connection.model<IUser>("User", UserSchema)
  };
});

export let db: Db;
export let models: {
  //Org: Model<IOrg, {}, {}>;
  User: Model<IUser, {}, {}>;
};
export default async function database(
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) {
  let clientDb;

  if (!cached.promise) {
    cached.promise = (await clientPromise).connect().then((client) => {
      clientDb = client.db(
        process.env.NODE_ENV === "development" ? "assolidaires" : "cwiki"
      );
      return {
        client,
        db: clientDb
      };
    });
  }

  if (!cached.conn) {
    cached.conn = await cached.promise;

    if (cached.conn && !cached.conn.db) {
      cached.conn.db = clientDb;
    }
  }

  db = cached.conn.db;

  if (!cached.models) {
    cached.models = await modelsPromise;
  }

  models = cached.models;

  // req.dbClient = cached.conn.client;
  // req.db = cached.conn.db;

  return next();
}
