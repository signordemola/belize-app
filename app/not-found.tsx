import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, we couldn’t find the page you were looking for.</p>
      <Link
        href="/"
        style={{
          display: "inline-block",
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          border: "1px solid #ccc",
          borderRadius: "8px",
          textDecoration: "none",
        }}
      >
        Go back home
      </Link>
    </div>
  );
}
