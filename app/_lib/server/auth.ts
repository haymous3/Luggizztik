import NextAuth, {CredentialsSignin, type User} from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/app/_lib/server/prisma";
import bcrypt from "bcryptjs";

export const {
  auth,
  signIn,
  handlers: {GET, POST},
} = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {label: "Username", type: "text"},
        password: {label: "password", type: "password"},
      },

      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password)
          throw new CredentialsSignin("Please provide both email and password");

        // 1️ Find user
        const user = await prisma.user.findUnique({
          where: {email: credentials.email as string},
        });
        if (!user || !user.password) return null;

        // 2️ Compare password with bcrypt
        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) return null;

        return {
          id: Number(user.id),
          name: user.username ?? "",
          role: user.role,
          email: user.email,
          username: user.email,
        };
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  session: {strategy: "jwt", maxAge: 60 * 60 * 4, updateAge: 60 * 30},
  callbacks: {
    authorized({auth}) {
      return !!auth?.user;
    },

    jwt: async ({token, user}) => {
      if (user) {
        token.id = user.id as number;
        token.username = user.username;
        token.email = user.email;
        token.role = user.role as string;
      }

      return token;
    },

    async session({session, token}) {
      const dbUser = await prisma.user.findUnique({
        where: {id: Number(token.id)},
      });

      //  If user no longer exists, return empty session (type-safe)
      if (!dbUser) {
        throw new Error("User not found");

        return {...session, user: undefined};
      }

      if (session.user) {
        session.user.id = dbUser.id;
        session.user.email = dbUser.email;
        session.user.username = dbUser.username;
        session.user.role = dbUser.role;
      }

      return session;
    },
  },

  pages: {
    signIn: "/signin",
  },
});
