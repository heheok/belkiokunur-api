import {
  listAuthor,
  getAuthor,
  createAuthor,
  updateAuthor,
  removeAuthor
} from '../controllers/author';
import {
  listGenre,
  getGenre,
  createGenre,
  updateGenre,
  removeGenre
} from '../controllers/genre';
import { login, logout } from '../controllers/authentication';

const Routes = {
  publicRoutes: {
    login: {
      method: 'POST',
      path: '/login',
      handler: login
    },
    register: {
      method: 'POST',
      path: '/author',
      handler: createAuthor
    },
    authors: {
      method: 'GET',
      path: '/authors',
      handler: listAuthor
    },
    author: {
      method: 'GET',
      path: '/author/{username}',
      handler: getAuthor
    },
    genres: {
      method: 'GET',
      path: '/genres',
      handler: listGenre
    },
    genre: {
      method: 'GET',
      path: '/genre/{slug}',
      handler: listGenre
    }
  },
  privateRoutes: {
    logout: {
      method: 'GET',
      path: '/logout',
      handler: logout
    },
    // AUTHOR RELATED
    updateAuthor: {
      method: 'PUT',
      path: '/author/{username}',
      handler: updateAuthor
    },
    deleteAuthor: {
      method: 'DELETE',
      path: '/author/{username}',
      handler: removeAuthor
    },
    // GENRE RELATED
    updateGenre: {
      method: 'PUT',
      path: '/genre/{slug}',
      handler: updateGenre
    },
    deleteGenre: {
      method: 'DELETE',
      path: '/genre/{slug}',
      handler: removeGenre
    }
  }
};
export default Routes;
