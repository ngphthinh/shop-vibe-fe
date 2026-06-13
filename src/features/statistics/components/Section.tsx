import React from "react";

type Props = {
  title: string;
  children: React.ReactNode;
};
// Section.tsx
const Section: React.FC<Props> = ({ title, children }) => {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {title}
      </h2>
      <div className="divide-y divide-slate-50">{children}</div>
    </div>
  );
};

export default Section;
