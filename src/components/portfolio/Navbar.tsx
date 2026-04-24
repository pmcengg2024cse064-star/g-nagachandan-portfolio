import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const links = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-4 left-1/2 z-40 -translate-x-1/2 rounded-full px-2 py-2 transition-all ${
        scrolled ? "glass-strong" : "glass"
      }`}
    >
      <div className="flex items-center gap-1 px-3">
        <a href="#home" className="px-3 text-sm font-bold gradient-text">
          GN.
        </a>
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-4 py-1.5 text-sm text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </div>
        <a
          href="#contact"
          className="ml-2 rounded-full bg-gradient-to-r from-[oklch(0.65_0.28_300)] to-[oklch(0.7_0.28_350)] px-4 py-1.5 text-sm font-medium text-white shadow-lg shadow-[oklch(0.65_0.28_300/0.3)] transition hover:shadow-[oklch(0.65_0.28_300/0.5)]"
        >
          Hire me
        </a>
      </div>
    </motion.nav>
  );
}
