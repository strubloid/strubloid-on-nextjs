import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../components/DatabaseConnection';
import Note from '../../../components/scrapbook/models/Note';
import type { IApiResponse } from '../../../types';
import type { INoteDocument } from '../../../components/scrapbook/models/Note';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<IApiResponse<INoteDocument | INoteDocument[]>>,
): Promise<void> {
    await dbConnect();

    switch (req.method) {
        case 'GET': {
            try {
                const notes = await Note.find({});
                res.status(200).json({ success: true, data: notes });
            } catch {
                res.status(400).json({ success: false });
            }
            break;
        }

        case 'POST': {
            try {
                const note = await Note.create(req.body);
                res.status(201).json({ success: true, data: note });
            } catch {
                res.status(400).json({ success: false });
            }
            break;
        }

        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).json({ success: false });
            break;
    }
}
