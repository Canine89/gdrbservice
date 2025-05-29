import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
if (!clientId || !clientSecret) {
  throw new Error("GOOGLE_CLIENT_ID와 GOOGLE_CLIENT_SECRET 환경변수가 필요합니다.");
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId,
      clientSecret,
    }),
  ],
  // 서비스 계정 키는 반드시 환경변수로 관리하고, 파일 직접 참조 금지
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };