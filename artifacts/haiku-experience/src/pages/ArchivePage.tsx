import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Link } from 'wouter';

import archive9470 from '@assets/IMG_9470_1788105333599.jpeg';
import archive9471 from '@assets/IMG_9471_1788105333599.jpeg';
import archive9472 from '@assets/IMG_9472_1788105333599.jpeg';
import archive9473 from '@assets/IMG_9473_1788105333599.jpeg';
import archive9474 from '@assets/IMG_9474_1788105333599.jpeg';
import archive9475 from '@assets/IMG_9475_1788105333599.jpeg';
import archive9476 from '@assets/IMG_9476_1788105333600.jpeg';
import archive9477 from '@assets/IMG_9477_1788105265856.jpeg';
import archive9478 from '@assets/IMG_9478_1788104999100.jpeg';
import archive9479 from '@assets/IMG_9479_1788104999100.png';
import archive9480 from '@assets/IMG_9480_1788105265856.jpeg';
import archive9481 from '@assets/IMG_9481_1788105265856.jpeg';
import archive9482 from '@assets/IMG_9482_1788105265856.jpeg';
import archive9483 from '@assets/IMG_9483_1788105265856.jpeg';
import archive9484 from '@assets/IMG_9484_1788105265856.jpeg';
import archive9485 from '@assets/IMG_9485_1788105265856.jpeg';
import archive9486 from '@assets/IMG_9486_1788105265856.jpeg';
import archive9487 from '@assets/IMG_9487_1788105265856.jpeg';
import archive9488 from '@assets/IMG_9488_1788105265856.jpeg';
import archive9489 from '@assets/IMG_9489_1788105265856.jpeg';
import archive9490 from '@assets/IMG_9490_1788105265856.jpeg';
import archive9491 from '@assets/IMG_9491_1788105265856.jpeg';
import archive9492 from '@assets/IMG_9492_1788105265856.jpeg';
import archive9493 from '@assets/IMG_9493_1788105265856.jpeg';
import archive9494 from '@assets/IMG_9494_1788105265856.jpeg';
import archive9495 from '@assets/IMG_9495_1788105265856.jpeg';
import archive9496 from '@assets/IMG_9496_1788105157821.jpeg';
import archive9497 from '@assets/IMG_9497_1788105157821.jpeg';
import archive9498 from '@assets/IMG_9498_1788105157821.jpeg';
import archive9499 from '@assets/IMG_9499_1788105157821.jpeg';
import archive9510 from '@assets/IMG_9510_1788105157821.jpeg';
import archive9511 from '@assets/IMG_9511_1788105157821.jpeg';
import archive9512 from '@assets/IMG_9512_1788105157821.jpeg';
import archive9513 from '@assets/IMG_9513_1788105157821.jpeg';
import archive9514 from '@assets/IMG_9514_1788105157821.jpeg';
import archive9515 from '@assets/IMG_9515_1788105157821.jpeg';

type ArchiveKind = 'flyers' | 'photographs';
type ArchiveItem = {
  id: string;
  src: string;
  kind: ArchiveKind;
  alt: string;
  caption: string;
  shape: 'portrait' | 'landscape' | 'square';
};

const flyerItems: ArchiveItem[] = [
  { id: '9473', src: archive9473, kind: 'flyers', shape: 'portrait', alt: '13Moons Magazine cover featuring a portrait, cover lines, and a large title at the top', caption: 'A 13Moons Magazine cover, layered with cover lines and a portrait.' },
  { id: '9474', src: archive9474, kind: 'flyers', shape: 'square', alt: 'Colorful illustrated event flyer with a framed portrait and bold handwritten lettering', caption: 'A bright illustrated invitation with a framed portrait and hand-drawn lettering.' },
  { id: '9477', src: archive9477, kind: 'flyers', shape: 'landscape', alt: 'Promotional graphic with a red-haired performer, a group portrait, and event lettering', caption: 'A promotional graphic that places a performer beside a small group portrait.' },
  { id: '9478', src: archive9478, kind: 'flyers', shape: 'landscape', alt: 'Dark Hai Cuu promotional flyer reading The Masquerade of Words', caption: 'A dark Hai Cuu flyer for The Masquerade of Words.' },
  { id: '9479', src: archive9479, kind: 'flyers', shape: 'portrait', alt: 'Tall social media post showing a dark Hai Cuu event graphic and small white text', caption: 'A tall social post preserving a dark event graphic and its small type.' },
  { id: '9486', src: archive9486, kind: 'flyers', shape: 'portrait', alt: 'Pink and white poster with Japanese characters, a performer in a bright cap, and graphic shapes', caption: 'A pink poster pairing Japanese lettering with a portrait in a bright cap.' },
  { id: '9489', src: archive9489, kind: 'flyers', shape: 'portrait', alt: 'Colorful Hai Cuu flyer with a smiling character, a small show badge, and event information', caption: 'A colorful Hai Cuu show flyer with a smiling illustrated figure.' },
  { id: '9490', src: archive9490, kind: 'flyers', shape: 'portrait', alt: 'Hai Cuu flyer with a snowman-like figure, colorful lettering, and a poetry show notice', caption: 'A playful Hai Cuu poetry flyer with a snowman-like central figure.' },
  { id: '9492', src: archive9492, kind: 'flyers', shape: 'landscape', alt: 'Black and white RAP RAVE poster with a venue drawing and show details', caption: 'A black-and-white RAP RAVE poster with a hand-drawn venue scene.' },
  { id: '9496', src: archive9496, kind: 'flyers', shape: 'portrait', alt: 'Pink Hai Cuu poster with colorful lettering, illustrated figures, and the words special event', caption: 'A pink Hai Cuu special-event poster filled with illustrated figures.' },
  { id: '9497', src: archive9497, kind: 'flyers', shape: 'portrait', alt: 'ArtPrize poster featuring Cuju Josama, a colorful geometric border, and a circular portrait', caption: 'An ArtPrize poster featuring Cuju Josama inside a colorful border.' },
  { id: '9498', src: archive9498, kind: 'flyers', shape: 'portrait', alt: 'Pink price list poster with hand-lettered categories and dollar amounts', caption: 'A pink hand-lettered price list with categories and dollar amounts.' },
  { id: '9511', src: archive9511, kind: 'flyers', shape: 'portrait', alt: 'Pink Hai Cuu flyer with illustrated figures, bright lettering, and a special-event title', caption: 'A pink Hai Cuu flyer built from bright lettering and illustrated figures.' },
  { id: '9512', src: archive9512, kind: 'flyers', shape: 'portrait', alt: 'Black and white poster reading The Hai Cuu Experience and Museum with a portrait illustration', caption: 'A black-and-white Hai Cuu Experience museum poster.' },
  { id: '9513', src: archive9513, kind: 'flyers', shape: 'portrait', alt: 'Pink breast cancer awareness event flyer for the Hai Cuu Experience with a ribbon graphic', caption: 'A pink Hai Cuu Experience event flyer with a large ribbon graphic.' },
  { id: '9514', src: archive9514, kind: 'flyers', shape: 'portrait', alt: 'Colorful Hai Cuu live poetry poster with illustrated rabbits and a small price line', caption: 'A colorful Hai Cuu live-poetry poster with illustrated rabbits.' },
  { id: '9515', src: archive9515, kind: 'flyers', shape: 'portrait', alt: 'Yellow and pink Hai Cuu live poetry poster with illustrated rabbits and event lettering', caption: 'A yellow-and-pink Hai Cuu live-poetry poster with illustrated rabbits.' },
];

const photographItems: ArchiveItem[] = [
  { id: '9470', src: archive9470, kind: 'photographs', shape: 'portrait', alt: 'Indoor gathering with people around a white table, art on the wall, and a wood floor', caption: 'People gather around a white table in a bright room with art on the wall.' },
  { id: '9471', src: archive9471, kind: 'photographs', shape: 'landscape', alt: 'Small group of people talking together under deep red event lighting', caption: 'A small conversation held under deep red event light.' },
  { id: '9472', src: archive9472, kind: 'photographs', shape: 'landscape', alt: 'Group of people gathered outdoors at night beneath trees and colored lights', caption: 'A group gathers outdoors at night beneath trees and colored light.' },
  { id: '9475', src: archive9475, kind: 'photographs', shape: 'portrait', alt: 'Person in a pink top speaking into a microphone beside a table of printed materials', caption: 'A speaker in pink leans into a microphone beside the printed table.' },
  { id: '9476', src: archive9476, kind: 'photographs', shape: 'portrait', alt: 'Person in a pink top working at a small DJ setup beside a speaker', caption: 'A small DJ setup, a speaker, and a person in pink at the controls.' },
  { id: '9480', src: archive9480, kind: 'photographs', shape: 'portrait', alt: 'Person in a white shirt and cap standing in tall grass with a sunset behind them', caption: 'A figure in a cap pauses in tall grass with the sunset behind them.' },
  { id: '9481', src: archive9481, kind: 'photographs', shape: 'portrait', alt: 'Side view of a person in a white shirt and cap looking across a sunset landscape', caption: 'A side profile looking across a wide sunset landscape.' },
  { id: '9482', src: archive9482, kind: 'photographs', shape: 'portrait', alt: 'Person in a white shirt and cap standing in a grassy field with a city horizon', caption: 'A figure in a grassy field with a city horizon opening behind them.' },
  { id: '9483', src: archive9483, kind: 'photographs', shape: 'square', alt: 'Three people in colorful clothing posing together indoors beside a Hai Cuu sign', caption: 'Three people pose in colorful clothes beside a Hai Cuu sign.' },
  { id: '9484', src: archive9484, kind: 'photographs', shape: 'portrait', alt: 'Person in a light coat standing on a city sidewalk near a storefront and street signs', caption: 'A figure pauses on a city sidewalk beside a storefront.' },
  { id: '9485', src: archive9485, kind: 'photographs', shape: 'portrait', alt: 'Person standing outside a lit storefront at night with reflections on the pavement', caption: 'A lone figure stands outside a lit storefront after dark.' },
  { id: '9487', src: archive9487, kind: 'photographs', shape: 'portrait', alt: 'Person seated on the edge of a stage or platform inside a dim room', caption: 'A quiet pause on the edge of a stage in a dim room.' },
  { id: '9488', src: archive9488, kind: 'photographs', shape: 'portrait', alt: 'Two people riding an escalator through a transit station', caption: 'Two travelers move through a transit station on an escalator.' },
  { id: '9491', src: archive9491, kind: 'photographs', shape: 'portrait', alt: 'Person standing in a brightly lit circular transit tunnel beneath a large mural', caption: 'A figure stands inside a bright circular tunnel beneath a mural.' },
  { id: '9493', src: archive9493, kind: 'photographs', shape: 'portrait', alt: 'Person holding a framed certificate and smiling in front of greenery', caption: 'A framed certificate held up in front of a wall of greenery.' },
  { id: '9494', src: archive9494, kind: 'photographs', shape: 'portrait', alt: 'Person standing in purple light beside a large speaker or audio setup', caption: 'A figure and an audio setup share a room washed in purple light.' },
  { id: '9495', src: archive9495, kind: 'photographs', shape: 'portrait', alt: 'Person standing beside a large framed artwork in a dim gallery', caption: 'A figure stands beside a large framed artwork in a gallery.' },
  { id: '9499', src: archive9499, kind: 'photographs', shape: 'portrait', alt: 'Pink painted buckets or containers arranged outdoors beside a railing', caption: 'Pink painted buckets catch the light beside an outdoor railing.' },
  { id: '9510', src: archive9510, kind: 'photographs', shape: 'landscape', alt: 'Figure in layered clothing standing in a vivid green room or light installation', caption: 'A layered figure stands inside vivid green light.' },
];

const archiveItems = [...flyerItems, ...photographItems];

function ArchiveCard({ item, index, onOpen }: { item: ArchiveItem; index: number; onOpen: (item: ArchiveItem) => void }) {
  const isFeature = item.kind === 'flyers' && index === 0;
  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className={`archive-card archive-card--${item.kind} archive-card--${item.shape} ${isFeature ? 'archive-card--feature' : ''}`}
      data-testid={`button-archive-image-${item.id}`}
      aria-label={`Open larger view: ${item.caption}`}
    >
      <span className="archive-card__image">
        <img src={item.src} alt={item.alt} loading={index > 5 ? 'lazy' : 'eager'} data-testid={`img-archive-${item.id}`} />
        <span className="archive-card__open">open view <ArrowUpRight size={14} /></span>
      </span>
      <span className="archive-card__caption">
        <span className="archive-card__number">IMG_{item.id}</span>
        <span>{item.caption}</span>
      </span>
    </button>
  );
}

function ArchivePage() {
  const [filter, setFilter] = useState<'all' | ArchiveKind>('all');
  const [lightbox, setLightbox] = useState<ArchiveItem | null>(null);
  const visibleItems = useMemo(
    () => filter === 'all' ? archiveItems : archiveItems.filter((item) => item.kind === filter),
    [filter],
  );
  const visibleFlyers = useMemo(() => visibleItems.filter((item) => item.kind === 'flyers'), [visibleItems]);
  const visiblePhotographs = useMemo(() => visibleItems.filter((item) => item.kind === 'photographs'), [visibleItems]);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'The Archive | The Haicuu Experience';
    const description = document.querySelector('meta[name="description"]');
    const previousDescription = description?.getAttribute('content') ?? '';
    description?.setAttribute('content', 'A living scrapbook of flyers, photographs, sound, and community from The Haicuu Experience by Llama State Productions.');
    return () => {
      document.title = previousTitle;
      description?.setAttribute('content', previousDescription);
    };
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightbox(null);
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      const currentIndex = visibleItems.findIndex((item) => item.id === lightbox.id);
      const nextIndex = event.key === 'ArrowRight'
        ? (currentIndex + 1) % visibleItems.length
        : (currentIndex - 1 + visibleItems.length) % visibleItems.length;
      setLightbox(visibleItems[nextIndex]);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [lightbox, visibleItems]);

  const openLightbox = (item: ArchiveItem) => setLightbox(item);
  const moveLightbox = (direction: -1 | 1) => {
    if (!lightbox) return;
    const currentIndex = visibleItems.findIndex((item) => item.id === lightbox.id);
    setLightbox(visibleItems[(currentIndex + direction + visibleItems.length) % visibleItems.length]);
  };

  return (
    <main className="archive-page grain min-h-[100dvh] bg-[#f8eddf] text-[#302039]">
      <nav className="nav-blur archive-nav fixed inset-x-0 top-0 z-40 border-b border-white/10 text-[#fbf0e4]" aria-label="Main navigation">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between px-5 py-4 md:px-10">
          <Link href="/" className="group flex items-center gap-3" data-testid="link-archive-home">
            <span className="grid h-9 w-9 place-items-center rounded-full border border-[#f362b6] font-display text-xl text-[#f362b6] transition-transform duration-500 group-hover:rotate-[-12deg]">H</span>
            <span className="font-mono-custom text-[10px] uppercase tracking-[.22em] text-[#f6d8ea]">Llama State / <span className="text-[#7cdeed]">Haiku</span></span>
          </Link>
          <div className="hidden items-center gap-8 text-[11px] uppercase tracking-[.17em] md:flex">
            <Link href="/" className="opacity-70 transition-opacity hover:opacity-100" data-testid="link-archive-experience">The experience</Link>
            <a href="/#listen" className="opacity-70 transition-opacity hover:opacity-100" data-testid="link-archive-listen">Listen</a>
            <Link href="/archive" className="text-[#ffe06a]" data-testid="link-archive-current">Archive</Link>
          </div>
          <Link href="/#top" className="group flex items-center gap-2 rounded-full bg-[#f465b9] px-4 py-2 text-[10px] font-bold uppercase tracking-[.16em] text-[#302039]" data-testid="link-archive-reserve">
            Enter the room <ArrowUpRight size={13} className="transition-transform group-hover:rotate-45" />
          </Link>
        </div>
      </nav>

      <header className="archive-hero relative overflow-hidden px-5 pb-24 pt-36 md:px-10 md:pb-36 md:pt-48">
        <div className="archive-hero__ring archive-hero__ring--one" />
        <div className="archive-hero__ring archive-hero__ring--two" />
        <div className="relative mx-auto grid max-w-[1180px] gap-14 lg:grid-cols-[1fr_.58fr] lg:items-end">
          <div className="max-w-[760px]">
            <Link href="/" className="reveal inline-flex items-center gap-2 font-mono-custom text-[10px] uppercase tracking-[.17em] text-[#ffe06a] transition-colors hover:text-[#ffecd5]" data-testid="link-archive-back">
              <ArrowLeft size={14} /> back to the experience
            </Link>
            <p className="section-label reveal reveal-delay-1 mt-14 text-[#86dce9]">04 / the living scrapbook</p>
            <h1 className="archive-title reveal reveal-delay-2 mt-6 font-display text-6xl leading-[.84] text-[#ffecd5] sm:text-8xl md:text-[9.5rem]">
              The room<br /><span className="text-[#f362b6]">keeps receipts.</span>
            </h1>
            <p className="reveal reveal-delay-3 mt-9 max-w-[540px] font-display text-2xl leading-[1.08] text-[#f4cadf] md:text-3xl">
              Flyers, faces, and the little evidence that a night can keep glowing after everyone goes home.
            </p>
          </div>
          <aside className="archive-hero__note reveal reveal-delay-3 rotate-2" data-testid="text-archive-note">
            <p className="section-label text-[#7f1c67]">an open box</p>
            <p className="mt-5 font-display text-3xl leading-none text-[#42194c]">Collected by Cuju Josama<br /><span className="font-mono-custom text-[11px] uppercase tracking-[.12em]">spelled C-U-U-J-O</span><br />through Llama State Productions.</p>
            <div className="mt-8 flex items-center justify-between border-t border-[#7f1c67]/20 pt-4 font-mono-custom text-[9px] uppercase tracking-[.12em] text-[#7f1c67]">
              <span>{archiveItems.length} pieces</span><span>scroll / linger / return</span>
            </div>
          </aside>
        </div>
      </header>

      <section className="archive-intro px-5 py-16 md:px-10 md:py-24" aria-labelledby="archive-intro-title">
        <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[.52fr_1fr] lg:gap-24">
          <div>
            <p className="section-label text-[#b12c78]">a note from the box</p>
            <h2 id="archive-intro-title" className="mt-5 font-display text-4xl leading-none text-[#42194c] md:text-6xl">Nothing here is a backdrop.</h2>
          </div>
          <div className="max-w-[650px] text-base leading-7 text-[#684d6e]">
            <p>These are the objects and moments that make up the Haicuu Experience: the paper trail that invited people in, and the people who gave the room its pulse. Browse the two collections separately, or let the whole box spill open.</p>
            <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter archive collection">
              {([
                ['all', 'all pieces'],
                ['flyers', 'flyers & ephemera'],
                ['photographs', 'photographs'],
              ] as const).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFilter(value)}
                  className={`archive-filter ${filter === value ? 'archive-filter--active' : ''}`}
                  data-testid={`button-archive-filter-${value}`}
                  aria-pressed={filter === value}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="mt-4 font-mono-custom text-[10px] uppercase tracking-[.12em] text-[#9a7b91]" data-testid="text-archive-count">Showing {visibleItems.length} of {archiveItems.length} pieces</p>
          </div>
        </div>
      </section>

      {visibleFlyers.length > 0 && (
        <section className="archive-collection archive-collection--paper px-5 py-20 md:px-10 md:py-32" aria-labelledby="flyer-collection-title">
          <div className="mx-auto max-w-[1180px]">
            <div className="archive-section-heading">
              <div>
                <p className="section-label text-[#b12c78]">collection one / printed matter</p>
                <h2 id="flyer-collection-title" className="mt-5 font-display text-5xl leading-[.9] text-[#42194c] md:text-8xl">The paper<br /><span className="text-[#df4b9f]">trail.</span></h2>
              </div>
              <p className="max-w-[270px] font-display text-xl leading-tight text-[#684d6e]">Posters, invitations, and artifacts with their edges still showing.</p>
            </div>
            <div className="archive-paper-grid mt-16">
              {visibleFlyers.map((item, index) => <ArchiveCard key={item.id} item={item} index={index} onOpen={openLightbox} />)}
            </div>
          </div>
        </section>
      )}

      {visiblePhotographs.length > 0 && (
        <section className="archive-collection archive-collection--photos px-5 py-20 text-[#ffecd5] md:px-10 md:py-32" aria-labelledby="photo-collection-title">
          <div className="mx-auto max-w-[1180px]">
            <div className="archive-section-heading archive-section-heading--dark">
              <div>
                <p className="section-label text-[#86dce9]">collection two / in the middle of it</p>
                <h2 id="photo-collection-title" className="mt-5 font-display text-5xl leading-[.9] md:text-8xl">The people<br /><span className="text-[#f362b6]">inside.</span></h2>
              </div>
              <p className="max-w-[270px] font-display text-xl leading-tight text-[#d9bfd2]">Not a highlight reel. Just the faces, rooms, and passing light that stayed with us.</p>
            </div>
            <div className="archive-photo-wall mt-16">
              {visiblePhotographs.map((item, index) => <ArchiveCard key={item.id} item={item} index={index} onOpen={openLightbox} />)}
            </div>
          </div>
        </section>
      )}

      <footer className="archive-footer bg-[#f362b6] px-5 py-16 text-[#42194c] md:px-10 md:py-24">
        <div className="mx-auto flex max-w-[1180px] flex-col justify-between gap-10 md:flex-row md:items-end">
          <div>
            <p className="section-label">the box stays open</p>
            <h2 className="mt-5 max-w-[600px] font-display text-5xl leading-[.9] md:text-7xl">Bring your own<br /><span className="text-[#ffecd5]">small wonder.</span></h2>
          </div>
          <Link href="/#top" className="group inline-flex items-center gap-3 self-start rounded-full bg-[#42194c] px-6 py-3.5 text-xs font-bold uppercase tracking-[.12em] text-[#ffecd5] transition-transform hover:-translate-y-1 md:self-auto" data-testid="link-archive-return">
            Return to the experience <ArrowUpRight size={16} className="transition-transform group-hover:rotate-45" />
          </Link>
        </div>
      </footer>

      {lightbox && (
        <div
          className="archive-lightbox fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`Expanded view: ${lightbox.caption}`}
          onClick={() => setLightbox(null)}
          data-testid="dialog-archive-lightbox"
        >
          <button type="button" onClick={() => setLightbox(null)} className="archive-lightbox__close" data-testid="button-archive-close-lightbox" aria-label="Close expanded archive image">
            <X size={20} />
          </button>
          <button type="button" onClick={(event) => { event.stopPropagation(); moveLightbox(-1); }} className="archive-lightbox__arrow archive-lightbox__arrow--left" data-testid="button-archive-previous" aria-label="Previous archive image">
            <ChevronLeft size={22} />
          </button>
          <div className="archive-lightbox__content" onClick={(event) => event.stopPropagation()}>
            <img src={lightbox.src} alt={lightbox.alt} data-testid={`img-archive-lightbox-${lightbox.id}`} />
            <div className="archive-lightbox__meta">
              <span className="font-mono-custom text-[10px] uppercase tracking-[.16em] text-[#86dce9]">{lightbox.kind === 'flyers' ? 'flyer / ephemera' : 'photograph'} · IMG_{lightbox.id}</span>
              <p className="mt-2 font-display text-xl text-[#ffecd5]">{lightbox.caption}</p>
              <p className="mt-4 font-mono-custom text-[9px] uppercase tracking-[.13em] text-[#d9bfd2]">esc to close · arrows to browse</p>
            </div>
          </div>
          <button type="button" onClick={(event) => { event.stopPropagation(); moveLightbox(1); }} className="archive-lightbox__arrow archive-lightbox__arrow--right" data-testid="button-archive-next" aria-label="Next archive image">
            <ChevronRight size={22} />
          </button>
        </div>
      )}
    </main>
  );
}

export default ArchivePage;