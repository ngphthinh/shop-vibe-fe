import React from "react";

interface SectionProps {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode; // slot for buttons/badges in header
}

const Section = ({ title, children, action }: SectionProps) => (
  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50 px-5 py-3">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {title}
      </h2>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
    <div className="divide-y divide-slate-100 px-5">{children}</div>
  </div>
);

export default Section;