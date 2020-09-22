import dbConnect from '@components/DatabaseConnection'
import Note from '@components/scrapbook/models/Note'

dbConnect();

export default async (req,res) => {

    const {
        query : { id },
        method
    } = req;

    switch (method) {

        case 'GET' : // Retrieve note
            try {

                const note = await Note.findById(id);
                if (!note){
                    res.status(400).json({ sucess: false });
                }

                res.status(200).json({ sucess: true , data: note});

            } catch (e) {
                res.status(400).json({ sucess: false });
            }
            break;

        case 'PUT' : // Update note
            try {
                const note = await Note.findByIdAndUpdate(id, req.body, {
                    new : true,
                    runValidators: true
                });

                if (!note){
                    res.status(400).json({ sucess: false });
                }

                res.status(201).json({ sucess: true , data: note });
            } catch (e) {
                res.status(400).json({ sucess: false });
            }
            break;

        case 'DELETE' : // Update note
            try {
                const deletedNote = await Note.deleteOne({ _id : id})

                if (!deletedNote){
                    res.status(400).json({ sucess: false });
                }

                res.status(201).json({ sucess: true , data: {} });
            } catch (e) {
                res.status(400).json({ sucess: false });
            }
            break;
        default:
            res.status(400).json({ sucess: false });
            break;
    }
}