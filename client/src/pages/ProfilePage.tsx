import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const clearCart = useCartStore((state) => state.clearCart);

  const handleLogout = () => {
    logout();
    clearCart();
    navigate("/");
  };

  if (!user) {
    return (
      <div className="container-custom py-16 text-center">
        <h1 className="text-3xl font-serif text-gray-900 mb-3">Profile</h1>
        <p className="text-sm text-gray-600">No user data found.</p>
      </div>
    );
  }

  return (
    <div className="container-custom py-16">
      <div className="max-w-2xl mx-auto bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
        <h1 className="text-3xl font-serif text-gray-900 mb-6">Your Profile</h1>

        <div className="space-y-4 text-sm text-gray-600">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <span className="uppercase tracking-widest text-xs text-gray-500">
              Username
            </span>
            <span className="text-gray-900 font-medium">{user.username}</span>
          </div>
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <span className="uppercase tracking-widest text-xs text-gray-500">
              Email
            </span>
            <span className="text-gray-900 font-medium">{user.email}</span>
          </div>
          {user.phone && (
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="uppercase tracking-widest text-xs text-gray-500">
                Phone
              </span>
              <span className="text-gray-900 font-medium">{user.phone}</span>
            </div>
          )}
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <span className="uppercase tracking-widest text-xs text-gray-500">
              Role
            </span>
            <span className="text-gray-900 font-medium capitalize">
              {user.role}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="btn btn-outline w-full mt-8"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
