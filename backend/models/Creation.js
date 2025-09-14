import mongoose from 'mongoose';

const creationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  prompt: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  publish: {
    type: Boolean,
    default: false,
  },
  likes: {
    type: [String],
    default: [],
  },
}, { 
  timestamps: true 
});

const Creation = mongoose.model('Creation', creationSchema);

export default Creation;