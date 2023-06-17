import { axiosServer } from "@/axiosServer";
import buildLink from "@/urls";
import NextAuth from "next-auth";
import cookie from "cookie";
import CredentialsProvider from "next-auth/providers/credentials";
import { signOut } from "next-auth/react";

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "login",
      async authorize(credentials, req) {
        const cookies = req.headers.cookie;
        const parsedCookies = cookie.parse(cookies);

        const host_cookie = parsedCookies["site-local-name"];
        const token = parsedCookies["api-token"];
        // const hostname = "https://www.ishtari.com/";

        try {
          //const hostname = req.headers.host;

          const response = await axiosServer.post(
            buildLink("login", undefined, undefined),
            credentials,
            {
              headers: {
                Authorization: "Bearer " + token,
              },
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
                : null,
            };
          } else {
            throw new Error(response.data.errors["0"]?.errorMsg);
          }
        } catch (error) {
          throw new Error(error.message);
        }
      },
    }),
    CredentialsProvider({
      id: "signup",
      async authorize(credentials, req) {
        const cookies = req.headers.cookie;
        const parsedCookies = cookie.parse(cookies);
        const token = parsedCookies["api-token"];
        try {
          //const hostname = req.headers.host;
          const hostname = "https://www.ishtari.com/";
          return await axiosServer.post(
            buildLink("register", undefined, undefined, hostname),
            credentials,
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
        } catch (error) {
          throw new Error(error.message);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.customer_id = user.customer_id;
        token.firstname = user.firstname;
        token.lastname = user.lastname;
        token.telephone = user.telephone;
      }
      return token;
    },
    async signIn({ user }) {
      if (user) return true;

      return false;
    },
    async session({ session, token }) {
      session.user.isLoggedIn = true;
      session.user.customer_id = token.customer_id;
      session.user.firstname = token.firstname;
      session.user.lastname = token.lastname;
      session.user.telephone = token.telephone;
      return session;
    },
    async signOut({ callbackUrl, req, res }) {
      return "/";
    },
  },
};

export default NextAuth(authOptions);
