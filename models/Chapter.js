import mongoose from 'mongoose';
const { Schema } = mongoose;

// Chapter Schema
const chapterSchema = new Schema({
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  order: {
    type: Number,
    required: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  duration: {
    type: Number,  // Duration in minutes
    required: false
  }
}, { timestamps: true });

export default mongoose.model('Chapter', chapterSchema);