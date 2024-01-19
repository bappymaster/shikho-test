
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/db';
import Registration from '@/models/Registration';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();

    if (req.method === 'POST') {
        const { approved, _id } = req.body;

        // Check if the 'approved' field is present
        if (approved === undefined) {
            return res.status(400).json({ success: false, error: "'approved' field is required" });
        }

        try {
            // Find the registration by ID
            const registration = await Registration.findById(_id);

            if (!registration) {
                return res.status(404).json({ success: false, error: 'Registration not found' });
            }

            // Update the registration status based on the 'approved' field
            registration.approved = approved;
            await registration.save();

            return res.status(200).json({ success: true, data: registration });
        } catch (error) {
            return res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    }

    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
}
