import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import glob from "glob";
import { createEndpointError } from "server/errors";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

const prom = async (path) => {
  return new Promise((resolve, reject) => {
    glob(path, {}, (err, filePaths) => {
      if (err) reject(err);
      resolve(filePaths);
    });
  });
};

handler.get<
  NextApiRequest & {
    query: {
      path: string;
    };
  },
  NextApiResponse
>(async function getList(req, res) {
  console.log("🚀 ~ GET / ~ :");

  try {
    const filePaths = await prom(req.query.path);
    res.status(200).json(
      filePaths.filter((fp) => {
        return !fs.statSync(fp).isDirectory();
      }),
    );
  } catch (error) {
    res.status(500).json(createEndpointError(error));
  }
});

export default handler;
