import type {NextApiRequest, NextApiResponse} from 'next';
import dbConnect from "@/lib/db";
import Registration from "@/models/Registration";
import validator from 'validator';

interface IRegistration {
    name: string;
    roll: string;
    email: string;
    className: string;
    schoolName: string;
    approved: boolean;
    _id?:string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await dbConnect();

    if (req.method === 'GET') {
        // Handle GET request (pagination support)
        try {
            const {page = 1, limit = 10} = req.query;

            const parsedPage = parseInt(page as string, 10);
            const parsedLimit = parseInt(limit as string, 10);

            const skip = (parsedPage - 1) * parsedLimit;

            const coupons = await Registration.find({})
                .skip(skip)
                .limit(parsedLimit)
                .exec();

            res.status(200).json({
                success: true,
                data: coupons
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({success: false, error: 'Server Error'});
        }
    } else if (req.method === 'POST') {
        // Handle POST request (registration)
        try {
            // ... (your existing POST request handling logic)
        } catch (error) {
            console.error('Error:', error);
            res.status(400).json({success: false, error: 'Invalid data format'});
        }
    } else {
        res.status(405).json({success: false, error: 'Method Not Allowed'});
    }

    // Handle POST request
    if (req.method === 'POST') {
        try {
            const {name, roll, email, className, schoolName}: IRegistration = req.body;

            // Validate if all required fields are present
            const missingFields: string[] = [];
            if (!name) missingFields.push('name');
            if (!roll) missingFields.push('roll');
            if (!email || !validator.isEmail(email)) missingFields.push('email');
            if (!className) missingFields.push('className');
            if (!schoolName) missingFields.push('schoolName');

            if (missingFields.length > 0) {
                return res.status(400).json({
                    success: false,
                    error: `Missing or invalid required fields: ${missingFields.join(', ')}`,
                    fieldErrors: missingFields.reduce((acc, field) => {
                        switch (field) {
                            case 'name':
                                acc[field] = 'Name is required';
                                break;
                            case 'roll':
                                acc[field] = 'Roll is required';
                                break;
                            case 'email':
                                acc[field] = 'Invalid email format';
                                break;
                            case 'className':
                                acc[field] = 'ClassName is required';
                                break;
                            case 'schoolName':
                                acc[field] = 'SchoolName is required';
                                break;
                            default:
                                acc[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
                        }
                        return acc;
                    }, {} as Record<string, string>)
                });
            }

            // Check if there is an existing registration with the same email, roll,className, and schoolName
            const existingRegistration = await Registration.findOne({
                email,
                roll,
                className,
                schoolName
            });

            const fieldErrors: Record<string, string> = {};

            if (existingRegistration) {
                if (existingRegistration.email === email) {
                    fieldErrors.email = 'Email already exists for this course and semester';
                }

                if (existingRegistration.roll === roll) {
                    fieldErrors.roll = 'Roll already exists for this course and semester';
                }
            }

            if (Object.keys(fieldErrors).length > 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Duplicate fields',
                    fieldErrors,
                });
            }

            const registration = await Registration.create(req.body);
            res.status(201).json({success: true, data: registration});
        } catch (error) {
            res.status(400).json({success: false, error: 'Invalid data format'});
        }

    } else {
        res.status(405).json({success: false, error: 'Method Not Allowed'});
    }
}
