import React from "react";

interface CalendarProps {
  data: any[];
}

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  // Date(YYYY,MM,DD) 포맷 처리
  const match = dateStr.match(/^Date\((\d{4}),(\d{1,2}),(\d{1,2})\)$/);
  if (match) {
    const [, y, m, d] = match;
    return new Date(Number(y), Number(m), Number(d));
  }
  // 혹시 다른 포맷도 있을 수 있으니 fallback
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) return d;
  return null;
}

function getDateMap(data: any[]) {
  // { 'YYYY-MM': { [day]: { type: '예판'|'하판', title: string }[] } }
  const map: Record<string, Record<number, { type: string; title: string }[]>> = {};
  data.forEach(row => {
    const title = row["제목(공유 폴더 링크)"];
    if (!title) return;
    ["예판일", "하판 예정일(20일 기준)"].forEach(type => {
      const dateStr = row[type];
      if (!dateStr) return;
      const date = parseDate(dateStr);
      if (!date) return;
      const ym = `${date.getFullYear()}-${date.getMonth() + 1}`;
      if (!map[ym]) map[ym] = {};
      if (!map[ym][date.getDate()]) map[ym][date.getDate()] = [];
      map[ym][date.getDate()].push({ type, title });
    });
  });
  return map;
}

function getYearsFromData(data: any[]) {
  const years = new Set<number>();
  data.forEach(row => {
    ["예판일", "하판 예정일(20일 기준)"].forEach(type => {
      const date = parseDate(row[type]);
      if (date) years.add(date.getFullYear());
    });
  });
  // 최신 연도부터 내림차순 정렬
  return Array.from(years).sort((a, b) => b - a);
}

export default function Calendar({ data }: CalendarProps) {
  const dateMap = getDateMap(data);
  const years = getYearsFromData(data);
  const thisYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = React.useState<number>(thisYear);
  const today = new Date();
  const [tooltip, setTooltip] = React.useState<{x: number, y: number, title: string} | null>(null);

  React.useEffect(() => {
    // data가 바뀌면 올해가 years에 있으면 올해로, 없으면 최신 연도로 변경
    if (years.includes(thisYear)) setSelectedYear(thisYear);
    else if (years.length > 0) setSelectedYear(years[0]);
  }, [data]);

  return (
    <div className="w-full flex flex-col items-center">
      {years.length > 1 && (
        <div className="w-full flex justify-center mb-6">
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(Number(e.target.value))}
            className="border rounded px-2 py-1 text-lg"
          >
            {years.map(year => (
              <option key={year} value={year}>{year}년</option>
            ))}
          </select>
        </div>
      )}
      <div className="w-full mb-12">
        <div className="w-full flex flex-wrap justify-center gap-8">
          {Array.from({ length: 12 }, (_, i) => {
            const month = i + 1;
            const firstDay = new Date(selectedYear, i, 1).getDay();
            const lastDate = new Date(selectedYear, month, 0).getDate();
            const ym = `${selectedYear}-${month}`;
            const monthMap = dateMap[ym] || {};

            // 달력 셀 생성
            const cells = [];
            for (let j = 0; j < firstDay; j++) cells.push(<td key={`empty-${j}`}></td>);
            for (let d = 1; d <= lastDate; d++) {
              const marks = monthMap[d];
              // 오늘 날짜인지 확인
              const isToday =
                selectedYear === today.getFullYear() &&
                month === today.getMonth() + 1 &&
                d === today.getDate();
              // 지나간 날짜인지 확인
              const isPast =
                new Date(selectedYear, month - 1, d).getTime() <
                new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
              cells.push(
                <td key={d} className={`relative h-16 w-16 align-top
                  ${isToday ? 'bg-blue-100' : ''}
                  ${isPast && !isToday ? 'bg-gray-100' : ''}
                `}>
                  <div className={isToday ? 'font-bold text-blue-700 text-base' : 'text-base'}>
                    <span>{d}</span>
                  </div>
                  {marks && marks.map((mark, idx) => (
                    <div
                      key={idx}
                      className={`text-sm rounded px-1 py-1 mt-1 min-h-[2rem] ${mark.type === "예판일" ? "bg-blue-200 text-blue-800" : "bg-green-200 text-green-800"}`}
                      onMouseEnter={e => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltip({
                          x: rect.left + window.scrollX,
                          y: rect.top + window.scrollY,
                          title: mark.title
                        });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    >
                      {mark.type === "하판 예정일(20일 기준)" ? "하판일" : mark.type}
                    </div>
                  ))}
                </td>
              );
            }
            // 7일씩 행으로 나누기
            const rows = [];
            for (let k = 0; k < cells.length; k += 7) {
              rows.push(<tr key={k}>{cells.slice(k, k + 7)}</tr>);
            }

            return (
              <div
                key={month}
                className={`rounded-xl shadow p-6 mb-8 bg-white ${selectedYear === today.getFullYear() && month === today.getMonth() + 1 ? 'border-4 border-blue-600' : ''}`}
                style={{ minWidth: 420, maxWidth: 420, width: 420 }}
              >
                <div className="text-lg font-bold mb-2 text-center">{selectedYear}년 {month}월</div>
                <table className="w-full text-center">
                  <thead>
                    <tr className="text-gray-500">
                      <th>일</th><th>월</th><th>화</th><th>수</th><th>목</th><th>금</th><th>토</th>
                    </tr>
                  </thead>
                  <tbody>{rows}</tbody>
                </table>
                {/* 월별 예판일/하판일 책 제목 리스트 */}
                <div className="mt-4 text-left">
                  {/* 예판일 */}
                  <div className="mb-2">
                    <span className="font-semibold text-blue-700">예판일</span>
                    <ul className="list-disc ml-5">
                      {Object.values(monthMap)
                        .flat()
                        .filter(mark => mark.type === "예판일")
                        .map((mark, idx, arr) => (
                          <li key={idx} className="truncate max-w-full" style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} title={mark.title}>{mark.title}</li>
                        ))}
                    </ul>
                  </div>
                  {/* 하판일 */}
                  <div>
                    <span className="font-semibold text-green-700">하판일</span>
                    <ul className="list-disc ml-5">
                      {Object.values(monthMap)
                        .flat()
                        .filter(mark => mark.type === "하판 예정일(20일 기준)")
                        .map((mark, idx, arr) => (
                          <li key={idx} className="truncate max-w-full" style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} title={mark.title}>{mark.title}</li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* 캘린더 전체 하단에 툴크 렌더 */}
      {tooltip && (
        <div
          className="fixed z-50 px-5 py-3 bg-black text-white text-base rounded shadow max-w-xs whitespace-pre-line break-words pointer-events-none"
          style={{ left: tooltip.x + 24, top: tooltip.y + 24 }}
        >
          {tooltip.title}
        </div>
      )}
    </div>
  );
} 