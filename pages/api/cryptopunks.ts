import { promises as fs } from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";

type ResponseData = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "GET") {
    const jsonDirectory = path.join(process.cwd(), "scripts");

    const json = await fs.readFile(`${jsonDirectory}/punks.json`, {
      encoding: "utf-8",
    });
    res.setHeader("Cache-Control", "s-maxage=604800, stale-while-revalidate");
    res.status(200).json(JSON.parse(json));
  }
}
