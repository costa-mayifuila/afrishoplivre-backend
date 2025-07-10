import mongoose from 'mongoose';

const ClipSchema = new mongoose.Schema({
  videoUrl: {
    type: String,
    required: true,
  },

  productLink: {
    type: String,
    required: true,
  },

  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  likes: {
    type: Number,
    default: 0,
  },

  likedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],

  shares: {
    type: Number,
    default: 0,
  },

  sharedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Clip = mongoose.model('Clip', ClipSchema);

export default Clip;
