import NextAuth, {CredentialsSignin, type User} from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

const { auth, signIn, handlers } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: {label: "Username", type: "text"},
        password: {label: "password", type: "password"},
      },

      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password)
          throw new CredentialsSignin("Please provide both email and password");

        const email = (credentials.email as string).trim().toLowerCase();
        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            username: true,
            password: true,
            role: true,
          },
        });
        if (!user || !user.password) return null;

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
        token.name = user.name ?? user.username ?? "";
        token.role = user.role as string;
      }

      return token;
    },

    async session({session, token}) {
      if (!token.id) {
        return {...session, user: undefined};
      }

      if (session.user) {
        session.user.id = Number(token.id);
        session.user.email = (token.email as string) ?? "";
        session.user.name = (token.name as string) ?? "";
        session.user.username = (token.username as string) ?? "";
        session.user.role = (token.role as string) ?? "";
      }

      return session;
    },
  },

  pages: {
    signIn: "/signin",
  },
});

export { auth, signIn, handlers };
export const { GET, POST } = handlers;
