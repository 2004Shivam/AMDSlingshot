"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/", icon: "🏠", label: "Home", activeIcon: "🏠" },
  { href: "/scan", icon: "📷", label: "Scan", activeIcon: "📷" },
  { href: "/insights", icon: "✨", label: "Insights", activeIcon: "✨" },
  { href: "/history", icon: "📋", label: "History", activeIcon: "📋" },
  { href: "/log", icon: "🎙️", label: "Log", activeIcon: "🎙️" },
];

export default function NavShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    // Detect if running as installed PWA
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    setIsPWA(standalone);
  }, []);

  return (
    <div className={`nav-shell ${isPWA ? "pwa-mode" : "web-mode"}`}>
      {/* ── Sidebar (Web only) ── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="logo">evee</span>
          <span className="sidebar-tagline">AI Food Intelligence</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-nav-item ${isActive ? "active" : ""}`}
              >
                <span className="sidebar-nav-icon">{item.icon}</span>
                <span className="sidebar-nav-label">{item.label}</span>
                {isActive && <span className="sidebar-active-indicator" />}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">R</div>
            <div className="sidebar-user-info">
              <p className="text-caption" style={{ fontWeight: 600 }}>Rahul S.</p>
              <p className="text-caption text-tertiary">Pro Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="shell-content">
        {children}
      </div>

      {/* ── Bottom Nav (Mobile / PWA only) ── */}
      <nav className="bottom-nav">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive ? "active" : ""}`}
            >
              <span className="nav-item-icon">{item.icon}</span>
              <span className="nav-item-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
