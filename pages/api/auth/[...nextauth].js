import { axiosServer } from "@/axiosServer";
import buildLink from "@/urls";
import NextAuth from "next-auth";
import cookie from "cookie";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import { signOut } from "next-auth/react";

export const authOptions = {
  
  providers: [
    CredentialsProvider({

      id: "login",
      async authorize(credentials, req) {
        let site_host = "";
        const cookies = req.headers.cookie;
        const parsedCookies = cookie.parse(cookies);

        const host_cookie = parsedCookies["site-local-name"];
        const token = parsedCookies["api-token"];
        // const hostname = "https://www.ishtari.com/";
        const hostname = req.headers.host;

        try {
          if (typeof host_cookie !== "undefined") {
            site_host = host_cookie;
          } else {
            site_host = hostname;
          }

          const response = await axiosServer.post(
            buildLink("login", undefined, undefined, site_host),
            credentials,
            {
              headers: {
                Authorization: "Bearer " + token
              }
            }
          );

          if (response.data.success) {
            return {
              customer_id: response.data.data.customer_id,
              name: "user",
              // username: response.data.data.username,
              // seller_logged: response.data.data.seller_logged,
              email: response.data.data.email,
              firstname: response.data.data.firstname,
              lastname: response.data.data.lastname,
              telephone: response.data.data.telephone
                ? response.data.data.telephone
                : null
            };
          } else {
            throw new Error(response.data.errors["0"]?.errorMsg);
          }
        } catch (error) {
          throw new Error(error.message);
        }
      }
    }),
    CredentialsProvider({
      id: "signup",
      async authorize(credentials, req) {
        const cookies = req.headers.cookie;
        const parsedCookies = cookie.parse(cookies);
        const host_cookie = parsedCookies["site-local-name"];
        const token = parsedCookies["api-token"];
        let site_host = "";
        try {
          //const hostname = req.headers.host;
          const hostname = req.headers.host;
          if (typeof host_cookie !== "undefined") {
            site_host = host_cookie;
          } else {
            site_host = hostname;
          }
          const response = await axiosServer.post(
            buildLink("register", undefined, undefined, site_host),
            credentials,
            {
              headers: {
                Authorization: "Bearer " + token
              }
            }
          );
          if (response.data.success) {
            return response;
          } else {
            throw new Error(response.data?.errors[0]?.errorMsg);
          }
        } catch (error) {
          throw new Error(error.message);
        }
      }
    }),
    FacebookProvider({
      clientId:    '130719880936639',
      clientSecret: '4619d8d5d7e5ac00d59e5ffbbb7bf475',
     callbackUrl: 'https://www.ishtari.com/api/auth/callback/facebook'

    })
  ],
  callbacks: {
    async jwt({ token, user , account, profile, isNewUser}) {
      if (user) {
        token.customer_id = user.customer_id;
        token.firstname = user.firstname;
        token.lastname = user.lastname;
        token.telephone = user.telephone;
      }

      if (account?.provider === 'facebook' && user?.id) {
        token.facebookUserId = user.id;
        token.name = profile.name;
        token.username = profile.username;
        token.accessToken = account.access_token;


      }


      return token;
    },
    async session({ session, token }) {
      console.log(session, token)
      console.log("testtttt")
      session.user.isLoggedIn = true;
      // session.user.customer_id = token.customer_id;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.id = token.facebookUserId;
      session.accessToken = token.accessToken;

      return session;
    },
    async signIn({ user }) {
      if (user) return true;
      return false;
    },
    async signOut({ callbackUrl, req, res }) {
      return "/";
    }
  }
};

export default (req, res) => NextAuth(req, res, authOptions);

function getFacebookClientIdByHost(req) {
  let clientId;
  const hostname = req.headers.host;
  // Set different client IDs based on host names
  if (hostname === "ishtari.com") {
    clientId = "130719880936639";
  } else if (hostname === "ishtari.com.gh" ||  hostname === "next.ishtari.com.gh"  ) {
    clientId = "1044051939655564";
  } else {
    clientId = "130719880936639";
  }

  return clientId;
}
