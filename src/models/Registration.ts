import mongoose, {Schema} from 'mongoose';

const RegistrationSchema = new Schema({
    name: String,
    roll: String,
    email: String,
    className: String,
    schoolName: String,
    approved: {
        type: Boolean,
        default: false,
    },
});

export default mongoose.models.Registration || mongoose.model('Registration', RegistrationSchema);
