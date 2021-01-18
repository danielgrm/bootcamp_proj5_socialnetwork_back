const mongoose = require('mongoose');
const { Schema } = mongoose;

const opts = {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  };

const UserSchema = new Schema({
    name: String,
    username: String,
    email: {
      type : String,
      unique: true
    },
    senha: {
        type: String,
        select : false
    },
    follows: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    place: String,
    picture: String,
    account_confirmed : Boolean,
    privacy_term_accepted: Boolean,
   
}, opts);

module.exports = mongoose.model('user', UserSchema);
