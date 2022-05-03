import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    })
  ],
  theme: {
    colorScheme: 'light',
    logo: 'https://i.imgur.com/E3IqcQu.png'
  },
  callbacks: {
    async session({ session, token }) {
      session.userId = token.sub;
      return session;
    }
  },
  secret: process.env.SECRET
});
