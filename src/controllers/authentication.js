import Author from '../models/author';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config';
import { redisGetAsync, redisSetAsync, redisDelAsync } from '../services/redis';
import { SuccessResponse, ErrorResponse } from '../handlers/reponseHandler';

export const expireUser = userId => {
  redisDelAsync(`JWT_${userId}`);
};

export const login = (req, h) => {
  return Author.findOne({ username: req.payload.username })
    .exec()
    .then(author => {
      if (!author) return ErrorResponse('Author not found', 404);
      if (!author.isActive)
        return ErrorResponse('Author account is not active', 403);
      if (bcrypt.compareSync(req.payload.password, author.password)) {
        const token = JWT.sign(
          { id: author.id, username: author.username },
          JWT_SECRET
        );
        redisSetAsync(`JWT_${author.id}`, token, 'EX', 600);
        return SuccessResponse(
          {
            token: token,
            author: {
              username: author.username,
              fullname: author.fullname,
              summary: author.summary
            }
          },
          'Logged in successfully'
        );
      }
      return ErrorResponse('Invalid Credentials', 403);
    });
};
export const logout = (req, h) => {
  try {
    const { id } = JWT.verify(req.auth.token, JWT_SECRET);
    expireUser(id);
    return SuccessResponse(null, 'Logged out succesfully', 200);
  } catch (err) {
    return ErrorResponse('You do not have access to see this page', 403);
  }
};

export const checkLogin = (req, h) => {
  try {
    const { id, username } = JWT.verify(req.auth.token, JWT_SECRET);
    return SuccessResponse({ verifiedUser: username }, 'ok', 200);
  } catch (err) {
    return ErrorResponse('You do not have access to see this page', 1403);
  }
};
