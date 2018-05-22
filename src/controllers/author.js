import Author from '../models/author';
import bcrypt from 'bcrypt';
import { expireUser } from './authentication';
import { SuccessResponse, ErrorResponse } from '../handlers/reponseHandler';

export const listAuthor = (req, h) => {
  return Author.find({})
    .exec()
    .then(authors => {
      return SuccessResponse({
        authors: authors.map(author => {
          return {
            username: author.username,
            fullname: author.fullname,
            summary: author.summary
          };
        })
      });
    })
    .catch(err => {
      return ErrorResponse(err, 500);
    });
};

export const getAuthor = (req, h) => {
  return Author.findOne({ username: req.params.username })
    .exec()
    .then(author => {
      if (!author) return ErrorResponse('Author not found', 404);
      return SuccessResponse({
        author: {
          _id: author._id,
          username: author.username,
          fullname: author.fullname,
          summary: author.summary
        }
      });
    })
    .catch(err => {
      return ErrorResponse('Author not found', 404);
    });
};

export const createAuthor = (req, h) => {
  const authorData = {
    username: req.payload.username,
    fullname: req.payload.fullname,
    password: bcrypt.hashSync(req.payload.password, 10),
    summary: req.payload.summary,
    since: req.payload.since,
    isActive: true,
    followerCount: 0,
    followingCount: 0
  };

  return Author.create(authorData)
    .then(author => {
      const { username, fullname, summary } = author;
      return SuccessResponse(
        { author: { username, fullname, summary } },
        'Created Succesfully'
      );
    })
    .catch(err => {
      return ErrorResponse(err, 500);
    });
};

export const updateAuthor = (req, h) => {
  return Author.findOne({ username: req.params.username })
    .exec()
    .then(author => {
      if (!author) return ErrorResponse('Author not found', 404);
      if (req.payload.username) author.username = req.payload.username;
      if (req.payload.fullname) author.fullname = req.payload.fullname;
      if (req.payload.password) author.password = req.payload.password;
      if (req.payload.summary) author.summary = req.payload.summary;
      author.save(author);
    })
    .then(data => {
      return SuccessResponse(null, 'Author data updated successfully');
    })
    .catch(err => {
      return ErrorResponse(err, 500);
    });
};

export const removeAuthor = async (req, h) => {
  return Author.findOneAndRemove({ username: req.params.username })
    .exec()
    .then(author => {
      if (!author) return ErrorResponse('Author not found', 404);
      expireUser(author.id);
      author.remove().then().catch(err => {
        return ErrorResponse('Internal Server Error, couldnt find author', 404);
      });
      return SuccessResponse(null, 'Author removed successfully');
    })
    .catch(err => {
      return ErrorResponse('Internal Server Error, couldnt find author', 404);
    });
};
