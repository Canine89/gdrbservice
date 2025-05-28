import React from "react";

interface RowData {
  [key: string]: string;
}

interface StatisticsItemTableProps {
  rows: RowData[];
  year: string;
  columns: string[];
}

function parseNumber(val: string | undefined): number {
  if (!val) return 0;
  if (typeof val !== "string") val = String(val);
  const num = parseFloat(val.replace(/,/g, ""));
  return isNaN(num) ? 0 : num;
}

function formatCurrency(num: number): string {
  return `₩${num.toLocaleString("ko-KR")}`;
}

export default function StatisticsItemTable({ rows, year, columns }: StatisticsItemTableProps) {
  // 동적으로 컬럼명 찾기
  const salesCol = columns.find(col => col.includes("예상 매출")) || "예상 매출";
  const priceCol = columns.find(col => col.includes("예상 가격")) || "예상 가격";
  const countCol = columns.find(col => col.includes("연 판매 부수")) || "연 판매 부수";

  const totalCount = rows.length;
  const totalSales = rows.reduce((sum, row) => sum + parseNumber(row[salesCol]), 0);
  const avgPrice = rows.length > 0 ? rows.reduce((sum, row) => sum + parseNumber(row[priceCol]), 0) / rows.length : 0;
  const salesArr = rows.map(row => parseNumber(row[salesCol])).filter(n => n > 0);
  const maxSales = salesArr.length ? Math.max(...salesArr) : 0;
  const minSales = salesArr.length ? Math.min(...salesArr) : 0;
  const salesCountArr = rows.map(row => parseNumber(row[countCol])).filter(n => n > 0);
  const maxCount = salesCountArr.length ? Math.max(...salesCountArr) : 0;
  const minCount = salesCountArr.length ? Math.min(...salesCountArr) : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-3 mt-6 md:mt-0">
      <h3 className="text-base font-bold text-gray-700 mb-2">{year}년 주요 통계</h3>
      <div className="flex flex-col gap-2 text-sm text-gray-700">
        <div><span className="font-semibold">총 계약 건수:</span> {totalCount}건</div>
        <div><span className="font-semibold">총 {salesCol}:</span> {formatCurrency(totalSales)}</div>
        <div><span className="font-semibold">평균 {priceCol}:</span> {formatCurrency(Math.round(avgPrice))}</div>
        <div><span className="font-semibold">최고 {salesCol}:</span> {formatCurrency(maxSales)}</div>
        <div><span className="font-semibold">최저 {salesCol}:</span> {formatCurrency(minSales)}</div>
        <div><span className="font-semibold">최고 {countCol}:</span> {maxCount.toLocaleString()}권</div>
        <div><span className="font-semibold">최저 {countCol}:</span> {minCount.toLocaleString()}권</div>
      </div>
    </div>
  );
} 