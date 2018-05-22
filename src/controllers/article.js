import slug from 'slug';
import JWT from 'jsonwebtoken';
import Article from '../models/article';
import Genre from '../models/genre';
import Author from '../models/author';
import { SuccessResponse, ErrorResponse } from '../handlers/reponseHandler';

import { JWT_SECRET } from '../config/config';

export const listArticle = (req, h) => {
  return Article.find({})
    .populate('author')
    .populate('genre')
    .exec()
    .then(unsafeArticles => {
      const articles = unsafeArticles.map(article => ({
        title: article.title,
        slug: article.slug,
        text: article.text,
        author: {
          username: article.author.username,
          fullname: article.author.fullname,
          since: article.author.since,
          followerCount: article.author.followerCount,
          followingCount: article.author.followingCount
        },
        genre: {
          slug: article.genre.slug,
          name: article.genre.name
        },
        date: article.date
      }));
      return SuccessResponse({ articles: articles });
    })
    .catch(err => {
      return ErrorResponse(err, 500);
    });
};
export const listArticleByGenre = async (req, h) => {
  const genreId = await Genre.findOne({ slug: req.params.slug })
    .exec()
    .then(genre => {
      if (!genre) return ErrorResponse('No articles in genre', 404);
      return genre.id;
    })
    .catch(err => {
      return ErrorResponse(err, 500);
    });

  return Article.find({ genre: genreId })
    .populate('author')
    .populate('genre')
    .exec()
    .then(unsafeArticles => {
      const articles = unsafeArticles.map(article => ({
        title: article.title,
        slug: article.slug,
        text: article.text,
        author: {
          username: article.author.username,
          fullname: article.author.fullname,
          since: article.author.since,
          followerCount: article.author.followerCount,
          followingCount: article.author.followingCount
        },
        genre: {
          slug: article.genre.slug,
          name: article.genre.name
        },
        date: article.date
      }));
      return SuccessResponse({ articles: articles });
    })
    .catch(err => {
      return ErrorResponse(err, 500);
    });
};
export const listArticleByAuthor = async (req, h) => {
  const authorId = await Author.findOne({ username: req.params.username })
    .exec()
    .then(author => {
      if (!author) return ErrorResponse('No articles by author', 404);
      return author.id;
    })
    .catch(err => {
      return ErrorResponse(err, 500);
    });

  return Article.find({ author: authorId })
    .populate('author')
    .populate('genre')
    .exec()
    .then(unsafeArticles => {
      const articles = unsafeArticles.map(article => ({
        title: article.title,
        slug: article.slug,
        text: article.text,
        author: {
          username: article.author.username,
          fullname: article.author.fullname,
          since: article.author.since,
          followerCount: article.author.followerCount,
          followingCount: article.author.followingCount
        },
        genre: {
          slug: article.genre.slug,
          name: article.genre.name
        },
        date: article.date
      }));
      return SuccessResponse({ articles: articles });
    })
    .catch(err => {
      return ErrorResponse(err, 500);
    });
};
export const getArticle = (req, h) => {
  return Article.findOne({ slug: req.params.slug })
    .populate('author')
    .populate('genre')
    .exec()
    .then(unsafeArticle => {
      if (!unsafeArticle) return ErrorResponse('Article not found', 404);

      return SuccessResponse({
        article: {
          title: unsafeArticle.title,
          slug: unsafeArticle.slug,
          text: unsafeArticle.text,
          author: {
            username: unsafeArticle.author.username,
            fullname: unsafeArticle.author.fullname,
            since: unsafeArticle.author.since,
            followerCount: unsafeArticle.author.followerCount,
            followingCount: unsafeArticle.author.followingCount
          },
          genre: {
            slug: unsafeArticle.genre.slug,
            name: unsafeArticle.genre.name
          },
          date: unsafeArticle.date
        }
      });
    })
    .catch(err => {
      return ErrorResponse(err, 404);
    });
};

export const createArticle = (req, h) => {
  const { id } = JWT.verify(req.auth.token, JWT_SECRET);

  const articleData = {
    title: req.payload.title,
    slug: slug(req.payload.title, { symbols: false, lower: true }),
    text: req.payload.text,
    author: id,
    genre: req.payload.genre,
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
