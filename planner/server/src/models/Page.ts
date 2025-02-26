import mongoose from 'mongoose';

export interface IPage extends mongoose.Document {
  name: string;
  color: string;
  userId: mongoose.Types.ObjectId;
}

const pageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  color: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for faster queries
pageSchema.index({ userId: 1 });

export const Page = mongoose.model<IPage>('Page', pageSchema); 