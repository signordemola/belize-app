"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    console.error(error);

    if (retryCount < 3) {
      const timer = setTimeout(() => {
        setRetryCount((prev) => prev + 1);
        reset();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error, retryCount, reset]);

  return (
    <div className="flex items-center justify-center min-h-[85dvh] w-full flex-col text-center space-y-4">
      <h2 className="text-2xl font-semibold text-danger-600">
        Something went wrong!
      </h2>

      {retryCount >= 3 && (
        <Button variant="destructive" onClick={() => reset()}>
          <span>Reload Page</span>
        </Button>
      )}
    </div>
  );
}
