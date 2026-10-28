import { useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import api from "../api.js";
import { useAuth } from "../AuthContext.jsx";

const emptyRoom = {
  roomNumber: "",
  type: "Deluxe",
  rent: "",
  count: 1,
  description: "",
  photos: "",
  amenities: "",
};

export default function AdminHome() {
  const { user } = useAuth();
  const [key, setKey] = useState("bookings");
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyRoom);
  const [message, setMessage] = useState("");

  const load = async () => {
    const [b, r, u] = await Promise.all([
      api.get("/bookings/getallbookings"),
      api.get("/rooms/getallrooms"),
      api.get("/user/getallusers"),
    ]);
    setBookings(b.data);
    setRooms(r.data);
    setUsers(u.data);
  };

  useEffect(() => {
    load().catch(() => {});
  }, []);

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const addRoom = async (e) => {
    e.preventDefault();
    setMessage("");
    await api.post("/rooms/addroom", {
      roomNumber: Number(form.roomNumber),
      type: form.type,
      rent: Number(form.rent),
      count: Number(form.count),
      description: form.description,
      photos: form.photos.split(",").map((s) => s.trim()).filter(Boolean),
      amenities: form.amenities.split(",").map((s) => s.trim()).filter(Boolean),
    });
    setForm(emptyRoom);
    setMessage("Room added");
    load();
  };

  const removeRoom = async (id) => {
    await api.delete(`/rooms/deleteroom/${id}`);
    load();
  };

  return (
    <>
      <section className="dash-hero">
        <div className="container">
          <p className="eyebrow">Administrator</p>
          <h1>Welcome, {user?.name}</h1>
          <p className="mb-0">Manage rooms, bookings, and the guest register.</p>
        </div>
      </section>
      <section className="section pt-4">
        <div className="container">
          <div className="row g-3 mb-4">
            <div className="col-md-4"><div className="stat-card"><p className="eyebrow mb-1">Bookings</p><h2>{bookings.length}</h2></div></div>
            <div className="col-md-4"><div className="stat-card"><p className="eyebrow mb-1">Rooms</p><h2>{rooms.length}</h2></div></div>
            <div className="col-md-4"><div className="stat-card"><p className="eyebrow mb-1">Guests</p><h2>{users.length}</h2></div></div>
          </div>

          <div className="panel">
            <Tabs activeKey={key} onSelect={setKey} className="admin-tabs mb-4">
              <Tab eventKey="bookings" title="All Bookings">
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>Guest</th>
                        <th>Room</th>
                        <th>Dates</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b) => (
                        <tr key={b._id}>
                          <td>{b.username}<br /><small>{b.phone}</small></td>
                          <td>{b.type}</td>
                          <td>{b.fromdate} → {b.todate}</td>
                          <td>₹{Number(b.totalAmount).toLocaleString("en-IN")}</td>
                          <td>
                            <span className={`badge ${b.status === "cancelled" ? "badge-cancelled" : "badge-booked"}`}>
                              {b.status === "cancelled" ? "Cancelled" : "Active"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Tab>
              <Tab eventKey="rooms" title="All Rooms">
                <div className="row g-3">
                  {rooms.map((room) => (
                    <div className="col-md-6" key={room._id}>
                      <div className="d-flex gap-3 border rounded-4 p-3">
                        <img src={room.photos?.[0]} alt="" style={{ width: 110, height: 80, objectFit: "cover", borderRadius: 12 }} />
                        <div className="flex-grow-1">
                          <strong>{room.type} · #{room.roomNumber}</strong>
                          <p className="small text-muted mb-1">₹{room.rent} · {room.count} units</p>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => removeRoom(room._id)}>Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Tab>
              <Tab eventKey="add" title="Add Room">
                {message && <div className="alert alert-success py-2">{message}</div>}
                <form className="row g-3" onSubmit={addRoom}>
                  <div className="col-md-4">
                    <label className="form-label">Room number</label>
                    <input className="form-control" name="roomNumber" required value={form.roomNumber} onChange={change} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Type</label>
                    <select className="form-select" name="type" value={form.type} onChange={change}>
                      <option>Single</option>
                      <option>Double</option>
                      <option>Deluxe</option>
                      <option>Suite</option>
                      <option>Family</option>
                      <option>Presidential</option>
                    </select>
                  </div>
                  <div className="col-md-2">
                    <label className="form-label">Rent</label>
                    <input className="form-control" name="rent" required value={form.rent} onChange={change} />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label">Count</label>
                    <input className="form-control" name="count" required value={form.count} onChange={change} />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Description</label>
                    <textarea className="form-control" name="description" required value={form.description} onChange={change} />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Photo URLs (comma separated)</label>
                    <input className="form-control" name="photos" value={form.photos} onChange={change} />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Amenities (comma separated)</label>
                    <input className="form-control" name="amenities" value={form.amenities} onChange={change} />
                  </div>
                  <div className="col-12">
                    <button className="btn btn-gold">Add room</button>
                  </div>
                </form>
              </Tab>
              <Tab eventKey="users" title="All Users">
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u._id}>
                          <td>{u.name}</td>
                          <td>{u.email}</td>
                          <td>{u.phone}</td>
                          <td>{u.userType}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>
      </section>
    </>
  );
}
