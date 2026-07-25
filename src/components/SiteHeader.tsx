import Link from "next/link";

export default function SiteHeader({
  active,
}: {
  active?: "home" | "blog" | "register";
}) {
  return (
    <header className="relative z-20 border-b border-white/5">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" className="group flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/remibell-logo.png"
            alt="the RemiBello"
            width={1014}
            height={306}
            decoding="async"
            className="h-9 w-auto max-w-[160px] object-contain object-left sm:h-11 sm:max-w-[200px]"
          />
          <span className="hidden h-6 w-px bg-white/15 sm:block" aria-hidden />
          <span className="hidden text-xs uppercase tracking-[0.2em] text-mist-400 sm:inline">
            Bootcamp
          </span>
        </Link>
        <nav className="flex items-center gap-3 sm:gap-5">
          <Link
            href="/blog"
            className={`hidden text-sm transition sm:inline ${
              active === "blog"
                ? "text-ember-400"
                : "text-mist-300 hover:text-mist-50"
            }`}
          >
            Blog
          </Link>
          <Link
            href="/#skills"
            className="hidden text-sm text-mist-300 transition hover:text-mist-50 sm:inline"
          >
            Skills
          </Link>
          <Link
            href="/#register"
            className="btn-primary !px-4 !py-2.5 text-sm"
          >
            Register free
          </Link>
        </nav>
      </div>
    </header>
  );
}
