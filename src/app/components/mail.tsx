import React, { useState } from "react";

export default function Mail() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 실제 메일 발송 로직은 추후 구현
    alert("메일 발송 기능은 준비 중입니다.");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">메일 자동화</h2>
      <div className="mb-3">
        <label className="block mb-1 font-medium">수신자 이메일</label>
        <input
          type="email"
          className="w-full border px-3 py-2 rounded"
          value={to}
          onChange={e => setTo(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="block mb-1 font-medium">제목</label>
        <input
          type="text"
          className="w-full border px-3 py-2 rounded"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="block mb-1 font-medium">본문</label>
        <textarea
          className="w-full border px-3 py-2 rounded"
          rows={6}
          value={body}
          onChange={e => setBody(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
      >
        메일 발송
      </button>
    </form>
  );
} 