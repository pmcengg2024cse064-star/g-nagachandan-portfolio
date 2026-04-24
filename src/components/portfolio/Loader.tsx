import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Loader() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="mx-auto h-16 w-16 rounded-full border-2 border-transparent border-t-[oklch(0.65_0.28_300)] border-r-[oklch(0.7_0.28_350)] animate-spin" />
            <p className="mt-6 font-display text-2xl font-bold gradient-text-cool animate-gradient">
              G Nagachandan
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.4em] text-muted-foreground">
              Loading portfolio
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
