"use client";
import { useSession } from "next-auth/react";

export default function Me() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>로딩 중...</div>;
  if (!session) return <div>로그인이 필요합니다.</div>;

  const { name, email } = session.user || {};

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-xl shadow text-center">
      <h2 className="text-2xl font-bold mb-4">내 정보</h2>
      <div className="text-lg font-semibold mb-2">{name}</div>
      <div className="text-gray-600 mb-2">{email}</div>
    </div>
  );
}
