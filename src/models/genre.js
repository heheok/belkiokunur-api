'use strict';

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const genreModel = new Schema({
  name: { type: String, required: true, index: { unique: true } },
  slug: { type: String, required: true }
});

export default mongoose.model('Genre', genreModel, 'genres');
