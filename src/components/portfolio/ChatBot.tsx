import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, Sparkles, X } from "lucide-react";

type Msg = { role: "user" | "bot"; text: string };

const KB: { keywords: string[]; answer: string }[] = [
  {
    keywords: ["who", "about", "yourself", "intro", "bio", "naga", "nagachandan"],
    answer:
      "I'm **G Nagachandan** — an aspiring AI & Full Stack Developer based in Hosur, Tamil Nadu. Currently pursuing B.E. CSE at Er Perumal Manimekalai College of Engineering with a CGPA of 8.82. I love building scalable web apps, REST APIs, and computer-vision systems.",
  },
  {
    keywords: ["skill", "tech", "stack", "language", "know", "expertise", "good"],
    answer:
      "My skills:\n• **Programming:** Python, Java, JavaScript, SQL\n• **Full Stack:** MongoDB, Express.js, React.js, Node.js\n• **AI:** Machine Learning, Computer Vision, Agentic AI\n• **Data:** Data Analysis, Excel, Business Analytics\n• **Tools:** Git, REST APIs, MySQL",
  },
  {
    keywords: ["project", "work", "build", "made", "portfolio"],
    answer:
      "Notable projects:\n1. **Blockchain Certification System** — tamper-proof certificate validation\n2. **Nethra AI** — industrial defect detection with real-time dashboard\n3. **E-Commerce Website (MERN)** — auth, cart, orders, REST APIs\n4. **Exam Result Analysis** — Python + Excel analytics",
  },
  {
    keywords: ["nethra", "defect", "vision", "detection", "industrial"],
    answer:
      "**Nethra AI** is an industrial defect-detection system built during the TN Impact Hackathon. It uses object detection across multiple datasets and ships with a real-time monitoring dashboard.",
  },
  {
    keywords: ["blockchain", "certificate", "certification", "tamper"],
    answer:
      "The **Blockchain Certification System** validates certificates on-chain — tamper-proof verification with an automated workflow.",
  },
  {
    keywords: ["ecommerce", "e-commerce", "mern", "shop", "cart"],
    answer:
      "The **E-Commerce platform** is a full MERN-stack app: authentication, cart, orders, REST APIs, and MongoDB.",
  },
  {
    keywords: ["hackathon", "achievement", "award", "win", "winner", "prize"],
    answer:
      "🏆 **Hackathon Winner (1st place)** — participated in 3 hackathons, and built **Nethra AI** at the TN Impact Hackathon.",
  },
  {
    keywords: ["education", "college", "study", "cgpa", "school", "degree", "class"],
    answer:
      "🎓 **B.E. CSE** at Er Perumal Manimekalai College of Engineering (2024–2028) — **CGPA 8.82**.\nClass XII: 90% · Class X: 86%.",
  },
  {
    keywords: ["contact", "email", "reach", "hire", "mail"],
    answer:
      "📬 Reach me at **gnagachandan@gmail.com** or +91 6382198836. The contact form on this page works too!",
  },
  {
    keywords: ["linkedin"],
    answer: "🔗 LinkedIn: linkedin.com/in/g-nagachandan",
  },
  {
    keywords: ["github", "code", "repo"],
    answer: "💻 GitHub: github.com/g-nagachandan",
  },
  {
    keywords: ["resume", "cv", "download"],
    answer: "You can grab my résumé from the **Download Resume** button in the hero section.",
  },
  {
    keywords: ["location", "where", "based", "city", "live", "from"],
    answer: "📍 I'm based in **Hosur, Tamil Nadu, India**.",
  },
  {
    keywords: ["interest", "passion", "drive", "love", "hobby"],
    answer:
      "I'm passionate about **AI, Computer Vision, Full Stack Development, Data Analytics, and Industrial Automation**.",
  },
  {
    keywords: ["certification", "certificate", "course"],
    answer:
      "📜 Certifications: Microsoft Business Analytics · Python for Data Science · Digital Marketing · Google Ads · MS Excel · TCS Young Professional.",
  },
  {
    keywords: ["hi", "hello", "hey", "yo", "hola", "sup"],
    answer:
      "Hey there! 👋 I'm Naga's portfolio bot. Ask me about his **projects**, **skills**, **education**, **achievements**, or **contact** info.",
  },
  {
    keywords: ["thanks", "thank", "thx", "ty"],
    answer: "You're very welcome! 💜 Anything else you'd like to know?",
  },
  {
    keywords: ["bye", "goodbye", "cya"],
    answer: "Catch you later! Don't forget to check out the projects section. ✨",
  },
];

function getReply(input: string): string {
  const q = input.toLowerCase();
  let best: { score: number; answer: string } | null = null;
  for (const entry of KB) {
    const score = entry.keywords.reduce((acc, k) => acc + (q.includes(k) ? 1 : 0), 0);
    if (score > 0 && (!best || score > best.score)) {
      best = { score, answer: entry.answer };
    }
  }
  return (
    best?.answer ??
    "Great question! Try asking about **projects**, **skills**, **education**, **achievements**, **certifications**, or how to **contact** me."
  );
}

export function ChatBot() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [panelPosition, setPanelPosition] = useState<{ top: number; left: number } | null>(null);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "bot",
      text: "Hi! I'm Naga's AI assistant ✨ Ask me anything about his work, skills, or projects.",
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, open]);

  useEffect(() => {
    if (!open) return;

    const updatePanelPosition = () => {
      const trigger = triggerRef.current;
      const panel = panelRef.current;
      if (!trigger || !panel) return;

      const triggerRect = trigger.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();
      const gap = 14;
      const padding = 16;

      let left = triggerRect.right - panelRect.width;
      if (window.innerWidth < 640) {
        left = Math.max(padding, (window.innerWidth - panelRect.width) / 2);
      }
      left = Math.min(Math.max(padding, left), window.innerWidth - panelRect.width - padding);

      const spaceAbove = triggerRect.top;
      const spaceBelow = window.innerHeight - triggerRect.bottom;
      const top =
        spaceAbove >= panelRect.height + gap || spaceAbove > spaceBelow
          ? Math.max(padding, triggerRect.top - panelRect.height - gap)
          : Math.min(window.innerHeight - panelRect.height - padding, triggerRect.bottom + gap);

      setPanelPosition({ top, left });
    };

    const frame = window.requestAnimationFrame(updatePanelPosition);
    window.addEventListener("resize", updatePanelPosition);
    window.addEventListener("scroll", updatePanelPosition, true);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", updatePanelPosition);
      window.removeEventListener("scroll", updatePanelPosition, true);
    };
  }, [open]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text }]);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "bot", text: getReply(text) }]);
    }, 450);
  };

  const suggestions = ["Projects?", "Skills?", "Contact?", "Education?"];

  if (!mounted) {
    return null;
  }

  return createPortal(
    <>
      <motion.button
        ref={triggerRef}
        type="button"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
        onClick={() => {
          setOpen((o) => !o);
          setPanelPosition(null);
        }}
        aria-label="Open chat"
        className="fixed right-4 bottom-4 z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[oklch(0.65_0.28_300)] via-[oklch(0.7_0.28_350)] to-[oklch(0.65_0.25_250)] text-white shadow-lg shadow-[oklch(0.65_0.28_300/0.5)] transition hover:scale-110 hover:shadow-[oklch(0.65_0.28_300/0.8)] sm:right-6 sm:bottom-6"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="h-6 w-6" />
            </motion.span>
          ) : (
            <motion.span
              key="msg"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <Bot className="h-7 w-7" />
            </motion.span>
          )}
        </AnimatePresence>
        {!open && (
          <span className="absolute -top-1 -right-1 h-3 w-3 animate-ping rounded-full bg-[oklch(0.8_0.18_200)]" />
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            style={{
              top: panelPosition?.top ?? -9999,
              left: panelPosition?.left ?? -9999,
              visibility: panelPosition ? "visible" : "hidden",
            }}
            className="fixed z-[100] w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-3xl glass gradient-border shadow-2xl shadow-[oklch(0.65_0.28_300/0.3)]"
          >
            <div className="flex items-center gap-3 border-b border-white/10 p-4">
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[oklch(0.65_0.28_300)] to-[oklch(0.7_0.28_350)] text-white">
                  <Sparkles className="h-5 w-5" />
                </div>
                <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full bg-[oklch(0.7_0.2_140)] ring-2 ring-background" />
              </div>
              <div>
                <p className="text-sm font-semibold">Naga's Assistant</p>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Online · usually replies instantly
                </p>
              </div>
            </div>

            <div ref={scrollRef} className="scrollbar-hidden h-80 space-y-3 overflow-y-auto p-4">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "rounded-br-sm bg-gradient-to-br from-[oklch(0.65_0.28_300)] to-[oklch(0.7_0.28_350)] text-white"
                        : "glass rounded-bl-sm text-foreground/90"
                    }`}
                    dangerouslySetInnerHTML={{
                      __html: m.text.replace(
                        /\*\*(.+?)\*\*/g,
                        '<strong class="font-semibold">$1</strong>',
                      ),
                    }}
                  />
                </motion.div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 px-4 pb-2">
              {suggestions.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => {
                    setMessages((m) => [...m, { role: "user", text: s }]);
                    setTimeout(
                      () => setMessages((m) => [...m, { role: "bot", text: getReply(s) }]),
                      400,
                    );
                  }}
                  className="rounded-full glass px-3 py-1 text-[11px] text-foreground/80 transition hover:bg-white/10 hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="flex items-center gap-2 border-t border-white/10 p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm outline-none transition focus:border-[oklch(0.65_0.28_300/0.6)] focus:shadow-[0_0_20px_oklch(0.65_0.28_300/0.2)]"
              />
              <button
                type="submit"
                aria-label="Send"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[oklch(0.65_0.28_300)] to-[oklch(0.7_0.28_350)] text-white transition hover:scale-110"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>,
    document.body,
  );
}
