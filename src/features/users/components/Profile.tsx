import React from "react";
import { Button } from "../../../components/common/Button";
import { userService } from "../services/userService";
import { useFetch } from "../../../hooks/useFetch";
import Loading from "../../../components/common/Loading";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { store } from "../../../app/store";
import { logout } from "../../auth/store/authSlice";
import { authService } from "../../auth/services/authService";
import { UpdateProfileModal } from "./UpdateProfileModal";
import { ChangePasswordModal } from "./ChangePasswordModal";

export const Profile: React.FC = () => {
  const { t } = useTranslation("", { keyPrefix: "profile" });
  const {
    data: profile,
    loading,
    refetch,
  } = useFetch(() => userService.getProfile());

  const [loadingLogout, setLoadingLogout] = React.useState(false);
  const user = store.getState().auth;
  const [openUpdate, setOpenUpdate] = React.useState(false);
  const [openChangePassword, setOpenChangePassword] = React.useState(false);
  const handleLogout = async () => {
    try {
      setLoadingLogout(true);

      await authService.logout({
        accessToken: user?.accessToken || "",
        refreshToken: user?.refreshToken || "",
      });
      toast.success("Logged out successfully");
      store.dispatch(logout());
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred during logout";

      toast.error(errorMessage);
    } finally {
      setLoadingLogout(false);
    }
  };

  if (loading || !profile) {
    return <Loading></Loading>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center text-2xl font-bold">
              {profile.fullName.charAt(0)}
            </div>

            <div>
              <h1 className="text-2xl font-bold">{profile.fullName}</h1>

              <p className="text-gray-500">{profile.email}</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div>
            <h2 className="font-semibold mb-3">{t("personalInfo")}</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">{t("fullName")}</label>
                <div className="mt-1 p-3 border rounded-lg">
                  {profile.fullName}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500">{t("email")}</label>
                <div className="mt-1 p-3 border rounded-lg">
                  {profile.email}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500">{t("phone")}</label>
                <div className="mt-1 p-3 border rounded-lg">
                  {profile.phone}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500">
                  {t("roleLabel")}
                </label>

                <div className="mt-1 flex flex-wrap gap-2">
                  {profile.roles.map((role) => (
                    <span
                      key={role}
                      className="px-3 py-1 bg-slate-100 rounded-full text-sm">
                      {t(`role.${role}`)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" onClick={() => setOpenUpdate(true)}>
              {t("updateInfo")}
            </Button>

            <Button
              variant="outline"
              onClick={() => setOpenChangePassword(true)}>
              {t("changePassword.title")}
            </Button>
            <Button variant="secondary">{t("myOrders")}</Button>

            <Button
              type="button"
              onClick={handleLogout}
              variant="outline"
              className="text-red-500 border-red-200 hover:border-red-500"
              isLoading={loadingLogout}>
              {t("logout")}
            </Button>
          </div>
        </div>
      </div>
      {openUpdate && (
        <UpdateProfileModal
          open={openUpdate}
          profile={profile}
          onSuccess={refetch}
          onClose={() => setOpenUpdate(false)}
        />
      )}
      <ChangePasswordModal
        open={openChangePassword}
        onClose={() => setOpenChangePassword(false)}
      />
    </div>
  );
};

export default Profile;
