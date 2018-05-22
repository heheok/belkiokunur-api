import Author from '../models/author';
import bcrypt from 'bcrypt';

export const listAuthor = (req, h) => {
  return Author.find({})
    .exec()
    .then(authors => {
      return {
        authors: authors.map(author => {
          return {
            _id: author._id,
            username: author.username,
            fullname: author.fullname,
            summary: author.summary
          };
        })
      };
    })
    .catch(err => {
      return { err: err };
    });
};

export const getAuthor = (req, h) => {
  return Author.findById(req.params.id).exec().then(author => {
    if (!author) return { message: 'Author not found' };
    return {
      author: {
        _id: author._id,
        username: author.username,
        fullname: author.fullname,
        summary: author.summary
      }
    };
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
      return {
        message: 'Author created successfully',
        author: { username, fullname, summary }
      };
    })
    .catch(err => {
      return { err: err };
    });
};

export const updateAuthor = (req, h) => {
  return Author.findById(req.params.id)
    .exec()
    .then(author => {
      if (!author) return { err: 'Author not found' };

      (author.username = req.payload.username), (author.fullname =
        req.payload.fullname), (author.password =
        req.payload.password), (author.summary =
        req.payload.summary), author.save(author);
    })
    .then(data => {
      return { message: 'Author data updated successfully' };
    })
    .catch(err => {
      return { err: err };
    });
};

export const removeAuthor = (req, h) => {
  return Author.findById(req.params.id).exec(function(err, author) {
    if (err) return { dberror: err };
    if (!author) return { message: 'Author not found' };

    author.remove(function(err) {
      if (err) return { dberror: err };

      return { success: true };
    });
  });
};
