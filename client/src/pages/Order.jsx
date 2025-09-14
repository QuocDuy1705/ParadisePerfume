// import { useEffect, useState } from "react";
// import axios from "axios";

// const Orders = () => {
//   const [orders, setOrders] = useState([]);

//   useEffect(() => {
//     const fetch = async () => {
//       const res = await axios.get("/api/orders/my", {
//         headers: {
//           Authorization: `Bearer ${
//             JSON.parse(localStorage.getItem("user")).token
//           }`,
//         },
//       });
//       setOrders(res.data);
//     };
//     fetch();
//   }, []);

//   return (
//     <div className="p-6">
//       <h2>Lịch sử đơn hàng</h2>
//       {orders.map((order) => (
//         <div key={order._id} className="border p-4 my-2">
//           <div>
//             Trạng thái: <b>{order.status}</b>
//           </div>
//           <div>Tổng: {order.total.toLocaleString()}đ</div>
//           <ul>
//             {order.items.map((i) => (
//               <li key={i.productId._id}>
//                 {i.productId.name} x {i.quantity}
//               </li>
//             ))}
//           </ul>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Orders;
