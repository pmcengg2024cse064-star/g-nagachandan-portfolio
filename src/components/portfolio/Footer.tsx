export function Footer() {
  return (
    <footer className="relative px-4 py-10 text-center">
      <div className="container mx-auto max-w-6xl">
        <div className="glass rounded-2xl px-6 py-6">
          <p className="font-display text-lg font-bold gradient-text-cool">
            Turning Effort into Engineering Excellence
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            © {new Date().getFullYear()} G Nagachandan · Designed & built with passion.
          </p>
        </div>
      </div>
    </footer>
  );
}
