"use client";
import React, { useEffect, useState } from "react";
import Navbar from "./components/navbar";
import ItemTable from "./components/itemtable";
import Calendar from "./components/calendar";
import { useSession, signIn, signOut } from "next-auth/react";
import Me from "./components/me";
import { visibleColumnNames } from "./config/visibleColumns";
import Mail from "./components/mail";

interface RowData {
  [key: string]: string;
}

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1P5xHo0FiwEGX2ZIXzJ7peWe7oMJlt3Y0eddDzcXCYoM/gviz/tq?tqx=out:json&gid=2076644208";

const currencyColumns = ["예상 가격", "예상 매출"];

export default function Home() {
  const [data, setData] = useState<RowData[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"table" | "calendar" | "me" | "mail">("table");
  const { data: session, status } = useSession();

  useEffect(() => {
    fetch(SHEET_URL)
      .then((res) => res.text())
      .then((text) => {
        const json = JSON.parse(text.replace(/^[^\(]*\(|\);?$/g, ""));
        const cols = json.table.cols.map((col: any) => col.label);
        const rows = json.table.rows.map((row: any) => {
          const obj: RowData = {};
          row.c.forEach((cell: any, idx: number) => {
            obj[cols[idx]] = cell?.v ?? "";
          });
          return obj;
        });
        setColumns(cols);
        setData(rows);
        setLoading(false);
      });
  }, []);

  const filteredColumns = columns.filter((col) => visibleColumnNames.includes(col));

  // 버튼 클릭 핸들러
  const handleTableClick = () => setView("table");
  const handleCalendarClick = () => setView("calendar");
  const handleMeClick = () => setView("me");
  const handleMailClick = () => setView("mail");

  // 인증 확인 중
  if (status === "loading") {
    return <div className="w-full flex justify-center items-center min-h-[300px] text-lg text-gray-500">인증 확인 중...</div>;
  }

  // 로그인 안 했을 때
  if (!session) {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-screen">
        <button
          onClick={() => signIn('google')}
          className="border border-blue-600 text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-600 hover:text-white transition-colors duration-150"
        >
          구글 계정으로 로그인
        </button>
      </div>
    );
  }

  // 이메일 도메인 체크
  const email = session.user?.email || "";
  if (!email.endsWith("@goldenrabbit.co.kr")) {
    const { name } = session.user || {};
    return (
      <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-xl shadow text-center">
        <h2 className="text-2xl font-bold mb-4">내 정보</h2>
        <div className="text-lg font-semibold mb-2">{name}</div>
        <div className="text-gray-600 mb-2">{email}</div>
        <button
          onClick={() => signOut()}
          className="mt-4 border border-gray-400 px-4 py-2 rounded hover:bg-gray-100"
        >
          로그아웃
        </button>
      </div>
    );
  }

  return (
    <>
      <Navbar onTableClick={handleTableClick} onCalendarClick={handleCalendarClick} onMeClick={handleMeClick} onMailClick={handleMailClick} />
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center py-8">
        <div className="w-full max-w flex flex-col md:flex-row gap-8 items-start pr-8 pl-8">
          <div className="flex-1 w-full flex flex-col gap-6 self-start">
            {view === "mail" ? (
              <Mail />
            ) : view === "me" ? (
              <Me />
            ) : view === "table" ? (
              loading ? (
                <div className="w-full flex justify-center items-center min-h-[300px] text-lg text-gray-500">로딩 중...</div>
              ) : (
                <ItemTable
                  data={data}
                  columns={filteredColumns}
                  currencyColumns={currencyColumns}
                />
              )
            ) : (
              <Calendar data={data} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
