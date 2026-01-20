import "./Loader.css";

export default function Loader({ fullscreen = false, message = "Loading..." }) {
  if (fullscreen) {
    return (
      <div className="loader-fullscreen">
        <div className="loader-content">
          <div className="loader-spinner-large"></div>
          <p className="loader-message">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="loader-inline">
      <div className="spinner"></div>
      <span>{message}</span>
    </div>
  );
}
