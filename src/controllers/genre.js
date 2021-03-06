import slug from 'slug';
import Genre from '../models/genre';
import { SuccessResponse, ErrorResponse } from '../handlers/reponseHandler';

export const listGenre = (req, h) => {
  return Genre.find({})
    .exec()
    .then(genres => {
      return SuccessResponse({
        genres
      });
    })
    .catch(err => {
      return ErrorResponse(err, 500);
    });
};

export const getGenre = (req, h) => {
  return Genre.findOne({ slug: req.params.slug })
    .exec()
    .then(genre => {
      if (!genre) return ErrorResponse('Genre not found', 404);
      return SuccessResponse(genre);
    })
    .catch(err => {
      return ErrorResponse('Genre not found', 404);
    });
};

export const createGenre = (req, h) => {
  const genreData = {
    name: req.payload.name,
    slug: slug(req.payload.name, { symbols: false, lower: true })
  };

  return Genre.create(genreData)
    .then(genre => {
      return SuccessResponse(genre, 'Created Succesfully');
    })
    .catch(err => {
      return ErrorResponse(err, 500);
    });
};

export const updateGenre = (req, h) => {
  return Genre.findOne({ slug: req.params.slug })
    .exec()
    .then(genre => {
      if (!genre) return ErrorResponse('Genre not found', 404);
      genre.name = req.payload.name;
      genre.slug = slug(req.payload.name, { symbols: false, lower: true });
      genre.save(genre);
    })
    .then(data => {
      return SuccessResponse(null, 'Genre data updated successfully');
    })
    .catch(err => {
      return ErrorResponse(err, 500);
    });
};

export const removeGenre = async (req, h) => {
  return Genre.findOneAndRemove({ slug: req.params.slug })
    .exec()
    .then(genre => {
      if (!genre) return ErrorResponse('Genre not found', 404);
      genre.remove().then().catch(err => {
        return ErrorResponse('Internal Server Error, couldnt find genre', 404);
      });
      return SuccessResponse(null, 'Genre removed successfully');
    })
    .catch(err => {
      return ErrorResponse('Internal Server Error, couldnt find genre', 404);
    });
};
