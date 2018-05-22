'use strict';

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const authorModel = new Schema({
  username: { type: String, required: true, index: { unique: true } },
  fullname: { type: String, required: true },
  password: { type: String, required: true },
  summary: { type: String },
  since: { type: Date, required: true },
  isActive: { type: Boolean, required: true },
  followerCount: { type: Number },
  followingCount: { type: Number }
});

export default mongoose.model('Author', authorModel, 'authors');
