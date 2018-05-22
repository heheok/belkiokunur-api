import Author from '../models/author';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config';
import { redisGetAsync, redisSetAsync } from '../services/redis';

export const login = (req, h) => {
  return Author.findOne({ username: req.payload.username })
    .exec()
    .then(author => {
      if (!author) return { message: 'Author not found' };
      if (bcrypt.compareSync(req.payload.password, author.password)) {
        const token = JWT.sign(
          { id: author.id, username: author.username },
          JWT_SECRET
        );
        redisSetAsync(`JWT_${author.id}`, token, 'EX', 60);
        return { message: 'Author identified', token: token };
      }
      return { message: 'invalid credentials' };
    });
};
