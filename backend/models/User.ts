import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { localDb, IUser } from '../config/db.js';

export interface IUserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  matchPassword(enteredPassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user'
    },
    phone: {
      type: String,
      default: ''
    },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      postalCode: { type: String, default: '' },
      country: { type: String, default: '' }
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const UserModel = mongoose.models.User || mongoose.model<IUserDocument>('User', userSchema);

// Data abstraction that delegates to Mongoose if connected, or localDb
export const UserRepo = {
  async findByEmail(email: string): Promise<IUser | null> {
    if (localDb.mode === 'mongodb' && mongoose.connection.readyState === 1) {
      const u = await UserModel.findOne({ email: email.toLowerCase() });
      return u ? (u.toObject() as unknown as IUser) : null;
    }
    const found = localDb.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    return found ? { ...found } : null;
  },

  async findById(id: string): Promise<IUser | null> {
    if (localDb.mode === 'mongodb' && mongoose.connection.readyState === 1) {
      const u = await UserModel.findById(id);
      return u ? (u.toObject() as unknown as IUser) : null;
    }
    const found = localDb.users.find(u => u._id === id);
    return found ? { ...found } : null;
  },

  async create(userData: Partial<IUser>): Promise<IUser> {
    if (localDb.mode === 'mongodb' && mongoose.connection.readyState === 1) {
      const created = await UserModel.create(userData);
      return created.toObject() as unknown as IUser;
    }
    const now = new Date().toISOString();
    const newUser: IUser = {
      _id: `usr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: userData.name || '',
      email: (userData.email || '').toLowerCase(),
      password: userData.password || '',
      role: userData.role || 'user',
      phone: userData.phone || '',
      address: userData.address || {},
      createdAt: now,
      updatedAt: now
    };
    localDb.users.push(newUser);
    localDb.save();
    return { ...newUser };
  },

  async update(id: string, updates: Partial<IUser>): Promise<IUser | null> {
    if (localDb.mode === 'mongodb' && mongoose.connection.readyState === 1) {
      const updated = await UserModel.findByIdAndUpdate(id, updates, { new: true });
      return updated ? (updated.toObject() as unknown as IUser) : null;
    }
    const index = localDb.users.findIndex(u => u._id === id);
    if (index === -1) return null;
    localDb.users[index] = {
      ...localDb.users[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    localDb.save();
    return { ...localDb.users[index] };
  },

  async count(): Promise<number> {
    if (localDb.mode === 'mongodb' && mongoose.connection.readyState === 1) {
      return await UserModel.countDocuments();
    }
    return localDb.users.length;
  },

  async getAll(): Promise<IUser[]> {
    if (localDb.mode === 'mongodb' && mongoose.connection.readyState === 1) {
      const list = await UserModel.find({}, '-password');
      return list.map(item => item.toObject() as unknown as IUser);
    }
    return localDb.users.map(({ password, ...u }) => ({ ...u, password: '' }));
  }
};
