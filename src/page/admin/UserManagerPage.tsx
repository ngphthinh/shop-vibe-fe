import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import type { User } from "../../features/users/types/user.type";
import type { PaginationResponse } from "../../types/api.type";

import Loading from "../../components/common/Loading";
import { Button } from "../../components/common/Button";
import Pagination from "../../components/common/Pagination";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";

import { userService } from "../../features/users/services/userService";
import { useFetch } from "../../hooks/useFetch";
import { formatDate } from "../../utils/constants";

const DEFAULT_USERS = 5;

export default function UserManagerPage() {
  const { t } = useTranslation("", { keyPrefix: "users.admin" });
  const { t: t_default } = useTranslation();

  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [pendingAction, setPendingAction] = useState<{
    id: number;
    isLock: boolean;
  } | null>(null);

  const {
    data: paginate,
    loading,
    refetch,
  } = useFetch<PaginationResponse<User>>(() =>
    userService.getUsers(currentPage, DEFAULT_USERS),
  );

  useEffect(() => {
    refetch();
  }, [refetch, currentPage]);

  const handleToggleClick = (u: User) => {
    setSelectedUser(u);
    setPendingAction({
      id: u.id,
      isLock: u.active ?? false,
    });
    setConfirmOpen(true);
  };

  const handleConfirmToggle = async () => {
    if (!pendingAction) return;

    setLoadingId(pendingAction.id);

    try {
      await userService.toggleActive(pendingAction.id, pendingAction.isLock);

      toast.success(
        pendingAction.isLock ? t("lockSuccess") : t("unlockSuccess"),
      );

      refetch();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error");
    } finally {
      setLoadingId(null);
      setConfirmOpen(false);
      setPendingAction(null);
      setSelectedUser(null);
    }
  };

  if (loading || !paginate) return <Loading />;

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-4">
      {/* TITLE */}
      <h1 className="text-lg sm:text-xl font-semibold">{t("title")}</h1>

      {/* ================= MOBILE CARD ================= */}
      <div className="sm:hidden space-y-3">
        {paginate.content.map((u) => (
          <div
            key={u.id}
            className="bg-white border rounded-xl p-4 space-y-3 shadow-sm">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-gray-900">{u.fullName}</p>
                <p className="text-xs text-gray-500">{u.email}</p>
              </div>

              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  u.active
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}>
                {u.active ? t("status.active") : t("status.locked")}
              </span>
            </div>

            {/* Info */}
            <div className="text-xs text-gray-600 space-y-1">
              <p>{u.phone}</p>
              <p>{formatDate(u.createdAt)}</p>
            </div>

            {/* Roles */}
            <div className="flex flex-wrap gap-1">
              {u.roles.map((role) => (
                <span key={role} 
                className="px-2 py-0.5 text-xs bg-slate-100 rounded-full"
                >{t_default(`profile.role.${role}`)}</span>
              ))}
            </div>

            {/* Action */}
            <Button
              variant={u.active ? "error" : "primary"}
              className="w-full text-xs"
              disabled={loadingId === u.id}
              onClick={() => handleToggleClick(u)}>
              {u.active ? t("lockUser") : t("unlockUser")}
            </Button>
          </div>
        ))}
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden sm:block bg-white border rounded-xl overflow-x-auto">
        <table className="min-w-[750px] w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">{t("table.fullName")}</th>
              <th className="p-3 text-left">{t("table.email")}</th>
              <th className="p-3 text-left">{t("table.phone")}</th>
              <th className="p-3 text-left">{t("table.role")}</th>
              <th className="p-3 text-left">{t("table.status")}</th>
              <th className="p-3 text-left">{t("table.joinedAt")}</th>
              <th className="p-3 text-right">{t("table.actions")}</th>
            </tr>
          </thead>

          <tbody>
            {paginate.content.map((u) => (
              <tr key={u.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{u.fullName}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.phone}</td>
                <td className="p-3">
                  {u.roles.map((role) => (
                    <span
                      key={role}
                      className="px-2 py-0.5 text-xs bg-slate-100 rounded-full mr-1">
                      {t_default(`profile.role.${role}`)}
                    </span>
                  ))}
                </td>
                <td className="p-3">
                  <span
                    className={u.active ? "text-green-600" : "text-red-500"}>
                    {u.active ? t("status.active") : t("status.locked")}
                  </span>
                </td>
                <td className="p-3">{formatDate(u.createdAt)}</td>
                <td className="p-3 text-right">
                  <Button
                    variant={u.active ? "error" : "primary"}
                    disabled={loadingId === u.id}
                    onClick={() => handleToggleClick(u)}>
                    {u.active ? t("lockUser") : t("unlockUser")}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <Pagination
        pageCount={paginate.totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {/* CONFIRM DIALOG */}
      <ConfirmDialog
        open={confirmOpen}
        title={selectedUser?.active ? t("lockUser") : t("unlockUser")}
        message={
          selectedUser
            ? selectedUser.active
              ? t("lockConfirm", {
                  name: selectedUser.fullName,
                })
              : t("unlockConfirm", {
                  name: selectedUser.fullName,
                })
            : ""
        }
        loading={loadingId !== null}
        onCancel={() => {
          setConfirmOpen(false);
          setSelectedUser(null);
          setPendingAction(null);
        }}
        onConfirm={handleConfirmToggle}
      />
    </div>
  );
}
