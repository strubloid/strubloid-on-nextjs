import type { NextApiRequest, NextApiResponse } from "next";
import { getGithubProjects } from "../../lib/github";
import type { GithubCache } from "../../lib/github";

export default async function handler(req: NextApiRequest, res: NextApiResponse<GithubCache | { error: string }>): Promise<void> {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        res.status(405).json({ error: "Method not allowed" });
        return;
    }

    const projects = await getGithubProjects();
    res.status(200).json({ timestamp: Date.now(), projects });
}

