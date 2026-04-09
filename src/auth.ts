import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { prisma } from '@/utils/prisma';

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: 'jwt', maxAge: 3600 },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;
        if (typeof email !== 'string' || typeof password !== 'string') {
          return null;
        }
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;
        const valid = await compare(password, user.password);
        if (!valid) return null;
        return {
          id: String(user.id),
          email: user.email,
          name: user.name ?? undefined,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        if (user.name !== undefined && user.name !== null) {
          token.name = user.name;
        }
        if (user.email) token.email = user.email;
      }

      if (trigger === 'update' && session?.name) {
        token.name = session.name;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        if (typeof token.name === 'string') session.user.name = token.name;
        if (typeof token.email === 'string') session.user.email = token.email;
      }
      return session;
    },
  },
});
