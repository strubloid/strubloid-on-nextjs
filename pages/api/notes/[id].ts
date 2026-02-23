import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from "@lib/db";
import { Note } from "@lib/db";
import type { IApiResponse } from "@types";
import type { INoteDocument } from "@lib/db";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<IApiResponse<INoteDocument | Record<string, never>>>,
): Promise<void> {
    await dbConnect();

    const { id } = req.query;

    if (!id || typeof id !== 'string') {
        res.status(400).json({ success: false });
        return;
    }

    switch (req.method) {
        case 'GET': {
            try {
                const note = await Note.findById(id);
                if (!note) {
                    res.status(404).json({ success: false });
                    return;
                }
                res.status(200).json({ success: true, data: note });
            } catch {
                res.status(400).json({ success: false });
            }
            break;
        }

        case 'PUT': {
            try {
                const note = await Note.findByIdAndUpdate(id, req.body, {
                    new: true,
                    runValidators: true,
                });
                if (!note) {
                    res.status(404).json({ success: false });
                    return;
                }
                res.status(200).json({ success: true, data: note });
            } catch {
                res.status(400).json({ success: false });
            }
            break;
        }

        case 'DELETE': {
            try {
                const result = await Note.deleteOne({ _id: id });
                if (result.deletedCount === 0) {
                    res.status(404).json({ success: false });
                    return;
                }
                res.status(200).json({ success: true, data: {} });
            } catch {
                res.status(400).json({ success: false });
            }
            break;
        }

        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).json({ success: false });
            break;
    }
}
