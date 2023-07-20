import { RequestHandler } from '@builder.io/qwik-city';

export const onGet: RequestHandler = async function ({ query, cookie, redirect }) {
  cookie.set('oauth', query.get('code') ?? '', { path: '/' });
  throw redirect(307, '/');
}
