export default function Button({ label, type = "key", wide = false, onClick }) {
  return (
    <button
      className={["btn", `btn-${type}`, wide ? "btn-wide" : ""].join(" ").trim()}
      onClick={onClick}
      aria-label={label}
      type="button"
    >
      {label}
    </button>
  );
}
