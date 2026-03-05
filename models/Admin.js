import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Hash password before saving
adminSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    // Check if the password is already hashed (bcrypt hashes start with $2)
    // This is useful for migrations or if the password was hashed before calling save()
    if (this.password && this.password.startsWith('$2')) return;

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        console.error(`[Admin Model] Error hashing password for user: ${this.username}`, error);
        throw error;
    }
});

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
