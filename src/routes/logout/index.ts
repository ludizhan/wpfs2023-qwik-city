import { type RequestHandler } from "@builder.io/qwik-city";
import { deleteGitHubToken } from "~/lib/github/oauth";

export const onGet: RequestHandler = async function ({ cookie, redirect }) {
  const code = cookie.get("oauth");
  console.log("Received logout request:", code);
  if (code) {
    cookie.delete("oauth");
    deleteGitHubToken(code.value);
  }
  throw redirect(307, "/");
};
