type HeaderProps = {
  name: string;
  email: string;
  tiktokUrl: string;
};

export function Header({ name, email, tiktokUrl }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      <div className="mx-auto flex w-full max-w-[1222px] items-center justify-between px-3 py-3 pt-[calc(0.75rem+env(safe-area-inset-top,0px))]">
        <h1 className="font-display text-[50px] leading-none text-ink">
          <a
            href="#top"
            className="transition-opacity duration-200 hover:opacity-60"
          >
            {name}
          </a>
        </h1>
        <nav className="flex items-center gap-4 font-body text-2xl tracking-[-0.12px] text-ink">
          <a
            href={tiktokUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity duration-200 hover:opacity-60"
          >
            Tiktok
          </a>
          <a
            href={`mailto:${email}`}
            className="transition-opacity duration-200 hover:opacity-60"
          >
            Email
          </a>
        </nav>
      </div>
    </header>
  );
}
