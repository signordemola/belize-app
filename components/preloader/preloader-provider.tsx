"use client";

import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import Preloader from ".";

interface PreloaderProviderProps {
  children: React.ReactNode;
}

const PreloaderProvider = ({ children }: PreloaderProviderProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [pathname]);

  if (isLoading) {
    return <Preloader />;
  }

  return <>{children}</>;
};

export default PreloaderProvider;
