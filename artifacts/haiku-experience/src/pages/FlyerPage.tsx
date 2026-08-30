import { useEffect } from 'react';
import { ArrowLeft, ArrowUpRight, CalendarDays, MapPin } from 'lucide-react';
import { Link, useParams } from 'wouter';

import { flyerItems } from './ArchivePage';

const MASQUERADE_ID = '9478';
const MASQUERADE_ADDRESS = '117 Division Ave S, Grand Rapids, MI 49503';

function FlyerPage() {
  const { id } = useParams<{ id: string }>();
  const flyer = flyerItems.find((item) => item.id === id);
  const isMasquerade = flyer?.id === MASQUERADE_ID;
  const pageTitle = flyer
    ? isMasquerade ? 'The Masquerade of Words Flyer | The Haicuu Experience' : `${flyer.caption} | The Haicuu Experience`
    : 'Flyer Not Found | The Haicuu Experience';
  const pageDescription = flyer
    ? isMasquerade
      ? 'The official flyer for The Masquerade of Words at Teller’s Lounge on September 11, 2026.'
      : `View this flyer from the Haicuu Experience archive. ${flyer.caption}`
    : 'This Haicuu Experience flyer could not be found.';

  useEffect(() => {
    const previousTitle = document.title;
    const descriptionMeta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const previousDescription = descriptionMeta?.getAttribute('content') ?? '';
    document.title = pageTitle;
    descriptionMeta?.setAttribute('content', pageDescription);
    return () => {
      document.title = previousTitle;
      descriptionMeta?.setAttribute('content', previousDescription);
    };
  }, [pageDescription, pageTitle]);

  if (!flyer) {
    return (
      <main className="grid min-h-[100dvh] place-items-center bg-[#f8eddf] px-6 text-[#42194c]">
        <div className="text-center">
          <p className="section-label text-[#b12c78]">404 / missing paper</p>
          <h1 className="mt-4 font-display text-6xl">That flyer wandered off.</h1>
          <Link href="/archive" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#42194c] px-5 py-3 font-mono-custom text-[10px] uppercase tracking-[.12em] text-[#ffecd5]" data-testid="link-flyer-not-found-archive">
            Back to the archive <ArrowUpRight size={14} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flyer-page grain min-h-[100dvh] bg-[#302039] text-[#ffecd5]">
      <nav className="nav-blur archive-nav fixed inset-x-0 top-0 z-40 border-b border-white/10" aria-label="Main navigation">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between px-5 py-4 md:px-10">
          <Link href="/archive" className="group flex items-center gap-3" data-testid="link-flyer-archive">
            <span className="grid h-9 w-9 place-items-center rounded-full border border-[#f362b6] font-display text-xl text-[#f362b6] transition-transform duration-500 group-hover:rotate-[-12deg]">H</span>
            <span className="font-mono-custom text-[10px] uppercase tracking-[.22em] text-[#f6d8ea]">Llama State / <span className="text-[#7cdeed]">Haicuu</span></span>
          </Link>
          <Link href="/archive" className="inline-flex items-center gap-2 rounded-full bg-[#f465b9] px-4 py-2 font-mono-custom text-[10px] font-bold uppercase tracking-[.16em] text-[#302039]" data-testid="link-flyer-back">
            Archive <ArrowUpRight size={13} />
          </Link>
        </div>
      </nav>

      <section className="flyer-detail-hero px-5 pb-20 pt-36 md:px-10 md:pb-32 md:pt-48">
        <div className="mx-auto grid max-w-[1180px] gap-12 lg:grid-cols-[.7fr_1.3fr] lg:items-center">
          <div>
            <Link href="/archive" className="inline-flex items-center gap-2 font-mono-custom text-[10px] uppercase tracking-[.17em] text-[#86dce9] transition-colors hover:text-[#ffe06a]" data-testid="link-flyer-back-to-archive">
              <ArrowLeft size={14} /> back to the archive
            </Link>
            <p className="section-label mt-14 text-[#f362b6]">flyer / ephemera · IMG_{flyer.id}</p>
            <h1 className="mt-6 max-w-[560px] font-display text-6xl leading-[.86] text-[#ffecd5] md:text-8xl">
              {isMasquerade ? <>The Masquerade<br /><span className="text-[#f362b6]">of Words.</span></> : <>A piece of<br /><span className="text-[#86dce9]">the paper trail.</span></>}
            </h1>
            <p className="mt-8 max-w-[430px] font-display text-2xl leading-tight text-[#d9bfd2]">{flyer.caption}</p>

            {isMasquerade ? (
              <div className="mt-10 rounded-[1.4rem] border border-[#f362b6]/35 bg-[#42194c] p-6 shadow-[0_10px_0_rgba(243,98,182,.18)]" data-testid="card-masquerade-flyer-details">
                <p className="section-label text-[#ffe06a]">next gathering / September 11, 2026</p>
                <div className="mt-5 grid gap-4 font-mono-custom text-[10px] uppercase tracking-[.12em] text-[#f4cadf]">
                  <p className="flex items-start gap-3"><CalendarDays size={16} className="mt-[-2px] shrink-0 text-[#86dce9]" /> The Masquerade of Words · dress / suit / mask</p>
                  <p className="flex items-start gap-3"><MapPin size={16} className="mt-[-2px] shrink-0 text-[#86dce9]" /> Teller’s Lounge<br /><span className="pl-7 text-[#ffe06a]">{MASQUERADE_ADDRESS}</span></p>
                </div>
              </div>
            ) : (
              <p className="mt-10 max-w-[390px] font-mono-custom text-[10px] uppercase tracking-[.12em] text-[#86dce9]">A preserved invitation from the living scrapbook.</p>
            )}
          </div>

          <figure className={`flyer-detail-art flyer-detail-art--${flyer.shape}`}>
            <img src={flyer.src} alt={flyer.alt} data-testid={`img-flyer-detail-${flyer.id}`} />
            {isMasquerade && <figcaption className="mt-5 font-mono-custom text-[9px] uppercase tracking-[.14em] text-[#d9bfd2]">The Masquerade of Words · September 11, 2026 · Teller’s Lounge</figcaption>}
          </figure>
        </div>
      </section>

      <footer className="bg-[#f362b6] px-5 py-14 text-[#42194c] md:px-10 md:py-20">
        <div className="mx-auto flex max-w-[1180px] flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="section-label">keep looking</p>
            <h2 className="mt-4 font-display text-5xl leading-[.9] md:text-7xl">More pieces<br /><span className="text-[#ffecd5]">from the room.</span></h2>
          </div>
          <Link href="/archive" className="group inline-flex items-center gap-3 self-start rounded-full bg-[#42194c] px-6 py-3.5 text-xs font-bold uppercase tracking-[.12em] text-[#ffecd5] transition-transform hover:-translate-y-1 md:self-auto" data-testid="link-flyer-more">
            Browse every flyer <ArrowUpRight size={16} className="transition-transform group-hover:rotate-45" />
          </Link>
        </div>
      </footer>
    </main>
  );
}

export default FlyerPage;