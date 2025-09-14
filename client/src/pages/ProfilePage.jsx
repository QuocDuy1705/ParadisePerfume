import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/styles/auth.css";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/auth"); // nếu chưa login thì đưa về trang login
          return;
        }

        // Lấy profile
        const resUser = await axios.get(
          "http://localhost:5000/api/users/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(resUser.data);

        // Lấy order history
        const resOrders = await axios.get(
          "http://localhost:5000/api/orders/myorders",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrders(resOrders.data);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        navigate("/auth"); // token hỏng thì cũng đưa về login
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth"); // logout về login
  };

  if (loading) return <p className="loading-text">Loading your account...</p>;

  return (
    <div className="auth-container">
      <h1 className="brand-title">MY ACCOUNT</h1>

      {user && (
        <div className="profile-box">
          <p>
            <strong>Name:</strong> {user.firstName} {user.lastName}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Country:</strong> {user.country || "Not set"}
          </p>

          <button className="btn-black" onClick={handleLogout}>
            LOGOUT
          </button>
        </div>
      )}

      <h2 className="section-title">MY ORDERS</h2>
      <div className="orders-box">
        {orders.length === 0 ? (
          <p className="empty-text">You have no orders yet.</p>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>ORDER ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id.slice(-6).toUpperCase()}</td>
                  <td>
                    {new Date(order.createdAt).toLocaleDateString("en-GB")}
                  </td>
                  <td>
                    {order.totalPrice.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </td>
                  <td>{order.isPaid ? "Paid" : "Pending"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
