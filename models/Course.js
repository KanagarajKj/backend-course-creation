import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  chapter: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
    minlength: 50,
  },
  coverImage: {
    type: String,
    required: false,
  },
  salesVideo: {
    type: String,
    required: false,
  },
  faq: [
    {
      question: { type: String, required: false },
      answer: { type: String, required: false },
      id: { type: String, required: false },
    },
  ],
  isDraft: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model('Course', courseSchema);
