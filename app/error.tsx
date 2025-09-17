"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button
        onClick={() => reset()}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        Try again
      </button>
    </div>
  );
}
