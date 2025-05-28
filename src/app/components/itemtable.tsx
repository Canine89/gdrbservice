import React, { useState, useEffect } from "react";
import StatisticsItemTable from "./statisticsitemtable";

interface RowData {
  [key: string]: string;
}

interface ItemTableProps {
  data: RowData[];
  columns: string[];
  currencyColumns: string[];
}

function getYear(dateStr: string | undefined): string | null {
  if (!dateStr) return null;
  // YYYY-MM-DD 또는 YYYY/MM/DD 등에서 연도만 추출
  const match = dateStr.match(/\d{4}/);
  return match ? match[0] : null;
}

const dateColumns = [
  "계약일",
  "계약서 상 집필 완료일",
  "예판일",
  "하판 예정일(20일 기준)",
];
const monthColumns = ["출간 예상월"];

function formatDateString(val: string, isMonthOnly = false): string {
  if (typeof val !== "string") {
    if (val === null || val === undefined) return "";
    val = String(val);
  }
  // Date(YYYY,MM,DD) 형식 처리
  const dateMatch = val.match(/^Date\((\d{4}),(\d{1,2}),(\d{1,2})\)$/);
  if (dateMatch) {
    const year = dateMatch[1];
    const month = String(Number(dateMatch[2]) + 1).padStart(2, "0");
    const day = String(Number(dateMatch[3])).padStart(2, "0");
    if (isMonthOnly) return `${year}-${month}`;
    return `${year}-${month}-${day}`;
  }
  // Date(YYYY,MM) 형식 (출간 예상월 등)
  const monthMatch = val.match(/^Date\((\d{4}),(\d{1,2})\)$/);
  if (monthMatch) {
    const year = monthMatch[1];
    const month = String(Number(monthMatch[2]) + 1).padStart(2, "0");
    return `${year}-${month}`;
  }
  return val;
}

function formatCurrency(val: string): string {
  if (typeof val !== "string") val = String(val);
  const num = parseFloat(val.replace(/,/g, ""));
  if (!isNaN(num)) {
    return `₩${num.toLocaleString("ko-KR")}`;
  }
  return val;
}

type SortState = {
  [year: string]: {
    column: string;
    direction: "asc" | "desc";
  } | null;
};

const 담당자색상: { [key: string]: string } = {
  "최현우": "bg-green-100",
  "박현규": "bg-blue-100",
  "오힘찬": "bg-yellow-100",
  "최혜민": "bg-pink-100",
  "김성경": "bg-purple-100",
  "윤신원": "bg-indigo-100",
  "박우현": "bg-teal-100",
  "차진우": "bg-orange-100",
  "정다운": "bg-red-100",
  "오은교": "bg-cyan-100",
};
const 계약자색상: { [key: string]: string } = {
  "최현우": "bg-green-100",
  "박현규": "bg-blue-100",
  "오힘찬": "bg-yellow-100",
  "최혜민": "bg-pink-100",
  "김성경": "bg-purple-100",
  "윤신원": "bg-indigo-100",
  "박우현": "bg-teal-100",
  "차진우": "bg-orange-100",
  "정다운": "bg-red-100",
  "오은교": "bg-cyan-100",
};

export default function ItemTable({ data, columns, currencyColumns }: ItemTableProps) {
  // 연도별로 그룹화
  const yearMap: { [year: string]: RowData[] } = {};
  data.filter(row => row["제목(공유 폴더 링크)"]).forEach(row => {
    const year = getYear(row["계약일"]);
    if (year) {
      if (!yearMap[year]) yearMap[year] = [];
      yearMap[year].push(row);
    }
  });
  const years = Object.keys(yearMap).sort((a, b) => Number(b) - Number(a));

  // 연도별 정렬 상태 관리
  const [sortState, setSortState] = useState<SortState>({});

  // 정렬 함수
  function getSortedRows(year: string, rows: RowData[]): RowData[] {
    const sort = sortState[year];
    if (!sort) return rows;
    const { column, direction } = sort;
    return [...rows].sort((a, b) => {
      const aVal = a[column] || "";
      const bVal = b[column] || "";
      // 숫자 비교 우선, 아니면 문자열 비교
      const aNum = parseFloat(aVal.replace(/,/g, ""));
      const bNum = parseFloat(bVal.replace(/,/g, ""));
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return direction === "asc" ? aNum - bNum : bNum - aNum;
      }
      return direction === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });
  }

  // 헤더 클릭 핸들러
  function handleHeaderClick(year: string, column: string) {
    setSortState(prev => {
      const prevSort = prev[year];
      if (prevSort && prevSort.column === column) {
        // 같은 컬럼이면 방향 토글
        return {
          ...prev,
          [year]: {
            column,
            direction: prevSort.direction === "asc" ? "desc" : "asc",
          },
        };
      } else {
        // 새 컬럼이면 asc로 시작
        return {
          ...prev,
          [year]: { column, direction: "asc" },
        };
      }
    });
  }

  return (
    <div className="flex flex-col gap-12">
      {years.map(year => (
        <div key={year + '-' + Math.random()} className="flex flex-col md:flex-row gap-4 items-start w-full box-border">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg md:text-xl font-bold mb-4 text-gray-800">{year}년 계약 기준</h2>
            <div className="overflow-x-auto w-full max-w-full">
              <table className="w-full table-fixed rounded-xl shadow-xl overflow-hidden bg-white">
                <colgroup>
                  {columns.map((col, idx) => {
                    // 예시: 제목(공유 폴더 링크)만 넓게, 나머지는 좁게
                    if (col === "제목(공유 폴더 링크)") {
                      return <col key={col} style={{ width: "32%" }} />;
                    }
                    return <col key={col} style={{ width: `${68 / (columns.length - 1)}%` }} />;
                  })}
                </colgroup>
                <thead>
                  <tr className="bg-gradient-to-r from-gray-100 via-gray-50 to-gray-200">
                    {columns.map(colKey => {
                      const isSorted = sortState[year]?.column === colKey;
                      const direction = sortState[year]?.direction;
                      return (
                        <th
                          key={colKey + '-' + Math.random()}
                          className="px-4 py-3 text-left font-semibold text-gray-800 whitespace-nowrap border-b border-gray-200 cursor-pointer select-none hover:bg-gray-100 transition"
                          onClick={() => handleHeaderClick(year, colKey)}
                        >
                          {colKey}
                          {isSorted && (
                            <span className="ml-1 align-middle text-xs">
                              {direction === "asc" ? "▲" : "▼"}
                            </span>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {getSortedRows(year, yearMap[year]).map((row, idx) => {
                    const rowKey = `${row["제목(공유 폴더 링크)"] || "no-title"}-${year}-${idx}-${Math.random()}`;
                    return (
                      <tr
                        key={rowKey}
                        className={`transition-colors duration-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50`}
                      >
                        {columns.map(colKey => {
                          let value = row[colKey] || "";
                          if (dateColumns.includes(colKey)) {
                            value = formatDateString(value);
                          } else if (monthColumns.includes(colKey)) {
                            value = formatDateString(value, true);
                          } else if (currencyColumns && currencyColumns.includes(colKey)) {
                            value = formatCurrency(value);
                          } else if (typeof value === "string" && value.match(/^Date\(\d{4},\d{1,2},\d{1,2}\)$/)) {
                            // Date(YYYY,MM,DD) 형식이면 날짜로 변환
                            value = formatDateString(value);
                          }
                          return (
                            <td
                              key={colKey + '-' + Math.random()}
                              className={
                                `px-4 py-2 border-b border-gray-100 whitespace-nowrap overflow-hidden text-ellipsis min-w-0` +
                                (colKey.match(/부수|가격|매출|페이지|지수|정가|예상월/) ? "text-right" : "text-gray-700") +
                                (colKey === "제목(공유 폴더 링크)" ? " text-gray-900" : "") +
                                (colKey === "담당자" && 담당자색상[value] ? ` ${담당자색상[value]}` : "") +
                                (colKey === "계약자" && 계약자색상[value] ? ` ${계약자색상[value]}` : "")
                              }
                            >
                              {value}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="w-full md:w-80 flex-shrink-0 max-w-full md:ml-2">
            <div className="max-w-[400px] w-full">
              <StatisticsItemTable rows={yearMap[year]} year={year} columns={columns} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 