import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'in-progress', 'completed'], 
    default: 'pending' 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
}, { timestamps: true });

// Add index for search and status filter
taskSchema.index({ title: 'text' });
taskSchema.index({ status: 1 });
taskSchema.index({ userId: 1 });

export default mongoose.models.Task || mongoose.model('Task', taskSchema);
