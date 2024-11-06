import mongoose from "mongoose";
const { Schema } = mongoose;

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
  description: {
    type: String,
    required: true
  },
  content: {
    type: String,
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
    required: false
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
