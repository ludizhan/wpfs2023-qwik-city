import { RequestHandler } from '@builder.io/qwik-city';

export const onGet: RequestHandler = async function ({ cookie, redirect }) {
  cookie.delete('oauth');
  throw redirect(307, '/');
}