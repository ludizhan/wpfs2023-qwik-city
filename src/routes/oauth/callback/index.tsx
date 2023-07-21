import { type RequestHandler } from "@builder.io/qwik-city";
import { registerGitHubToken, tradeCodeForToken } from "~/lib/github/oauth";

export const onGet: RequestHandler = async function ({
  query,
  cookie,
  redirect,
}) {
  const code = query.get("code");
  console.log({ code });
  if (!code) {
    throw redirect(307, "/");
  }

  const authPackage = await tradeCodeForToken(code);
  registerGitHubToken(code, authPackage);
  cookie.set("oauth", code, { path: "/" });

  throw redirect(307, "/");
};
