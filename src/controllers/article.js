import slug from 'slug';
import Article from '../models/article';
import { SuccessResponse, ErrorResponse } from '../handlers/reponseHandler';
import JWT from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config';

export const listArticle = (req, h) => {
  return Article.find({})
    .exec()
    .then(articles => {
      return SuccessResponse({
        articles
      });
    })
    .catch(err => {
      return ErrorResponse(err, 500);
    });
};
export const getArticle = (req, h) => {
  return Article.findOne({ slug: req.params.slug })
    .exec()
    .then(article => {
      if (!article) return ErrorResponse('Article not found', 404);
      return SuccessResponse(article);
    })
    .catch(err => {
      return ErrorResponse('Article not found', 404);
    });
};

export const createArticle = (req, h) => {
  const { username } = JWT.verify(req.auth.token, JWT_SECRET);

  const articleData = {
    title: req.payload.title,
    slug: slug(req.payload.title, { symbols: false, lower: true }),
    text: req.payload.text,
    author: username,
    genre: 'hikaye',
    date: req.payload.date,
    isPublished: false
  };

  return Article.create(articleData)
    .then(article => {
      return SuccessResponse(article, 'Created Succesfully');
    })
    .catch(err => {
      return ErrorResponse(err, 500);
    });
};

export const updateArticle = (req, h) => {
  return Article.findOne({ slug: req.params.slug })
    .exec()
    .then(article => {
      if (!article) return ErrorResponse('Article not found', 404);

      if (req.payload.title) {
        article.title = req.payload.title;
        article.slug = slug(req.payload.title, { symbols: false, lower: true });
      }
      if (req.payload.text) article.text = req.payload.text;
    })
    .then(data => {
      return SuccessResponse(null, 'Article data updated successfully');
    })
    .catch(err => {
      return ErrorResponse(err, 500);
    });
};

export const removeArticle = async (req, h) => {
  return Article.findOneAndRemove({ slug: req.params.slug })
    .exec()
    .then(article => {
      if (!article) return ErrorResponse('Article not found', 404);
      article.remove().then().catch(err => {
        return ErrorResponse(
          'Internal Server Error, couldnt find article',
          404
        );
      });
      return SuccessResponse(null, 'Article removed successfully');
    })
    .catch(err => {
      return ErrorResponse('Internal Server Error, couldnt find article', 404);
    });
};
