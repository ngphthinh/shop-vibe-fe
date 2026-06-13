import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface Props {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  placeholder?: [string, string];
}

const MONTHS_VI = [
  "dateRangeCalendar.months.0",
  "dateRangeCalendar.months.1",
  "dateRangeCalendar.months.2",
  "dateRangeCalendar.months.3",
  "dateRangeCalendar.months.4",
  "dateRangeCalendar.months.5",
  "dateRangeCalendar.months.6",
  "dateRangeCalendar.months.7",
  "dateRangeCalendar.months.8",
  "dateRangeCalendar.months.9",
  "dateRangeCalendar.months.10",
  "dateRangeCalendar.months.11",
];

const fmt = (d: Date) =>
  `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;

const toMidnight = (d: Date) => {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
};

const sameDay = (a: Date | null, b: Date | null) =>
  !!a &&
  !!b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const DateRangePicker = ({
  value,
  onChange,
  placeholder = ["Start date", "End date"],
}: Props) => {
  const { t } = useTranslation();
  const today = toMidnight(new Date());
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [startDate, setStartDate] = useState<Date | null>(
    value?.startDate ?? today,
  );
  const [endDate, setEndDate] = useState<Date | null>(value?.endDate ?? today);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [selecting, setSelecting] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const weekDays = t("dateRangeCalendar.weekDays", {
    returnObjects: true,
  }) as string[];
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSelecting(false);
        setHoverDate(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleDayClick = (d: Date) => {
    if (!selecting || !startDate) {
      setStartDate(toMidnight(d));
      setEndDate(null);
      setSelecting(true);
      onChange?.({ startDate: toMidnight(d), endDate: null });
    } else {
      let s = startDate;
      let e = toMidnight(d);
      if (e < s) [s, e] = [e, s];
      setStartDate(s);
      setEndDate(e);
      setSelecting(false);
      setHoverDate(null);
      onChange?.({ startDate: s, endDate: e });
    }
  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    setSelecting(false);
    setHoverDate(null);
    onChange?.({ startDate: null, endDate: null });
  };

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const rangeStart =
    selecting && hoverDate && startDate
      ? hoverDate >= startDate
        ? startDate
        : hoverDate
      : startDate;
  const rangeEnd =
    selecting && hoverDate && startDate
      ? hoverDate >= startDate
        ? hoverDate
        : startDate
      : endDate;

  const firstDay = new Date(viewYear, viewMonth, 1);
  const lastDay = new Date(viewYear, viewMonth + 1, 0);
  let startDow = firstDay.getDay();
  startDow = startDow === 0 ? 6 : startDow - 1;
  const totalCells = Math.ceil((startDow + lastDay.getDate()) / 7) * 7;

  const days = Array.from({ length: totalCells }, (_, i) => {
    const d = toMidnight(new Date(viewYear, viewMonth, 1 + (i - startDow)));
    return d;
  });

  const dayClass = (d: Date) => {
    const isThisMonth = d.getMonth() === viewMonth;
    const isStart = sameDay(d, rangeStart);
    const isEnd = sameDay(d, rangeEnd);
    const inRange = rangeStart && rangeEnd && d > rangeStart && d < rangeEnd;
    const isToday = sameDay(d, today);

    let cls =
      "relative h-9 flex items-center justify-center cursor-pointer select-none group";
    if (!isThisMonth) cls += " opacity-40";

    return { cls, isStart, isEnd, inRange: !!inRange, isToday };
  };

  const diffDays =
    startDate && endDate
      ? Math.round(
          (toMidnight(endDate).getTime() - toMidnight(startDate).getTime()) /
            86400000,
        )
      : null;

  return (
    <div ref={wrapRef} className="relative inline-block">
      {/* Input trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-2.5 hover:border-gray-300 transition-colors min-w-[320px]">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-400 shrink-0"
          aria-hidden="true">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
        <span
          className={`text-sm ${startDate ? "text-gray-900 font-medium" : "text-gray-400"}`}>
          {startDate ? fmt(startDate) : placeholder[0]}
        </span>
        <span className="text-gray-300 text-xs">→</span>
        <span
          className={`text-sm ${endDate ? "text-gray-900 font-medium" : "text-gray-400"}`}>
          {endDate ? fmt(endDate) : placeholder[1]}
        </span>
        {diffDays !== null && (
          <span className="ml-auto text-xs text-blue-600 font-medium shrink-0">
            {diffDays} {t("dateRangeCalendar.days")}
          </span>
        )}
      </button>

      {/* Calendar dropdown */}
      {open && (
        <div className="absolute top-full mt-2 left-0 z-50 bg-white border border-gray-100 rounded-xl shadow-lg w-[300px]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <button
              type="button"
              onClick={prevMonth}
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors"
              aria-label="Tháng trước">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <span className="text-sm font-medium text-gray-800">
              {t(MONTHS_VI[viewMonth])} {viewYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors"
              aria-label="Tháng sau">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          {/* Day of week */}
          <div className="grid grid-cols-7 px-2 pt-2">
            {weekDays.map((d) => (
              <div
                key={d}
                className="text-center text-[11px] text-gray-400 font-medium py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div
            className="grid grid-cols-7 px-2 pb-3 gap-y-0.5"
            onMouseLeave={() => setHoverDate(null)}>
            {days.map((d, i) => {
              const { cls, isStart, isEnd, inRange, isToday } = dayClass(d);
              return (
                <div
                  key={i}
                  className={cls}
                  onClick={() => handleDayClick(d)}
                  onMouseEnter={() => selecting && setHoverDate(d)}>
                  {/* range background stripe */}
                  <span
                    className={[
                      "absolute inset-0",
                      inRange ? "bg-blue-50" : "",
                      isStart && !sameDay(d, rangeEnd)
                        ? "bg-blue-50 rounded-l-full"
                        : "",
                      isEnd && !sameDay(d, rangeStart)
                        ? "bg-blue-50 rounded-r-full"
                        : "",
                    ].join(" ")}
                    aria-hidden="true"
                  />
                  {/* day dot */}
                  <span
                    className={[
                      "relative z-10 w-7 h-7 flex items-center justify-center rounded-full text-[13px] transition-colors",
                      isStart || isEnd ? "bg-blue-600 text-white" : "",
                      !isStart && !isEnd ? "group-hover:bg-gray-100" : "",
                      isToday && !isStart && !isEnd
                        ? "ring-1 ring-blue-500"
                        : "",
                    ].join(" ")}>
                    {d.getDate()}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 px-4 py-2.5 flex items-center justify-between">
            <span className="text-xs text-gray-400">
              {selecting
                ? "Chọn ngày kết thúc…"
                : startDate && endDate
                  ? `${diffDays} ${t("dateRangeCalendar.days")}`
                  : ""}
            </span>
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              {t("common.clear")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
