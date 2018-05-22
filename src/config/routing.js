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
import {
  listArticle,
  getArticle,
  createArticle,
  updateArticle,
  removeArticle
} from '../controllers/article';
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
      handler: getGenre
    },

    /*  Article Related */

    articles: {
      method: 'GET',
      path: '/articles',
      handler: listArticle
    },
    article: {
      method: 'GET',
      path: '/article/{slug}',
      handler: getArticle
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
    createGenre: {
      method: 'POST',
      path: '/genre',
      handler: createGenre
    },
    updateGenre: {
      method: 'PUT',
      path: '/genre/{slug}',
      handler: updateGenre
    },
    deleteGenre: {
      method: 'DELETE',
      path: '/genre/{slug}',
      handler: removeGenre
    },

    /*  Article Related */

    createArticle: {
      method: 'POST',
      path: '/article',
      handler: createArticle
    },
    updateArticle: {
      method: 'PUT',
      path: '/article/{slug}',
      handler: updateArticle
    },
    deleteArticle: {
      method: 'DELETE',
      path: '/article/{slug}',
      handler: removeArticle
    }
  }
};
export default Routes;
