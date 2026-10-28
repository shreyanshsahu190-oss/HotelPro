export default function RoomCard({ room, onBook, cta = "Book stay" }) {
  const photo = room.photos?.[0];
  return (
    <div className="room-card">
      <img src={photo} alt={room.type} />
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <p className="eyebrow mb-1">Room {room.roomNumber}</p>
            <h4 className="mb-0">{room.type}</h4>
          </div>
          <div className="price-tag text-end">
            ₹{Number(room.rent).toLocaleString("en-IN")}
            <br />
            <small>/ night</small>
          </div>
        </div>
        <p className="text-muted">{room.description}</p>
        <div className="d-flex flex-wrap gap-2 mb-3">
          {(room.amenities || []).slice(0, 4).map((item) => (
            <span className="amenity" key={item}>{item}</span>
          ))}
        </div>
        {onBook && (
          <button className="btn btn-gold w-100" onClick={() => onBook(room)}>
            {cta}
          </button>
        )}
      </div>
    </div>
  );
}
