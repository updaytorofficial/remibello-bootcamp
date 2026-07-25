import Link from "next/link";
import RegistrationForm from "@/components/RegistrationForm";

const TRACKS = [
  {
    title: "Prompt Engineer",
    tag: "AI",
    blurb: "Craft prompts that get reliable results from modern AI tools.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
        <path
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-4 4v-4z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Graphic Design",
    tag: "VISUAL",
    blurb: "Build brand-ready layouts, posters, and digital creatives.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
        <path
          d="M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5zM2 2l7.586 7.586"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Photo Editing",
    tag: "MEDIA",
    blurb: "Retouch, color-grade, and finish images like a pro.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
        <path
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function HomePage() {
  return (
    <div className="surface-glow min-h-screen overflow-x-hidden">
      {/* Nav */}
      <header className="relative z-20 border-b border-white/5">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <a href="#top" className="group flex items-center gap-3">
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
          </a>
          <nav className="flex items-center gap-3 sm:gap-5">
            <Link
              href="/blog"
              className="hidden text-sm text-mist-300 transition hover:text-mist-50 sm:inline"
            >
              Blog
            </Link>
            <a
              href="#skills"
              className="hidden text-sm text-mist-300 transition hover:text-mist-50 sm:inline"
            >
              Skills
            </a>
            <a
              href="#details"
              className="hidden text-sm text-mist-300 transition hover:text-mist-50 sm:inline"
            >
              Details
            </a>
            <a href="#register" className="btn-primary !px-4 !py-2.5 text-sm">
              Register free
            </a>
          </nav>
        </div>
      </header>

      {/* Hero — one composition: brand, headline, support, CTA, dominant visual */}
      <section id="top" className="relative isolate min-h-[92vh]">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/remibello-banner.png"
            alt="the RemiBello"
            className="absolute inset-0 h-full w-full object-cover object-[42%_12%] sm:object-[52%_10%] lg:object-[58%_8%] animate-drift"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/90 to-ink-950/25 sm:to-ink-950/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/40" />
          <div className="absolute inset-0 grid-noise opacity-30" />
          <div className="absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-ember-500/20 blur-[100px] animate-glow-pulse" />
        </div>

        <div className="mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-center px-5 pb-20 pt-16 sm:px-8">
          <p
            className="animate-fade-up font-script text-3xl text-ember-400 sm:text-4xl"
            style={{ animationDelay: "0.05s" }}
          >
            Summer intensive
          </p>

          <h1
            className="animate-fade-up mt-2 max-w-3xl font-display text-[clamp(3.4rem,12vw,7.5rem)] leading-[0.9] tracking-wide text-mist-50"
            style={{ animationDelay: "0.15s" }}
          >
            STEP UP
            <span className="mt-1 block text-gradient">15 DAYS</span>
            <span className="block">BOOTCAMP</span>
          </h1>

          <p
            className="animate-fade-up mt-6 max-w-md text-lg text-mist-300 sm:text-xl"
            style={{ animationDelay: "0.28s" }}
          >
            Buy the future with skills in tech — free training live in Agege-Dopemu,
            Lagos.
          </p>

          <div
            className="animate-fade-up mt-10 flex flex-wrap items-center gap-4"
            style={{ animationDelay: "0.4s" }}
          >
            <a href="#register" className="btn-primary">
              Register now — it&apos;s free
            </a>
            <a href="#details" className="btn-ghost">
              Aug 1–15 · 10AM–2PM
            </a>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="relative border-t border-white/5 py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-ember-500">
            Learn professional
          </p>
          <h2 className="mt-3 max-w-xl font-display text-5xl tracking-wide text-mist-50 sm:text-6xl">
            Three tracks. One summer.
          </h2>
          <p className="mt-4 max-w-lg text-mist-300">
            Hands-on sessions built for beginners and curious creators ready to level up.
          </p>

          <ul className="mt-14 grid gap-10 md:grid-cols-3">
            {TRACKS.map((track, i) => (
              <li
                key={track.title}
                className="animate-fade-up group border-t border-ember-500/30 pt-6"
                style={{ animationDelay: `${0.1 + i * 0.1}s` }}
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-ember-500/40 text-ember-400 transition group-hover:bg-ember-500/10">
                  {track.icon}
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ember-500">
                  {track.tag}
                </p>
                <h3 className="mt-2 font-display text-3xl tracking-wide text-mist-50">
                  {track.title}
                </h3>
                <p className="mt-3 text-mist-300">{track.blurb}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Details */}
      <section id="details" className="relative py-24">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-ink-800/40 to-transparent" />
        <div className="mx-auto grid max-w-6xl gap-14 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-ember-500">
              Happening live
            </p>
            <h2 className="mt-3 font-display text-5xl tracking-wide text-mist-50 sm:text-6xl">
              Agege–Dopemu,
              <span className="block text-gradient">Lagos State</span>
            </h2>
            <p className="mt-4 max-w-md text-mist-300">
              Join us on ground for two weeks of focused skill-building. Limited slots —
              hurry and secure yours.
            </p>
          </div>

          <dl className="grid gap-6 sm:grid-cols-2">
            <div className="border-l border-ember-500/40 pl-5">
              <dt className="text-xs uppercase tracking-[0.2em] text-mist-400">Venue</dt>
              <dd className="mt-2 text-mist-50">
                Shitta Street
                <br />
                <span className="text-mist-300">
                  Dopemu Agege, Aluminium Village
                </span>
              </dd>
            </div>
            <div className="border-l border-ember-500/40 pl-5">
              <dt className="text-xs uppercase tracking-[0.2em] text-mist-400">Date</dt>
              <dd className="mt-2 text-mist-50">August 1 – 15, 2026</dd>
            </div>
            <div className="border-l border-ember-500/40 pl-5">
              <dt className="text-xs uppercase tracking-[0.2em] text-mist-400">Time</dt>
              <dd className="mt-2 text-mist-50">10AM – 2PM daily</dd>
            </div>
            <div className="border-l border-ember-500/40 pl-5">
              <dt className="text-xs uppercase tracking-[0.2em] text-mist-400">Fee</dt>
              <dd className="mt-2 font-display text-4xl tracking-wide text-ember-400">
                FREE
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Registration */}
      <section id="register" className="relative border-t border-white/5 py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-ember-500">
              Registration portal
            </p>
            <h2 className="mt-3 font-display text-5xl tracking-wide text-mist-50 sm:text-6xl">
              Claim your
              <span className="block text-gradient">free seat</span>
            </h2>
            <p className="mt-4 max-w-sm text-mist-300">
              Fill the form and our team gets your details instantly. We&apos;ll confirm
              your spot and share next steps via SMS or email.
            </p>

            <div className="mt-10 space-y-4 text-sm text-mist-300">
              <p className="flex items-start gap-3">
                <span className="mt-0.5 text-ember-400" aria-hidden>
                  ●
                </span>
                Limited slots — registration closes when full
              </p>
              <p className="flex items-start gap-3">
                <span className="mt-0.5 text-ember-400" aria-hidden>
                  ●
                </span>
                Enquiries:{" "}
                <a
                  href="tel:07035965544"
                  className="ml-1 text-mist-50 underline decoration-ember-500/50 underline-offset-4 hover:text-ember-400"
                >
                  0703 596 5544
                </a>
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-ink-900/80 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur sm:p-8">
            <RegistrationForm />
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-5 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/remibell-logo.png"
            alt="the RemiBello"
            width={1014}
            height={306}
            decoding="async"
            className="h-10 w-auto max-w-[220px] object-contain object-left [image-rendering:auto] sm:h-11 sm:max-w-none"
          />
          <p className="text-sm leading-relaxed text-mist-400">
            Step Up 15 Days Bootcamp Summer · Agege-Dopemu · ©{" "}
            {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
