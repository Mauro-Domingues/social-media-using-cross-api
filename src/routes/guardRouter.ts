/* eslint-disable no-useless-escape */
import { Router } from 'express';
import ensureAuthenticated from '@middlewares/EnsureAuthenticated';
import decodeJwt from '@middlewares/DecodeJwt';

interface IExceptionDTO {
  path: {
    /**
     * @example
     * All urls starts with '/^\/' to match.
     * Example: /^\//
     * Matches: '/'
     * @example
     * Prefix + Put the route to match it.
     * Example: /^\/example/
     * Matches: '/example'
     * @example
     * '\/' to match more '/' after the main route to specify a sub route.
     * Example: /^\/example\/sub-route/
     * Matches: '/example/sub-route'
     * @example
     * '.*' to match all after something.
     * Example: /^\/example\/.* /
     * Matches: '/example/anything' and '/example/literally-anything'
     * @example
     * '.+' to match all after something except the prefix.
     * Example: /example\/.+
     * Matches: '/example/anything' but not '/example/' by itself
     * @example
     * '([\/?].*)' matches all after '/' or '?' in a route.
     * Example: /example([\/?].*)/
     * Matches: '/example/123' and 'example?page=1'
     * @example
     * '([\/?].*)' + '?' matches all after '/' or '?' in a route and the route by itself
     * Example: /example([\/?].*)?/
     * Matches: '/example/123' and 'example?page=1' and '/example' but not '/example-other-path'
     */
    url: RegExp;
    methods: ('GET' | 'PATCH' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS')[];
  }[];
}

const guardRouter = Router();

const exceptions: IExceptionDTO = {
  path: [
    {
      url: /^\/keys/,
      methods: ['GET'],
    },
    {
      url: /^\/forgot-password/,
      methods: ['POST'],
    },
    {
      url: /^\/reset-password/,
      methods: ['POST'],
    },
    {
      url: /^\/login/,
      methods: ['POST'],
    },
    {
      url: /^\/register/,
      methods: ['POST'],
    },
    {
      url: /^\/profiles([\/?].*)?/,
      methods: ['GET'],
    },
    {
      url: /^\/posts([\/?].*)?/,
      methods: ['GET'],
    },
    {
      url: /^\/comments([\/?].*)?/,
      methods: ['GET'],
    },
    {
      url: /^\/answers([\/?].*)?/,
      methods: ['GET'],
    },
  ],
};

guardRouter.use(ensureAuthenticated.unless(exceptions));
guardRouter.use(decodeJwt);

export default guardRouter;
