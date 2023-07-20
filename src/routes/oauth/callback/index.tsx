import { RequestHandler } from '@builder.io/qwik-city';
import { registerUserAuthPackage, tradeCodeForAuthPackage } from '~/lib/github/oauth';

export const onGet: RequestHandler = async function ({ query, cookie, redirect }) {
  const code = query.get('code');
  console.log({ code });
  if (!code) {
    throw redirect(307, '/');
  }

  const authPackage = await tradeCodeForAuthPackage(code);
  registerUserAuthPackage(code, authPackage);
  cookie.set('oauth', code, { path: '/' });

  throw redirect(307, '/');
}
