import dbConnect from '@backend/utils/DatabaseConnection'

dbConnect();

export default async (req, res) => {
  res.json({ test: 'test'} );
}