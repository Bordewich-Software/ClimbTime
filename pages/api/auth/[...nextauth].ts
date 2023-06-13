import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const options = {

  providers: [
    CredentialsProvider({
      name: "Password",
      credentials: {
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = { id: "1", name: "admin" }; // First of his name, ruler of the timer. All hail!

        return credentials?.password === process.env.PAGE_PASSWORD ? user : null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }: Record<string, any>) {
      session.user.id = token.id;
      return session;
    },
  },
};

const handleAuth = (req: any, res: any) => NextAuth(req, res, options)

export default handleAuth;
