import { getColor } from "../../../utils/constants";

type Props = {
  label: string;
  value: number | string;
};

const StatCard: React.FC<Props> = ({ label, value }) => {
  const colorClass = getColor(label);

  return (
    <div className={`p-3 rounded-md border shadow-sm ${colorClass}`}>
      <div className="text-[11px] text-gray-600">{label}</div>

      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
};

export default StatCard;
