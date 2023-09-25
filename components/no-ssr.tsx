import { Fragment, ReactNode, useEffect, useState } from "react";

export interface NoSsrProps {
  children?: ReactNode;
  fallback?: ReactNode;
}

const NoSsr = ({ children, fallback = null }: NoSsrProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return <Fragment>{mounted ? children : fallback}</Fragment>;
};

export default NoSsr;
