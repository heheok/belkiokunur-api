'use strict';

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const articleModel = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, index: { unique: true } },
  text: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  date: { type: Date, required: true },
  isPublished: { type: Boolean, required: true }
});

export default mongoose.model('Article', articleModel, 'articles');
