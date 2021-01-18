const mongoose = require('mongoose');
const { Schema } = mongoose;

const opts = {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  };

const CommentSchema = new Schema({
  content:  String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'post'
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],
  dislikes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],
}, opts);

module.exports = mongoose.model('comment', CommentSchema);