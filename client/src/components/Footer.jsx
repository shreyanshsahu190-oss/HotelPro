export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-5">
            <h3 className="text-white">HotelPro</h3>
            <p className="mb-0">Complete hotel booking and management. Quiet luxury, considered service, rooms that feel like a private residence.</p>
          </div>
          <div className="col-md-3">
            <h6 className="text-white">Visit</h6>
            <p className="mb-0">Marine Drive, Mumbai<br />+91 22 4000 1200<br />stay@hotelpro.com</p>
          </div>
          <div className="col-md-4">
            <h6 className="text-white">Hours</h6>
            <p className="mb-0">Front desk open 24 hours<br />Check-in 2:00 PM · Check-out 11:00 AM</p>
          </div>
        </div>
        <hr className="border-secondary mt-4" />
        <p className="small mb-0">© {new Date().getFullYear()} HotelPro. All rights reserved.</p>
      </div>
    </footer>
  );
}
