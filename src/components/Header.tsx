type HeaderProps = {
  name: string;
  email: string;
  tiktokUrl: string;
};

export function Header({ name, email, tiktokUrl }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      <div className="mx-auto flex w-full max-w-[1222px] items-end justify-between px-3 pb-3 pt-[max(1.5rem,env(safe-area-inset-top))] md:pt-12">
        <h1 className="font-display text-[clamp(2.5rem,8vw,3.625rem)] leading-none text-ink">
          {name}
        </h1>
        <nav className="flex items-end gap-4 pb-1 font-body text-2xl tracking-[-0.12px] text-ink">
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
            className="hidden transition-opacity duration-200 hover:opacity-60 md:inline"
          >
            Email
          </a>
        </nav>
      </div>
    </header>
  );
}
