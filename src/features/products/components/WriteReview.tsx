import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/common/Button";

type Props = {
  onSubmit: (data: { rating: number; comment: string }) => void;
  loading?: boolean;
};

export const WriteReview = ({ onSubmit, loading }: Props) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (!rating || !comment.trim()) return;

    onSubmit({ rating, comment });
    setRating(0);
    setComment("");
  };

  return (
    <div className="border rounded-xl p-4 bg-white space-y-3">
      {/* TITLE */}
      <div className="font-medium text-sm text-gray-800">
        {t("reviews.writeReview")}
      </div>

      {/* STARS */}
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => {
          const star = i + 1;

          return (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-2xl ${
                star <= rating ? "text-yellow-400" : "text-gray-300"
              }`}>
              ★
            </button>
          );
        })}
      </div>

      {/* COMMENT */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={t("reviews.commentPlaceholder")}
        className="w-full border rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-blue-400"
        rows={3}
      />

      {/* ACTION */}
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={!rating || !comment.trim() || loading}
          isLoading={loading}>
          {t("reviews.submitReview")}
        </Button>
      </div>
    </div>
  );
};
