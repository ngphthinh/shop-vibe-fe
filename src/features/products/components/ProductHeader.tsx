import { Button } from "../../../components/common/Button";

interface Props {
  total: number;
  onAdd: () => void;
}

export default function ProductHeader({ total, onAdd }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-xl font-semibold">Quản lý sản phẩm</h1>
        <p className="text-sm text-gray-400">{total} sản phẩm</p>
      </div>

      <Button variant="primary" size="sm" onClick={onAdd}>
        Thêm sản phẩm
      </Button>
    </div>
  );
}
