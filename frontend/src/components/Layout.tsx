import { ReactNode } from "react";
import Navigation from "./Navigation";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main
        className={`flex-1 ${isHomePage ? "" : "container mx-auto px-4 py-8"}`}
      >
        {children}
      </main>
    </div>
  );
}
