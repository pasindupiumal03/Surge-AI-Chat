"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

const NAV: NavItem[] = [
  { label: "Home", href: "https://surge-ai-eight.vercel.app/" },
  { label: "Analytics", href: "https://surge-ai-eight.vercel.app/#analytics" },
  { label: "Features", href: "https://surge-ai-eight.vercel.app/#features" },
  { label: "Trading Room", href: "https://surge-ai-eight.vercel.app/#trading-room" },
  { label: "Surge Chat", href: "#surgechat" },
  {
    label: "More",
    href: "#",
    children: [
      { label: "Changelog", href: "https://surge-ai-eight.vercel.app/#changelog" },
      { label: "Pricing", href: "https://surge-ai-eight.vercel.app/#price" },
      { label: "How It Works", href: "https://surge-ai-eight.vercel.app/#howitwork" },
    ],
  },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed left-0 right-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl" style={{ top: "var(--contract-banner-h)" }} aria-label="Main Navigation">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="https://surge-ai-eight.vercel.app/" className="relative inline-flex items-center gap-2">
            <div className="relative inline-flex items-center justify-center">
              <span className="surge-logo-text text-[22px] font-extrabold tracking-widest text-[#00ffff] [text-shadow:0_0_20px_rgba(0,255,255,0.75)] relative z-10">
                SURGE
              </span>
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center -z-10" style={{ transform: "translate(4px, 2px)" }}>
                <span className="h-[60px] w-[60px] rounded-full border border-[#00ffff]/70 opacity-30 animate-logo-pulse" />
              </span>
            </div>
          </Link>
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) =>
              item.children ? (
                <div key={item.label} className="relative has-submenu group" onMouseLeave={() => setMoreOpen(false)} onMouseEnter={() => setMoreOpen(true)}>
                  <button className="nav-link" onClick={() => setMoreOpen((v) => !v)} aria-haspopup="true" aria-expanded={moreOpen}>
                    {item.label}
                  </button>
                  <div className="submenu pointer-events-auto absolute left-0 top-full hidden min-w-[180px] rounded-md border border-white/10 bg-[#121628] shadow-xl group-hover:block" role="menu">
                    {item.children.map((c) => (
                      <Link key={c.label} href={c.href} className="block px-4 py-2 text-[14px] text-white/90 hover:bg-[rgba(0,255,136,0.1)]" role="menuitem">
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link key={item.label} href={item.href} className={`nav-link ${item.label === "Surge Chat" ? "active text-[#00ffff] bg-[#00ffff]/10" : ""}`}>
                  {item.label}
                </Link>
              )
            )}
          </nav>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur md:flex">
              <span className="text-[12px] text-white/60">SURGE:</span>
              <span className="relative flex w-[120px] items-center justify-center">
                <span className="rounded-lg bg-gradient-to-r from-[#00ffff]/20 to-[#00ffff]/10 border border-[#00ffff]/30 px-3 py-1.5 text-center text-[11px] font-medium text-[#00ffff] backdrop-blur-sm">
                    Try It Now
                </span>
              </span>
            </div>
            <button className="inline-flex items-center justify-center rounded-md border border-white/10 bg-white/5 p-2 text-white lg:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle Menu" aria-expanded={open}>
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
      <div className={`lg:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity ${open ? "opacity-100" : "opacity-0"}`} onClick={() => setOpen(false)} />
        <div className={`fixed right-0 top-[45px] z-50 h-[calc(100dvh-45px)] w-80 transform border-l border-white/10 bg-[#0D141E] p-5 shadow-2xl transition-transform ${open ? "translate-x-0" : "translate-x-full"}`} role="dialog" aria-modal="true">
          <div className="space-y-2">
            {NAV.map((item) =>
              item.children ? (
                <div key={item.label} className="border-b border-white/10 pb-2">
                  <button className="nav-link w-full text-left" onClick={() => setMoreOpen((v) => !v)} aria-expanded={moreOpen}>
                    {item.label}
                  </button>
                  <div className={`mt-1 grid gap-1 ${moreOpen ? "block" : "hidden"}`}>
                    {item.children.map((c) => (
                      <Link key={c.label} href={c.href} className="block rounded-md px-3 py-2 text-[14px] text-white/90 hover:bg-white/10" onClick={() => setOpen(false)}>
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link key={item.label} href={item.href} className={`block rounded-lg px-3 py-2 text-white/85 hover:bg-white/10 ${item.label === "Surge Chat" ? "bg-[#00ffff]/10 text-[#00ffff]" : ""}`} onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              )
            )}
          </div>
          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-white/60">SURGE</span>
            </div>
            <div className="mt-2 rounded-lg bg-gradient-to-r from-[#00ffff]/20 to-[#00ffff]/10 border border-[#00ffff]/30 px-3 py-1.5 text-center text-[11px] font-medium text-[#00ffff] backdrop-blur-sm">
              Try It Now
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
