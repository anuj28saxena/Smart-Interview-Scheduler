export function ScreenMessage({ title, message }) {
  return (
    <section className="screen-message">
      <strong>{title}</strong>
      {message && <p>{message}</p>}
    </section>
  );
}
