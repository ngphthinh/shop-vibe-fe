import React from "react";

interface RowProps {
  label: string;
  value: React.ReactNode;
  muted?: boolean;
  mono?: boolean;
}

const Row = ({ label, value, muted, mono }: RowProps) => (
  <div className="flex flex-col gap-0.5 py-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
    <span className="text-xs font-medium uppercase tracking-wide text-slate-400 sm:min-w-[130px] sm:text-sm sm:normal-case sm:tracking-normal">
      {label}
    </span>
    <span
      className={`break-words text-sm sm:text-right ${
        muted ? "italic text-slate-400" : "text-slate-800"
      } ${mono ? "font-mono text-xs" : ""}`}>
      {value}
    </span>
  </div>
);

export default Row;
