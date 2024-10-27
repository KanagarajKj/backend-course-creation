import mongoose from "mongoose";
const { Schema } = mongoose;

// Discussion Schema
const discussionSchema = new Schema({
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  topicId: {
    type: Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',  // Assuming you have a User model
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  replies: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    likes: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }]
  }],
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  isPinned: {
    type: Boolean,
    default: false
  },
  isResolved: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model('Discussion', discussionSchema);
