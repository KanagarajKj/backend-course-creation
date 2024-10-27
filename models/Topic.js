import mongoose from "mongoose";

// Topic Schema
const topicSchema = new Schema({
  chapterId: {
    type: Schema.Types.ObjectId,
    ref: 'Chapter',
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
  order: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['video', 'article', 'quiz', 'assignment'],
    required: true
  },
  videoUrl: {
    type: String,
    required: function() {
      return this.type === 'video';
    }
  },
  duration: {
    type: Number,  // Duration in minutes
    required: function() {
      return this.type === 'video';
    }
  },
  attachments: [{
    name: String,
    url: String,
    type: String
  }],
  isCompleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model('Topic', topicSchema);
