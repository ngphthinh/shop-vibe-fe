import React, { useState, useEffect } from "react";
import type { ReviewListProps } from "../types/review.type";
import { formatDate } from "../../../utils/constants";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
// import { reviewService } from "../services/reviewService"; // Bật lại khi dùng
import { Button } from "../../../components/common/Button";
import { selectCurrentUser } from "../../auth/store/authSlice";
import { reviewService } from "../services/reviewService";
import { toast } from "react-toastify";
import { ConfirmDialog } from "../../../components/common/ConfirmDialog";

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }).map((_, i) => (
    <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>
      ★
    </span>
  ));
};

export const ReviewList: React.FC<ReviewListProps> = ({ reviews: initial }) => {
  const { t } = useTranslation();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const currentUser = useSelector(selectCurrentUser);
  const currentEmail = currentUser?.email?.toLowerCase();
  const [editRating, setEditRating] = useState<number>(0);
  const [reviews, setReviews] = useState(initial);

  // SỬA 3: Đồngbộ state khi component cha thay đổi data (API fetch xong)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReviews(initial);
  }, [initial]);
  const openDeleteConfirm = (id: number) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [loadingId, setLoadingId] = useState<number | null>(null);

  // Debug thử xem data thực tế là gì
  // console.log("Reviews hiện tại trong state:", reviews);
  const cancelDelete = () => {
    setDeleteId(null);
    setConfirmOpen(false);
  };
  if (!reviews || reviews.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        {t("reviews.noReviews") || "No reviews available"}
      </p>
    );
  }

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      setLoadingId(deleteId);

      await reviewService.deleteReview(deleteId);

      setReviews((prev) => prev.filter((r) => r.id !== deleteId));

      toast.success(t("reviews.reviewDeleted") || "Review deleted");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : t("reviews.deleteFailed");
      toast.error(errorMessage);
    } finally {
      setLoadingId(null);
      setDeleteId(null);
      setConfirmOpen(false);
    }
  };

  const handleUpdate = async (id: number) => {
    if (!editContent.trim()) return;

    try {
      setLoadingId(id);

      await reviewService.updateReview(id, {
        comment: editContent,
        rating: editRating,
      });

      setReviews((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, comment: editContent, rating: editRating } : r,
        ),
      );

      setEditingId(null);
      setEditContent("");
      setEditRating(0);
      toast.success(t("reviews.reviewUpdated") || "Review updated");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : t("reviews.updateFailed");
      toast.error(errorMessage);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        const isOwner = review.user?.email?.toLowerCase() === currentEmail;
        const isEditing = editingId === review.id;
        const isLoading = loadingId === review.id;

        return (
          <div
            key={review.id}
            className="border rounded-md p-2 bg-white shadow-sm space-y-1">
            {/* HEADER */}
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-xs text-gray-800">
                  {review.user?.fullName}
                </p>
                <p className="text-[10px] text-gray-400 leading-none">
                  {review.user?.email}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="scale-90 origin-right">
                  {renderStars(review.rating)}
                </div>

                {isOwner && (
                  <div className="flex gap-2 text-[10px]">
                    <Button
                      onClick={() => {
                        setEditingId(review.id);
                        setEditContent(review.comment);
                        setEditRating(review.rating);
                      }}
                      variant="blue"
                      size="sx">
                      {t("common.edit")}
                    </Button>

                    <Button
                      onClick={() => openDeleteConfirm(review.id)}
                      variant="error"
                      size="sx"
                      disabled={isLoading}>
                      {t("common.delete")}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* COMMENT */}
            {isEditing ? (
              <div className="space-y-2">
                <div className="flex gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setEditRating(i + 1)}
                      className={
                        i < editRating ? "text-yellow-400" : "text-gray-300"
                      }>
                      ★
                    </button>
                  ))}
                </div>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full text-xs border p-2 rounded outline-none focus:ring-1 focus:ring-blue-400"
                  rows={3}
                />

                <div className="flex justify-end gap-2">
                  <Button
                    onClick={() => {
                      setEditingId(null);
                      setEditContent("");
                    }}
                    size="sx"
                    variant="cancel_outline">
                    {t("common.cancel")}
                  </Button>

                  <Button
                    onClick={() => handleUpdate(review.id)}
                    disabled={!editContent.trim() || isLoading}
                    size="sx"
                    variant="save">
                    {t("common.save")}
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 text-xs leading-normal">
                {review.comment}
              </p>
            )}

            {/* DATE */}
            <p className="text-[10px] text-gray-400">
              {review.createdAt ? formatDate(review.createdAt) : ""}
            </p>
          </div>
        );
      })}
      <ConfirmDialog
        open={confirmOpen}
        title={t("reviews.deleteReview")}
        message={t("reviews.deleteConfirm")}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        loading={loadingId !== null}
      />
    </div>
  );
};
