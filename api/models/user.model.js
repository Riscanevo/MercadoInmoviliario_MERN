import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: [true, 'El nombre de usuario es obligatorio'], unique: true },
    email: { type: String, required: [true, 'El correo electrónico es obligatorio'], unique: true },
    password: { type: String, required: [true, 'La contraseña es obligatoria'] },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;