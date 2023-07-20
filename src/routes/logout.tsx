import { RequestHandler } from '@builder.io/qwik-city';
import { deleteUserAuthPackage } from '~/lib/github/oauth';

export const onGet: RequestHandler = async function ({ cookie, redirect }) {
  const code = cookie.get('oauth');
  if (code) {
    cookie.delete('oauth');
    deleteUserAuthPackage(code.value);
  }
  throw redirect(307, '/');
}