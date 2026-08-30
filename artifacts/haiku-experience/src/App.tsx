import { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  ExternalLink,
  Headphones,
  ImagePlus,
  LockKeyhole,
  Mail,
  MapPin,
  Music2,
  Pause,
  Play,
  Plus,
  Sparkles,
  Ticket,
  Volume2,
  X,
} from 'lucide-react';
import { Link, Route, Switch } from 'wouter';
import ArchivePage from './pages/ArchivePage';
import FlyerPage from './pages/FlyerPage';
import HostingPage from './pages/HostingPage';
import logoImage from '@assets/IMG_9314_1788103115409.jpeg';
import posterImage from '@assets/IMG_9313_1788103115409.jpeg';
import masqueradeImage from '@assets/IMG_9478_1788104999100.jpeg';

type Track = { id: number; title: string; artist: string; note: string; link: string };
type GalleryItem = { id: number; src: string; alt: string; caption: string; tone: string };
type ExperienceEvent = {
  id: number;
  name: string;
  date: string;
  time: string;
  venue: string;
  price: number;
  earlyBirdPrice: number;
  earlyBirdCutoff: string;
};
type OfferSettings = {
  contactDiscountEnabled: boolean;
  contactDiscount: number;
  stackDiscounts: boolean;
};

const CREATOR_CODE = 'coosix1414';
const EVENTS_STORAGE_KEY = 'haiku-experience-events';
const OFFERS_STORAGE_KEY = 'haiku-experience-offers';
const TRACKS_STORAGE_KEY = 'haiku-experience-tracks';
const GALLERY_STORAGE_KEY = 'haiku-experience-gallery';

const initialTracks: Track[] = [
  { id: 1, title: 'Clouds in the Kitchen', artist: 'Llama State Radio 01', note: 'for making tea at midnight', link: '#' },
  { id: 2, title: 'Soft Machinery', artist: 'Llama State Radio 02', note: 'a small beat for a long walk', link: '#' },
  { id: 3, title: 'The Sun Forgot', artist: 'Llama State Radio 03', note: 'play this one with the window open', link: '#' },
];

const initialGallery: GalleryItem[] = [
  { id: 1, src: posterImage, alt: 'A pastel poster for The Haicuu Experience', caption: 'the invitation / 2024', tone: 'rotate-[-2deg]' },
  { id: 2, src: masqueradeImage, alt: 'The Masquerade of Words event artwork for The Haicuu Experience', caption: 'the next mask / september 11', tone: 'rotate-[1.5deg]' },
  { id: 3, src: logoImage, alt: 'The Llama State Productions circular logo', caption: 'the keeper / est. 1998', tone: 'rotate-[-1deg]' },
];

const initialEvents: ExperienceEvent[] = [
  {
    id: 1,
    name: 'The Masquerade of Words',
    date: '2026-09-11',
    time: 'TBA',
    venue: "Teller's Lounge",
    price: 28,
    earlyBirdPrice: 22,
    earlyBirdCutoff: '2026-09-05',
  },
  {
    id: 2,
    name: 'The October Afterglow',
    date: '2026-10-17',
    time: '7:00 PM',
    venue: 'The Llama House',
    price: 32,
    earlyBirdPrice: 26,
    earlyBirdCutoff: '2026-10-01',
  },
];

function readExperienceEvents() {
  const stored = readStored<ExperienceEvent[] | null>(EVENTS_STORAGE_KEY, null);
  if (!stored?.length) return initialEvents;
  if (stored.some((event) => event.date === '2026-09-11' || event.name === 'The Masquerade of Words')) return stored;

  const legacyFeatured = stored.find((event) => event.id === initialEvents[0].id || event.date === '2026-09-19');
  const migratedFeatured = {
    ...initialEvents[0],
    ...(legacyFeatured ? {
      id: legacyFeatured.id,
      price: legacyFeatured.price,
      earlyBirdPrice: legacyFeatured.earlyBirdPrice,
      earlyBirdCutoff: legacyFeatured.earlyBirdCutoff,
    } : {}),
  };

  return [migratedFeatured, ...stored.filter((event) => event.id !== legacyFeatured?.id)];
}

const initialOfferSettings: OfferSettings = {
  contactDiscountEnabled: true,
  contactDiscount: 4,
  stackDiscounts: false,
};

function readStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

function formatEventDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${date}T12:00:00`));
}

function formatMonthYear(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${date}T12:00:00`));
}

function isValidContact(value: string) {
  const trimmed = value.trim();
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  const phone = trimmed.replace(/\D/g, '').length >= 7;
  return email || phone;
}

function HomePage() {
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [tickets, setTickets] = useState(1);
  const [reserved, setReserved] = useState(false);
  const [events, setEvents] = useState<ExperienceEvent[]>(readExperienceEvents);
  const [selectedEventId, setSelectedEventId] = useState(() => readExperienceEvents()[0]?.id ?? initialEvents[0].id);
  const [offerSettings, setOfferSettings] = useState<OfferSettings>(() => readStored(OFFERS_STORAGE_KEY, initialOfferSettings));
  const [contactValue, setContactValue] = useState('');
  const [contactError, setContactError] = useState('');
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlisted, setWaitlisted] = useState(false);
  const [playing, setPlaying] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
  const [unlockOpen, setUnlockOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [creatorTracks, setCreatorTracks] = useState<Track[]>(() => readStored(TRACKS_STORAGE_KEY, initialTracks));
  const [creatorGallery, setCreatorGallery] = useState<GalleryItem[]>(() => readStored(GALLERY_STORAGE_KEY, initialGallery));
  const [newTrack, setNewTrack] = useState({ title: '', link: '' });
  const [newImage, setNewImage] = useState('');
  const [newEvent, setNewEvent] = useState({
    name: '',
    date: '2026-11-14',
    time: '6:30 PM',
    venue: 'The Llama House',
    price: '28',
    earlyBirdPrice: '22',
    earlyBirdCutoff: '2026-11-01',
  });
  const [eventError, setEventError] = useState('');
  const [toast, setToast] = useState('');

  const selectedEvent = events.find((event) => event.id === selectedEventId) ?? events[0] ?? initialEvents[0];
  const featuredEvent = events[0] ?? initialEvents[0];
  const eventPricingValid = selectedEvent.price > 0 && selectedEvent.earlyBirdPrice >= 0 && selectedEvent.earlyBirdPrice <= selectedEvent.price;
  const earlyBirdActive = eventPricingValid && new Date(`${selectedEvent.earlyBirdCutoff}T23:59:59`) >= new Date() && selectedEvent.earlyBirdPrice < selectedEvent.price;
  const earlyBirdSavings = earlyBirdActive ? Math.max(0, selectedEvent.price - selectedEvent.earlyBirdPrice) : 0;
  const contactEligible = offerSettings.contactDiscountEnabled && isValidContact(contactValue);
  const contactSavings = contactEligible ? Math.min(selectedEvent.price, Math.max(0, offerSettings.contactDiscount)) : 0;
  const appliedSavings = offerSettings.stackDiscounts
    ? earlyBirdSavings + contactSavings
    : Math.max(earlyBirdSavings, contactSavings);
  const unitPrice = Math.max(0, selectedEvent.price - appliedSavings);
  const orderTotal = unitPrice * tickets;

  useEffect(() => {
    window.localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    window.localStorage.setItem(OFFERS_STORAGE_KEY, JSON.stringify(offerSettings));
  }, [offerSettings]);

  useEffect(() => {
    window.localStorage.setItem(TRACKS_STORAGE_KEY, JSON.stringify(creatorTracks));
  }, [creatorTracks]);

  useEffect(() => {
    window.localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(creatorGallery));
  }, [creatorGallery]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2800);
  };

  const handleUnlock = () => {
    if (code.toLowerCase().replace(/[^a-z0-9]/g, '') === CREATOR_CODE) {
      setUnlocked(true);
      setUnlockOpen(false);
      setCode('');
      setCodeError('');
      showToast('Private room opened.');
    } else {
      setCodeError('That key did not turn the lock.');
    }
  };

  const reserve = () => {
    if (contactValue.trim() && !isValidContact(contactValue)) {
      setContactError('Enter a valid email or phone number to unlock the contact offer.');
      return;
    }
    setReserved(true);
    showToast(`${tickets} ${tickets === 1 ? 'place' : 'places'} held for ${selectedEvent.name}.`);
  };

  const updateEventText = (id: number, field: 'name' | 'date' | 'time' | 'venue' | 'earlyBirdCutoff', value: string) => {
    setEvents((current) => current.map((event) => event.id === id ? { ...event, [field]: value } : event));
  };

  const updateEventNumber = (id: number, field: 'price' | 'earlyBirdPrice', value: string) => {
    const numericValue = Math.max(0, Number(value) || 0);
    setEvents((current) => current.map((event) => event.id === id ? { ...event, [field]: numericValue } : event));
  };

  const addEvent = () => {
    const price = Number(newEvent.price);
    const earlyBirdPrice = Number(newEvent.earlyBirdPrice);
    if (!newEvent.name.trim() || !newEvent.date || !Number.isFinite(price) || price <= 0 || !Number.isFinite(earlyBirdPrice) || earlyBirdPrice < 0 || earlyBirdPrice > price) {
      setEventError('Add a name, date, and valid prices. The early-bird price cannot be higher than the standard price.');
      return;
    }
    const createdEvent: ExperienceEvent = {
      id: Date.now(),
      name: newEvent.name.trim(),
      date: newEvent.date,
      time: newEvent.time.trim() || '6:30 PM',
      venue: newEvent.venue.trim() || 'The Llama House',
      price,
      earlyBirdPrice,
      earlyBirdCutoff: newEvent.earlyBirdCutoff || newEvent.date,
    };
    setEvents((current) => [...current, createdEvent]);
    setSelectedEventId(createdEvent.id);
    setNewEvent({ name: '', date: '2026-11-14', time: '6:30 PM', venue: 'The Llama House', price: '28', earlyBirdPrice: '22', earlyBirdCutoff: '2026-11-01' });
    setEventError('');
    showToast('A new evening joined the calendar.');
  };

  const removeEvent = (id: number) => {
    if (events.length <= 1) {
      setEventError('Keep at least one event available for guests.');
      return;
    }
    const remaining = events.filter((event) => event.id !== id);
    setEvents(remaining);
    if (selectedEventId === id) setSelectedEventId(remaining[0].id);
    showToast('That evening was removed from the calendar.');
  };

  const addTrack = () => {
    if (!newTrack.title.trim()) return;
    setCreatorTracks((current) => [
      ...current,
      { id: Date.now(), title: newTrack.title.trim(), artist: 'Llama State Radio / new', note: 'just added to the room', link: newTrack.link || '#' },
    ]);
    setNewTrack({ title: '', link: '' });
    showToast('Track tucked into the listening room.');
  };

  const addImage = () => {
    if (!newImage.trim()) return;
    setCreatorGallery((current) => [
      ...current,
      { id: Date.now(), src: newImage.trim(), alt: 'A newly added archive image', caption: 'freshly found / private archive', tone: 'rotate-[2deg]' },
    ]);
    setNewImage('');
    showToast('A new image joined the archive.');
  };

  return (
    <main className="site-shell grain min-h-[100dvh] bg-[#f8eddf] text-[#302039]">
      <nav className="nav-blur fixed inset-x-0 top-0 z-40 border-b border-white/10 text-[#fbf0e4]" aria-label="Main navigation">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between px-5 py-4 md:px-10">
          <a href="#top" className="group flex items-center gap-3" data-testid="link-home">
            <img src={logoImage} alt="Llama State Productions" className="h-9 w-9 rounded-full object-cover transition-transform duration-500 group-hover:rotate-[-12deg] group-hover:scale-110" />
            <span className="font-mono-custom text-[10px] uppercase tracking-[.22em] text-[#f6d8ea]">Llama State / <span className="text-[#7cdeed]">Haicuu</span></span>
          </a>
          <div className="hidden items-center gap-8 text-[11px] uppercase tracking-[.17em] md:flex">
            <a href="#experience" className="opacity-70 transition-opacity hover:opacity-100" data-testid="link-experience">The experience</a>
            <a href="#listen" className="opacity-70 transition-opacity hover:opacity-100" data-testid="link-listen">Listen</a>
             <Link href="/hosting" className="opacity-70 transition-opacity hover:opacity-100" data-testid="link-hosting">Host Cujo Sama</Link>
             <Link href="/archive" className="opacity-70 transition-opacity hover:opacity-100" data-testid="link-archive">Archive</Link>
          </div>
           <button onClick={() => setPurchaseOpen(true)} className="group pressable flex items-center gap-2 rounded-full bg-[#f465b9] px-4 py-2 text-[10px] font-bold uppercase tracking-[.16em] text-[#302039] transition-transform hover:-translate-y-0.5" data-testid="button-nav-reserve">
            Reserve <ArrowUpRight size={13} className="transition-transform group-hover:rotate-45" />
          </button>
        </div>
      </nav>

      <section id="top" className="hero-mesh relative min-h-[900px] overflow-hidden px-5 pb-20 pt-28 md:min-h-[900px] md:px-10 md:pt-36">
        <div className="absolute left-[-6%] top-36 h-44 w-44 rounded-full border border-[#9d256f]/25 md:h-72 md:w-72" />
        <div className="absolute left-[2%] top-44 h-32 w-32 rounded-full border border-[#9d256f]/20 md:h-56 md:w-56" />
        <div className="float-slow absolute right-[7%] top-28 z-10 hidden w-32 rotate-6 rounded-full bg-[#ffe36d] p-6 text-center shadow-[0_10px_0_rgba(111,50,106,.18)] md:block">
          <Sparkles size={18} className="mx-auto mb-2" />
          <p className="font-mono-custom text-[9px] uppercase leading-4 tracking-[.12em]">come as<br />you are</p>
        </div>
          <div className="relative mx-auto grid max-w-[1380px] gap-12 lg:grid-cols-[.68fr_1.32fr] lg:items-center lg:gap-10">
           <div className="relative z-10 order-2 max-w-[510px] lg:order-1">
             <div className="reveal flex items-center gap-3 font-mono-custom text-[10px] uppercase tracking-[.2em] text-[#7f1c67]">
               <span className="pulse-dot h-2 w-2 rounded-full bg-[#ee4da7]" /> Next gathering / September 11, 2026
            </div>
             <h1 className="hero-title reveal reveal-delay-1 mt-7 font-display text-[clamp(4.6rem,12vw,10.5rem)] font-semibold text-[#42194c] lg:text-[clamp(5.2rem,8.6vw,9.4rem)]">
               Haicuu<br /><span className="ml-[.18em] text-[#e94fa9]">Experience</span>
            </h1>
             <p className="reveal reveal-delay-2 mt-9 max-w-[430px] font-display text-[1.35rem] leading-[1.15] text-[#613b68] md:text-[1.55rem]">
               The Haicuu Experience returns with a night of masks, words, and beautiful surprises at Teller&apos;s Lounge.
            </p>
             <div className="reveal reveal-delay-2 mt-7 max-w-[430px] rounded-[1.2rem] border border-[#7f1c67]/15 bg-[#fff0df]/45 p-4 backdrop-blur-sm">
               <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                 <p className="font-display text-2xl text-[#42194c]">The Masquerade of Words</p>
                 <span className="font-mono-custom text-[9px] uppercase tracking-[.14em] text-[#7f1c67]">dress / suit / mask</span>
               </div>
             <p className="mt-2 font-mono-custom text-[10px] uppercase tracking-[.14em] text-[#795b7a]">September 11 · Teller&apos;s Lounge · 117 Division Ave S · time to be announced</p>
             </div>
            <div className="reveal reveal-delay-3 mt-9 flex flex-wrap items-center gap-4">
               <button onClick={() => setPurchaseOpen(true)} className="group pressable inline-flex items-center gap-3 rounded-full bg-[#42194c] px-6 py-3.5 text-xs font-bold uppercase tracking-[.12em] text-[#ffeecf] shadow-[0_6px_0_#e74eaa] transition-all hover:-translate-y-1 hover:shadow-[0_10px_0_#e74eaa]" data-testid="button-hero-reserve">
                Reserve a place <Ticket size={16} className="transition-transform group-hover:rotate-12" />
              </button>
              <a href="#experience" className="group inline-flex items-center gap-2 px-2 py-3 text-xs font-bold uppercase tracking-[.12em] text-[#42194c]" data-testid="link-discover">
                Find out more <ArrowDown size={15} className="transition-transform group-hover:translate-y-1" />
              </a>
               <Link href="/hosting" className="group inline-flex items-center gap-2 px-2 py-3 text-xs font-bold uppercase tracking-[.12em] text-[#42194c]" data-testid="link-hosting-hero">
                 Host this energy <ArrowUpRight size={15} className="transition-transform group-hover:rotate-45" />
               </Link>
            </div>
          </div>
           <div className="relative z-10 order-1 mx-auto w-full max-w-[900px] reveal reveal-delay-2 lg:order-2">
            <div className="absolute -inset-4 rounded-[2.2rem] border border-[#fff2de]/60 md:-inset-7" />
             <div className="relative overflow-hidden rounded-[1.8rem] border-[7px] border-[#fff0df] bg-[#c2e6ed] shadow-[0_20px_0_rgba(127,28,102,.18),0_35px_70px_rgba(53,30,69,.22)] transition-transform duration-700 hover:-translate-y-1">
               <img src={masqueradeImage} alt="The Masquerade of Words at Teller's Lounge for The Haicuu Experience" className="block aspect-[1.78] w-full object-cover transition-transform duration-1000 hover:scale-[1.035]" data-testid="img-hero-banner" />
                <div className="absolute bottom-3 right-3 rounded-full bg-[#fff0df]/90 px-3 py-1.5 font-mono-custom text-[9px] uppercase tracking-[.12em] text-[#42194c] backdrop-blur-sm md:bottom-4 md:right-4 md:tracking-[.18em]">September 11 / Teller&apos;s Lounge</div>
             </div>
             <Link href="/archive/flyer/9478" className="mt-5 inline-flex items-center gap-2 font-mono-custom text-[10px] uppercase tracking-[.13em] text-[#b12c78] transition-colors hover:text-[#42194c]" data-testid="link-hero-masquerade-flyer">
               Open the Masquerade flyer <ArrowUpRight size={14} />
             </Link>
            <div className="float-slow absolute -bottom-9 -left-4 z-20 w-24 rounded-[1.2rem] border-4 border-[#fff0df] bg-[#f362b6] p-2 shadow-[0_8px_0_rgba(127,28,102,.15)] md:-left-10 md:w-32">
              <img src={logoImage} alt="Llama State Productions seal" className="aspect-square w-full rounded-full object-cover" data-testid="img-hero-logo" />
            </div>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-3 font-mono-custom text-[9px] uppercase tracking-[.2em] text-[#7f1c67] md:flex">
          <span className="h-px w-10 bg-[#7f1c67]/40" /> scroll softly <span className="h-px w-10 bg-[#7f1c67]/40" />
        </div>
      </section>

      <section id="experience" className="relative overflow-hidden bg-[#f8eddf] px-5 py-24 md:px-10 md:py-36">
        <div className="mx-auto grid max-w-[1180px] gap-16 lg:grid-cols-[.72fr_1fr] lg:gap-28">
          <div>
            <p className="section-label text-[#b12c78]">01 / the invitation</p>
            <h2 className="mt-6 max-w-[450px] font-display text-5xl leading-[.96] text-[#42194c] md:text-7xl">For the ones who notice the <span className="scribble text-[#df4b9f]">small things.</span></h2>
             <p className="mt-7 max-w-[380px] text-base leading-7 text-[#684d6e]">The Haicuu Experience is an intimate evening of live sound, moving image, and people who are still curious. This September, the room becomes a masquerade of words.</p>
            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-3">
                <div className="grid h-10 w-10 place-items-center rounded-full border-2 border-[#f8eddf] bg-[#f362b6] font-display text-lg">M</div>
                <div className="grid h-10 w-10 place-items-center rounded-full border-2 border-[#f8eddf] bg-[#86dce9] font-display text-lg">A</div>
                <div className="grid h-10 w-10 place-items-center rounded-full border-2 border-[#f8eddf] bg-[#ffe06a] font-display text-lg">S</div>
              </div>
              <p className="font-mono-custom text-[10px] uppercase leading-4 tracking-[.12em] text-[#795b7a]">a small room<br />for 80 good people</p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -left-10 top-12 hidden h-24 w-24 rounded-full border-[10px] border-[#8edfea] lg:block" />
            <div className="grid gap-4 sm:grid-cols-2">
               <article className="micro-lift rounded-[1.4rem] bg-[#42194c] p-7 text-[#ffecd5] shadow-[0_8px_0_#e74eaa] sm:translate-y-8">
                <CalendarDays size={25} className="mb-12 text-[#f362b6]" />
                <p className="section-label text-[#e7a5ca]">when</p>
                <h3 className="mt-3 font-display text-4xl">{formatMonthYear(featuredEvent.date)}<br />{featuredEvent.name.replace('The ', '')}</h3>
                <p className="mt-4 font-mono-custom text-[10px] uppercase leading-5 tracking-[.11em] text-[#f6c8df]">{formatEventDate(featuredEvent.date)}<br />doors at {featuredEvent.time}</p>
              </article>
               <article className="micro-lift rounded-[1.4rem] bg-[#8edfea] p-7 text-[#42194c] shadow-[0_8px_0_#6fc3d0]">
                <MapPin size={25} className="mb-12" />
                <p className="section-label">where</p>
                 <h3 className="mt-3 font-display text-4xl">{featuredEvent.venue}</h3>
                <p className="mt-4 font-mono-custom text-[10px] uppercase leading-5 tracking-[.11em]">address shared<br />with your ticket</p>
              </article>
            </div>
            <div className="mt-5 flex items-center justify-between rounded-[1.4rem] border border-[#d9bfd2] bg-[#fdf4e8] px-6 py-5">
              <div className="flex items-center gap-3"><Clock3 size={20} className="text-[#df4b9f]" /><span className="font-display text-xl">One long evening</span></div>
              <span className="font-mono-custom text-[10px] uppercase tracking-[.12em] text-[#795b7a]">sound / supper / surprise</span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#f362b6] px-5 py-16 text-[#42194c] md:px-10 md:py-24">
        <div className="mx-auto grid max-w-[1180px] items-center gap-10 lg:grid-cols-[1fr_auto_1fr]">
           <p className="font-display text-4xl leading-none md:text-6xl">The next one is<br /><span className="text-[#fff1dc]">a masquerade.</span></p>
          <div className="spin-slow relative grid h-36 w-36 place-items-center rounded-full border-2 border-dashed border-[#42194c]/40">
            <div className="absolute inset-3 rounded-full border border-[#42194c]/20" />
            <Sparkles size={25} />
            <span className="absolute top-1 font-mono-custom text-[8px] uppercase tracking-[.2em]">make a little room</span>
            <span className="absolute bottom-1 font-mono-custom text-[8px] uppercase tracking-[.2em]">make a little room</span>
          </div>
          <div className="lg:justify-self-end">
             <p className="mb-4 max-w-[320px] text-sm leading-6">{featuredEvent.name} · September 11 at {featuredEvent.venue}. Dress up, bring a mask, and end the summer with a little amazement.</p>
             <button onClick={() => setPurchaseOpen(true)} className="group pressable inline-flex items-center gap-3 rounded-full bg-[#42194c] px-6 py-3.5 text-xs font-bold uppercase tracking-[.12em] text-[#ffecd5] transition-transform hover:-translate-y-1" data-testid="button-band-reserve">
              Enter the room <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      <section id="listen" className="bg-[#302039] px-5 py-24 text-[#ffecd5] md:px-10 md:py-36">
        <div className="mx-auto max-w-[1180px]">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="section-label text-[#86dce9]">02 / listening room</p>
              <h2 className="mt-5 max-w-[650px] font-display text-5xl leading-[.94] md:text-8xl">A few sounds<br /><span className="text-[#f362b6]">from the house.</span></h2>
            </div>
            <div className="flex items-center gap-3 pb-2 text-[#d9bfd2]"><Headphones size={18} /><span className="font-mono-custom text-[10px] uppercase tracking-[.13em]">turn it up gently</span></div>
          </div>
          <div className="mt-16 border-t border-[#eac8df]/25">
            {creatorTracks.map((track, index) => {
              const isPlaying = playing === track.id;
              return (
                 <article key={track.id} className="group micro-row grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-[#eac8df]/25 py-6 md:grid-cols-[52px_1fr_1fr_auto] md:gap-7" data-testid={`card-track-${track.id}`}>
                  <button onClick={() => setPlaying(isPlaying ? null : track.id)} className={`grid h-11 w-11 place-items-center rounded-full border transition-all ${isPlaying ? 'border-[#f362b6] bg-[#f362b6] text-[#42194c]' : 'border-[#86dce9] text-[#86dce9] hover:bg-[#86dce9] hover:text-[#42194c]'}`} data-testid={`button-play-track-${track.id}`} aria-label={isPlaying ? `Pause ${track.title}` : `Play ${track.title}`}>
                    {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                  </button>
                  <div className="min-w-0">
                    <h3 className="truncate font-display text-2xl md:text-3xl">{track.title}</h3>
                    <p className="mt-1 font-mono-custom text-[9px] uppercase tracking-[.14em] text-[#cc9fbd]">{track.artist}</p>
                  </div>
                  <p className="hidden font-display text-lg text-[#d9bfd2] md:block">{track.note}</p>
                  <div className="flex items-center gap-2">
                    {isPlaying && <div className="equalizer flex h-6 items-end gap-1 px-2" aria-label="Playing"><span className="w-1 rounded-full bg-[#f362b6]" /><span className="w-1 rounded-full bg-[#86dce9]" /><span className="w-1 rounded-full bg-[#ffe06a]" /><span className="w-1 rounded-full bg-[#f362b6]" /><span className="w-1 rounded-full bg-[#86dce9]" /></div>}
                    <a href={track.link} onClick={(event) => event.preventDefault()} className="grid h-9 w-9 place-items-center rounded-full border border-[#eac8df]/30 text-[#d9bfd2] opacity-70 transition-all hover:border-[#f362b6] hover:text-[#f362b6] hover:opacity-100" data-testid={`link-track-${track.id}`} aria-label={`Open ${track.title}`}>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="mt-10 flex items-center gap-3 text-[#cc9fbd]"><Volume2 size={16} /><span className="font-mono-custom text-[10px] uppercase tracking-[.13em]">demo state only / full songs inside the house</span></div>
        </div>
      </section>

      <section id="archive" className="overflow-hidden bg-[#f8eddf] px-5 py-24 md:px-10 md:py-36">
        <div className="mx-auto max-w-[1180px]">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="section-label text-[#b12c78]">03 / visual archive</p>
              <h2 className="mt-5 font-display text-5xl leading-[.94] text-[#42194c] md:text-8xl">Proof that<br /><span className="text-[#df4b9f]">it happened.</span></h2>
            </div>
             <div className="max-w-[280px]">
               <p className="font-display text-xl leading-tight text-[#684d6e]">Postcards from a world with the edges left on.</p>
               <Link href="/archive" className="mt-5 inline-flex items-center gap-2 font-mono-custom text-[10px] uppercase tracking-[.13em] text-[#b12c78] transition-colors hover:text-[#42194c]" data-testid="link-open-archive">Open the full archive <ArrowUpRight size={14} /></Link>
             </div>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-[1.1fr_.9fr_.82fr] md:items-start">
            {creatorGallery.map((item, index) => (
               <div key={item.id} className={`group micro-lift text-left ${index === 0 ? 'md:mt-10' : ''} ${item.tone}`}>
                 <button onClick={() => setLightbox(item)} className="block w-full text-left" data-testid={`button-gallery-${item.id}`}>
                  <div className="relative overflow-hidden rounded-[1.3rem] border-[6px] border-[#fff3e5] bg-[#fff3e5] shadow-[0_10px_0_rgba(127,28,102,.13)]">
                    <img src={item.src} alt={item.alt} className="aspect-square w-full object-cover transition duration-700 group-hover:scale-105" data-testid={`img-gallery-${item.id}`} />
                    <div className="absolute inset-0 grid place-items-center bg-[#42194c]/0 transition-colors group-hover:bg-[#42194c]/35"><span className="scale-75 rounded-full bg-[#ffe06a] px-4 py-2 font-mono-custom text-[9px] uppercase tracking-[.12em] opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100">open image</span></div>
                  </div>
                  <p className="mt-4 font-mono-custom text-[10px] uppercase tracking-[.15em] text-[#795b7a]">{item.caption}</p>
                 </button>
                 {index === 1 && <Link href="/archive/flyer/9478" className="mt-3 inline-flex items-center gap-2 font-mono-custom text-[9px] uppercase tracking-[.12em] text-[#b12c78] transition-colors hover:text-[#42194c]" data-testid="link-gallery-masquerade-flyer">View full flyer <ArrowUpRight size={13} /></Link>}
               </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#86dce9] px-5 py-20 md:px-10 md:py-28">
        <div className="absolute -right-8 top-[-40px] h-48 w-48 rounded-full border-[22px] border-[#f8eddf]/40" />
        <div className="relative mx-auto grid max-w-[1180px] items-end gap-10 md:grid-cols-[1fr_1fr]">
          <div>
            <p className="section-label text-[#42194c]">a note for later</p>
            <h2 className="mt-5 max-w-[560px] font-display text-5xl leading-[.95] text-[#42194c] md:text-7xl">Missed this one?<br /><span className="text-[#f8eddf]">Keep the window open.</span></h2>
          </div>
           <div className="micro-lift rounded-[1.5rem] bg-[#f8eddf] p-6 shadow-[0_8px_0_rgba(66,25,76,.15)] md:p-8">
            {!waitlisted ? (
              <>
                <p className="max-w-[330px] font-display text-2xl leading-tight text-[#42194c]">We only write when there is something worth leaving the house for.</p>
                <form onSubmit={(event) => { event.preventDefault(); if (waitlistEmail.trim()) setWaitlisted(true); }} className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <label className="sr-only" htmlFor="waitlist-email">Your email address</label>
                  <input id="waitlist-email" type="email" required value={waitlistEmail} onChange={(event) => setWaitlistEmail(event.target.value)} placeholder="your email, softly" className="min-w-0 flex-1 rounded-full border border-[#d9bfd2] bg-transparent px-5 py-3 text-sm text-[#42194c] outline-none placeholder:text-[#9a7b91] focus:border-[#df4b9f]" data-testid="input-waitlist-email" />
                  <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#42194c] px-5 py-3 text-[10px] font-bold uppercase tracking-[.12em] text-[#ffecd5] transition-transform hover:-translate-y-0.5" data-testid="button-join-waitlist">Join the list <Mail size={14} /></button>
                </form>
              </>
            ) : (
              <div className="flex items-center gap-4 py-4" data-testid="status-waitlist-confirmed"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#f362b6] text-[#42194c]"><Check size={22} /></div><div><p className="font-display text-2xl text-[#42194c]">You are on the list.</p><p className="mt-1 font-mono-custom text-[10px] uppercase tracking-[.1em] text-[#795b7a]">We will keep the secret safe.</p></div></div>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-[#302039] px-5 pb-8 pt-16 text-[#ffecd5] md:px-10">
        <div className="mx-auto max-w-[1180px]">
          <div className="flex flex-col justify-between gap-12 border-b border-[#eac8df]/20 pb-14 md:flex-row">
            <div>
              <img src={logoImage} alt="Llama State Productions" className="h-20 w-20 rounded-full object-cover" data-testid="img-footer-logo" />
               <p className="mt-5 max-w-[300px] font-display text-3xl leading-none text-[#f362b6]">Make room<br />for wonder.</p>
            </div>
            <div className="grid grid-cols-2 gap-x-14 gap-y-4 self-end font-mono-custom text-[10px] uppercase tracking-[.15em] text-[#cc9fbd]">
              <a href="#top" className="transition-colors hover:text-[#ffe06a]" data-testid="link-footer-top">Back to top</a>
              <a href="#listen" className="transition-colors hover:text-[#ffe06a]" data-testid="link-footer-listen">Listen again</a>
              <a href="#experience" className="transition-colors hover:text-[#ffe06a]" data-testid="link-footer-experience">The details</a>
               <Link href="/hosting" className="transition-colors hover:text-[#ffe06a]" data-testid="link-footer-hosting">Host Cujo Sama</Link>
              <button onClick={() => setUnlockOpen(true)} className="text-left transition-colors hover:text-[#ffe06a]" data-testid="button-open-creator">For the maker</button>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-3 pt-6 font-mono-custom text-[9px] uppercase tracking-[.14em] text-[#8f6a87] md:flex-row">
             <span>Llama State Productions / est. 1998</span><span>Llamamaste</span>
          </div>
        </div>
      </footer>

      {purchaseOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#302039]/70 p-3 backdrop-blur-sm md:items-center" role="dialog" aria-modal="true" aria-label="Reserve your place">
          <div className="dialog-pop relative max-h-[calc(100dvh-1.5rem)] w-full max-w-[560px] overflow-y-auto rounded-[1.8rem] bg-[#f8eddf] p-7 text-[#42194c] shadow-2xl md:p-10">
            <button onClick={() => setPurchaseOpen(false)} className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full border border-[#d9bfd2] transition-colors hover:bg-[#f362b6]" data-testid="button-close-purchase" aria-label="Close reservation panel"><X size={17} /></button>
            {!reserved ? (
              <>
                <p className="section-label text-[#b12c78]">choose your evening</p>
                <h2 className="mt-4 font-display text-5xl leading-none">Save a spot<br /><span className="text-[#e94fa9]">in the soft room.</span></h2>
                <label htmlFor="event-select" className="mt-8 block font-mono-custom text-[10px] uppercase tracking-[.12em] text-[#795b7a]">The next gathering</label>
                <select
                  id="event-select"
                  value={selectedEvent.id}
                  onChange={(event) => { setSelectedEventId(Number(event.target.value)); setReserved(false); setContactError(''); }}
                  className="mt-2 w-full rounded-full border border-[#d9bfd2] bg-[#fdf4e8] px-5 py-3 text-sm outline-none focus:border-[#df4b9f]"
                  data-testid="select-event"
                >
                  {events.map((event) => <option key={event.id} value={event.id}>{event.name} / {formatEventDate(event.date)}</option>)}
                </select>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-[1rem] bg-[#ffe06a]/45 p-4"><p className="font-mono-custom text-[9px] uppercase tracking-[.1em] text-[#795b7a]">when</p><p className="mt-2 font-display text-xl">{formatEventDate(selectedEvent.date)}</p><p className="mt-1 text-xs text-[#684d6e]">{selectedEvent.time}</p></div>
                  <div className="rounded-[1rem] bg-[#86dce9]/35 p-4"><p className="font-mono-custom text-[9px] uppercase tracking-[.1em] text-[#795b7a]">where</p><p className="mt-2 font-display text-xl">{selectedEvent.venue}</p><p className="mt-1 text-xs text-[#684d6e]">address with your ticket</p></div>
                </div>
                <div className="mt-5 flex items-center justify-between border-y border-[#d9bfd2] py-5">
                  <div><p className="font-display text-xl">General admission</p><p className="mt-1 font-mono-custom text-[10px] uppercase tracking-[.1em] text-[#795b7a]">${selectedEvent.price.toFixed(2)} / place</p></div>
                  <div className="flex items-center gap-3"><button onClick={() => setTickets((value) => Math.max(1, value - 1))} className="grid h-9 w-9 place-items-center rounded-full border border-[#b12c78]" data-testid="button-decrease-tickets">−</button><span className="w-5 text-center font-mono-custom" data-testid="text-ticket-count">{tickets}</span><button onClick={() => setTickets((value) => Math.min(6, value + 1))} className="grid h-9 w-9 place-items-center rounded-full border border-[#b12c78]" data-testid="button-increase-tickets">+</button></div>
                </div>
                <div className="mt-5">
                  <label htmlFor="contact-offer" className="font-mono-custom text-[10px] uppercase tracking-[.12em] text-[#795b7a]">Want the contact offer?</label>
                  <input id="contact-offer" value={contactValue} onChange={(event) => { setContactValue(event.target.value); setContactError(''); }} placeholder="email or mobile number" className="mt-2 w-full rounded-full border border-[#d9bfd2] bg-transparent px-5 py-3 text-sm outline-none placeholder:text-[#9a7b91] focus:border-[#df4b9f]" data-testid="input-contact-offer" />
                  {contactError && <p className="mt-2 font-mono-custom text-[10px] text-[#b12c78]" data-testid="text-contact-error">{contactError}</p>}
                  {offerSettings.contactDiscountEnabled && <p className="mt-2 text-xs text-[#795b7a]">{contactEligible ? `Contact offer applied: $${contactSavings.toFixed(2)} off per place.` : `Add a valid email or phone for $${offerSettings.contactDiscount.toFixed(2)} off per place.`}</p>}
                </div>
                <div className="mt-6 rounded-[1rem] bg-[#42194c] p-5 text-[#ffecd5]" data-testid="pricing-summary">
                  <div className="flex items-center justify-between font-mono-custom text-[10px] uppercase tracking-[.1em] text-[#d9bfd2]"><span>{tickets} {tickets === 1 ? 'place' : 'places'} x ${selectedEvent.price.toFixed(2)}</span><span>${(selectedEvent.price * tickets).toFixed(2)}</span></div>
                  <div className="mt-3 flex items-start justify-between gap-4 border-t border-[#eac8df]/20 pt-3 text-xs"><div>{earlyBirdActive && <p className="text-[#ffe06a]">Early bird · ${earlyBirdSavings.toFixed(2)} off each</p>}{!earlyBirdActive && <p className="text-[#d9bfd2]">Early bird offer has ended for this evening.</p>}{contactEligible && <p className="mt-1 text-[#86dce9]">Contact offer · ${contactSavings.toFixed(2)} off each</p>}<p className="mt-2 font-mono-custom text-[9px] uppercase tracking-[.1em] text-[#d9bfd2]">{offerSettings.stackDiscounts ? 'Eligible offers stack' : 'Best eligible offer applied'}</p></div><strong className="font-display text-3xl text-[#f362b6]">${orderTotal.toFixed(2)}</strong></div>
                </div>
                {!eventPricingValid && <p className="mt-4 rounded-[.8rem] bg-[#ffe06a]/45 px-4 py-3 font-mono-custom text-[10px] uppercase tracking-[.08em] text-[#7f1c67]" data-testid="text-pricing-error">This evening needs a valid standard and early-bird price before reservations can open.</p>}
                <button onClick={reserve} disabled={!eventPricingValid} className="mt-7 flex w-full items-center justify-center gap-3 rounded-full bg-[#42194c] px-6 py-4 text-xs font-bold uppercase tracking-[.13em] text-[#ffecd5] transition-transform hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0" data-testid="button-confirm-reservation">Hold {tickets} {tickets === 1 ? 'place' : 'places'} <ArrowUpRight size={16} /></button>
                <p className="mt-4 text-center font-mono-custom text-[9px] uppercase tracking-[.1em] text-[#795b7a]">No payment yet / this is a gentle hold</p>
              </>
            ) : (
              <div className="py-10 text-center" data-testid="status-reservation-confirmed"><div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#f362b6] text-[#42194c]"><Check size={30} /></div><p className="section-label mt-7 text-[#b12c78]">{selectedEvent.name}</p><h2 className="mt-3 font-display text-5xl">You are in.</h2><p className="mx-auto mt-4 max-w-[350px] leading-6 text-[#684d6e]">Your little group of {tickets} is held for {formatEventDate(selectedEvent.date)}. The total held is ${orderTotal.toFixed(2)}. We will send the exact address before the evening begins.</p><button onClick={() => { setPurchaseOpen(false); setReserved(false); }} className="mt-7 rounded-full border border-[#42194c] px-6 py-3 text-[10px] font-bold uppercase tracking-[.13em]" data-testid="button-close-confirmation">Keep exploring</button></div>
            )}
          </div>
        </div>
      )}

      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#302039]/85 p-5 backdrop-blur-md" role="dialog" aria-modal="true" aria-label="Expanded archive image">
          <button onClick={() => setLightbox(null)} className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-[#ffecd5]/40 text-[#ffecd5] transition-colors hover:bg-[#f362b6] hover:text-[#42194c]" data-testid="button-close-lightbox"><X size={20} /></button>
           <div className="dialog-pop max-h-[90vh] max-w-[850px] text-center"><img src={lightbox.src} alt={lightbox.alt} className="max-h-[78vh] w-auto rounded-[1rem] border-4 border-[#ffecd5] object-contain shadow-2xl" data-testid="img-lightbox" /><p className="mt-5 font-mono-custom text-[10px] uppercase tracking-[.18em] text-[#ffecd5]">{lightbox.caption}</p></div>
        </div>
      )}

      {unlockOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#302039]/80 p-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Creator unlock">
           <div className="dialog-pop max-h-[calc(100dvh-2rem)] w-full max-w-[420px] overflow-y-auto rounded-[1.6rem] bg-[#42194c] p-8 text-[#ffecd5] shadow-2xl">
            <div className="flex items-start justify-between"><div className="grid h-12 w-12 place-items-center rounded-full bg-[#f362b6] text-[#42194c]"><LockKeyhole size={21} /></div><button onClick={() => setUnlockOpen(false)} className="text-[#d9bfd2] hover:text-[#ffecd5]" data-testid="button-close-unlock" aria-label="Close creator unlock"><X size={18} /></button></div>
            <p className="section-label mt-8 text-[#86dce9]">quietly, for the maker</p>
            <h2 className="mt-3 font-display text-4xl leading-none">Is the room<br />really empty?</h2>
            <p className="mt-4 text-sm leading-6 text-[#d9bfd2]">Enter the little key that keeps the archive moving.</p>
            <form onSubmit={(event) => { event.preventDefault(); handleUnlock(); }} className="mt-7">
              <label htmlFor="creator-code" className="sr-only">Creator unlock code</label>
              <input id="creator-code" type="password" value={code} onChange={(event) => { setCode(event.target.value); setCodeError(''); }} placeholder="the key" className="w-full rounded-full border border-[#eac8df]/30 bg-[#302039] px-5 py-3 text-sm outline-none placeholder:text-[#8f6a87] focus:border-[#86dce9]" data-testid="input-creator-code" />
              {codeError && <p className="mt-2 font-mono-custom text-[10px] text-[#ffe06a]" data-testid="text-creator-code-error">{codeError}</p>}
              <button type="submit" className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#ffe06a] px-5 py-3 text-[10px] font-bold uppercase tracking-[.13em] text-[#42194c]" data-testid="button-unlock-creator">Open private room <ChevronRight size={14} /></button>
            </form>
          </div>
        </div>
      )}

      {unlocked && (
        <section className="border-t-4 border-[#f362b6] bg-[#42194c] px-5 py-20 text-[#ffecd5] md:px-10" data-testid="section-creator-controls">
          <div className="mx-auto max-w-[1180px]">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="section-label text-[#ffe06a]">private room / local state</p><h2 className="mt-4 font-display text-5xl leading-none md:text-7xl">Keep the world<br /><span className="text-[#f362b6]">growing.</span></h2></div><button onClick={() => setUnlocked(false)} className="flex items-center gap-2 self-start rounded-full border border-[#eac8df]/30 px-4 py-2 font-mono-custom text-[9px] uppercase tracking-[.12em] text-[#d9bfd2] hover:border-[#f362b6] hover:text-[#f362b6]" data-testid="button-close-creator">Close private room <X size={13} /></button></div>
             <div className="mt-12 grid gap-8 lg:grid-cols-2">
               <div className="rounded-[1.4rem] border border-[#eac8df]/20 bg-[#302039] p-7 lg:col-span-2">
                 <div className="flex items-center gap-3"><CalendarDays size={19} className="text-[#ffe06a]" /><div><h3 className="font-display text-2xl">Shape the calendar</h3><p className="mt-1 font-mono-custom text-[9px] uppercase tracking-[.12em] text-[#cc9fbd]">events guests can choose from</p></div></div>
                 <div className="mt-7 grid gap-5">
                   {events.map((event) => (
                     <div key={event.id} className="rounded-[1rem] border border-[#eac8df]/15 bg-[#42194c] p-5">
                       <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                         <input value={event.name} onChange={(inputEvent) => updateEventText(event.id, 'name', inputEvent.target.value)} className="min-w-0 flex-1 rounded-full border border-[#eac8df]/20 bg-transparent px-4 py-2 font-display text-xl outline-none focus:border-[#86dce9]" aria-label={`${event.name} event name`} />
                         <button onClick={() => removeEvent(event.id)} className="self-start rounded-full border border-[#eac8df]/20 px-3 py-2 font-mono-custom text-[9px] uppercase tracking-[.1em] text-[#d9bfd2] hover:border-[#f362b6] hover:text-[#f362b6] sm:self-auto" data-testid={`button-remove-event-${event.id}`}>Remove</button>
                       </div>
                       <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                         <label className="grid gap-2 font-mono-custom text-[9px] uppercase tracking-[.1em] text-[#cc9fbd]">Date<input type="date" value={event.date} onChange={(inputEvent) => updateEventText(event.id, 'date', inputEvent.target.value)} className="rounded-full border border-[#eac8df]/20 bg-[#302039] px-4 py-2 text-sm text-[#ffecd5] outline-none focus:border-[#86dce9]" /></label>
                         <label className="grid gap-2 font-mono-custom text-[9px] uppercase tracking-[.1em] text-[#cc9fbd]">Doors time<input value={event.time} onChange={(inputEvent) => updateEventText(event.id, 'time', inputEvent.target.value)} className="rounded-full border border-[#eac8df]/20 bg-[#302039] px-4 py-2 text-sm text-[#ffecd5] outline-none focus:border-[#86dce9]" /></label>
                         <label className="grid gap-2 font-mono-custom text-[9px] uppercase tracking-[.1em] text-[#cc9fbd]">Venue<input value={event.venue} onChange={(inputEvent) => updateEventText(event.id, 'venue', inputEvent.target.value)} className="rounded-full border border-[#eac8df]/20 bg-[#302039] px-4 py-2 text-sm text-[#ffecd5] outline-none focus:border-[#86dce9]" /></label>
                         <label className="grid gap-2 font-mono-custom text-[9px] uppercase tracking-[.1em] text-[#cc9fbd]">Standard price<input type="number" min="0" step="1" value={event.price} onChange={(inputEvent) => updateEventNumber(event.id, 'price', inputEvent.target.value)} className="rounded-full border border-[#eac8df]/20 bg-[#302039] px-4 py-2 text-sm text-[#ffecd5] outline-none focus:border-[#86dce9]" /></label>
                         <label className="grid gap-2 font-mono-custom text-[9px] uppercase tracking-[.1em] text-[#cc9fbd]">Early-bird price<input type="number" min="0" step="1" value={event.earlyBirdPrice} onChange={(inputEvent) => updateEventNumber(event.id, 'earlyBirdPrice', inputEvent.target.value)} className="rounded-full border border-[#eac8df]/20 bg-[#302039] px-4 py-2 text-sm text-[#ffecd5] outline-none focus:border-[#86dce9]" /></label>
                         <label className="grid gap-2 font-mono-custom text-[9px] uppercase tracking-[.1em] text-[#cc9fbd]">Early-bird ends<input type="date" value={event.earlyBirdCutoff} onChange={(inputEvent) => updateEventText(event.id, 'earlyBirdCutoff', inputEvent.target.value)} className="rounded-full border border-[#eac8df]/20 bg-[#302039] px-4 py-2 text-sm text-[#ffecd5] outline-none focus:border-[#86dce9]" /></label>
                       </div>
                       <p className="mt-4 font-mono-custom text-[9px] uppercase tracking-[.1em] text-[#8f6a87]">Early bird is available through {event.earlyBirdCutoff ? formatEventDate(event.earlyBirdCutoff) : 'the selected cutoff'}.</p>
                     </div>
                   ))}
                 </div>
                 <div className="mt-8 border-t border-[#eac8df]/15 pt-7">
                   <h4 className="font-display text-xl text-[#86dce9]">Add an evening</h4>
                   <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                     <input value={newEvent.name} onChange={(inputEvent) => setNewEvent({ ...newEvent, name: inputEvent.target.value })} placeholder="event name" className="rounded-full border border-[#eac8df]/20 bg-transparent px-4 py-2 text-sm outline-none placeholder:text-[#8f6a87] focus:border-[#86dce9]" data-testid="input-new-event-name" />
                     <input type="date" value={newEvent.date} onChange={(inputEvent) => setNewEvent({ ...newEvent, date: inputEvent.target.value })} className="rounded-full border border-[#eac8df]/20 bg-[#302039] px-4 py-2 text-sm text-[#ffecd5] outline-none focus:border-[#86dce9]" data-testid="input-new-event-date" />
                     <input value={newEvent.time} onChange={(inputEvent) => setNewEvent({ ...newEvent, time: inputEvent.target.value })} placeholder="doors time" className="rounded-full border border-[#eac8df]/20 bg-transparent px-4 py-2 text-sm outline-none placeholder:text-[#8f6a87] focus:border-[#86dce9]" />
                     <input value={newEvent.venue} onChange={(inputEvent) => setNewEvent({ ...newEvent, venue: inputEvent.target.value })} placeholder="venue" className="rounded-full border border-[#eac8df]/20 bg-transparent px-4 py-2 text-sm outline-none placeholder:text-[#8f6a87] focus:border-[#86dce9]" />
                     <input type="number" min="0" step="1" value={newEvent.price} onChange={(inputEvent) => setNewEvent({ ...newEvent, price: inputEvent.target.value })} placeholder="standard price" className="rounded-full border border-[#eac8df]/20 bg-transparent px-4 py-2 text-sm outline-none placeholder:text-[#8f6a87] focus:border-[#86dce9]" />
                     <input type="number" min="0" step="1" value={newEvent.earlyBirdPrice} onChange={(inputEvent) => setNewEvent({ ...newEvent, earlyBirdPrice: inputEvent.target.value })} placeholder="early-bird price" className="rounded-full border border-[#eac8df]/20 bg-transparent px-4 py-2 text-sm outline-none placeholder:text-[#8f6a87] focus:border-[#86dce9]" />
                     <input type="date" value={newEvent.earlyBirdCutoff} onChange={(inputEvent) => setNewEvent({ ...newEvent, earlyBirdCutoff: inputEvent.target.value })} className="rounded-full border border-[#eac8df]/20 bg-[#302039] px-4 py-2 text-sm text-[#ffecd5] outline-none focus:border-[#86dce9]" />
                     <button onClick={addEvent} className="flex items-center justify-center gap-2 rounded-full bg-[#86dce9] px-5 py-2 text-[10px] font-bold uppercase tracking-[.12em] text-[#42194c]" data-testid="button-add-event"><Plus size={14} /> Add event</button>
                   </div>
                   {eventError && <p className="mt-3 font-mono-custom text-[10px] text-[#ffe06a]" data-testid="text-event-error">{eventError}</p>}
                 </div>
               </div>
               <div className="rounded-[1.4rem] border border-[#eac8df]/20 bg-[#302039] p-7 lg:col-span-2">
                 <div className="flex items-center gap-3"><Ticket size={19} className="text-[#ffe06a]" /><div><h3 className="font-display text-2xl">Price the invitation</h3><p className="mt-1 font-mono-custom text-[9px] uppercase tracking-[.12em] text-[#cc9fbd]">the rules guests will see at checkout</p></div></div>
                 <div className="mt-6 grid gap-5 md:grid-cols-3">
                   <label className="grid gap-2 font-mono-custom text-[9px] uppercase tracking-[.1em] text-[#cc9fbd]">Contact offer per place<input type="number" min="0" step="1" value={offerSettings.contactDiscount} onChange={(inputEvent) => setOfferSettings({ ...offerSettings, contactDiscount: Math.max(0, Number(inputEvent.target.value) || 0) })} className="rounded-full border border-[#eac8df]/20 bg-transparent px-4 py-3 text-sm text-[#ffecd5] outline-none focus:border-[#86dce9]" data-testid="input-contact-discount" /></label>
                   <label className="flex items-center gap-3 rounded-[1rem] border border-[#eac8df]/15 bg-[#42194c] px-4 py-3 font-mono-custom text-[10px] uppercase tracking-[.1em] text-[#ffecd5]"><input type="checkbox" checked={offerSettings.contactDiscountEnabled} onChange={(inputEvent) => setOfferSettings({ ...offerSettings, contactDiscountEnabled: inputEvent.target.checked })} className="h-4 w-4 accent-[#f362b6]" data-testid="checkbox-contact-discount" /><span>Offer discount for a valid email or phone</span></label>
                   <label className="grid gap-2 font-mono-custom text-[9px] uppercase tracking-[.1em] text-[#cc9fbd]">When offers overlap<select value={offerSettings.stackDiscounts ? 'stack' : 'best'} onChange={(inputEvent) => setOfferSettings({ ...offerSettings, stackDiscounts: inputEvent.target.value === 'stack' })} className="rounded-full border border-[#eac8df]/20 bg-[#42194c] px-4 py-3 text-sm text-[#ffecd5] outline-none focus:border-[#86dce9]" data-testid="select-discount-behavior"><option value="best">Use the best eligible offer</option><option value="stack">Stack eligible offers</option></select></label>
                 </div>
                 <p className="mt-5 font-mono-custom text-[9px] uppercase tracking-[.1em] text-[#8f6a87]">{offerSettings.stackDiscounts ? 'Guests can combine early bird and contact savings.' : 'Guests receive only the larger of the early-bird or contact savings.'}</p>
               </div>
              <div className="rounded-[1.4rem] border border-[#eac8df]/20 bg-[#302039] p-7"><div className="flex items-center gap-3"><Music2 size={19} className="text-[#86dce9]" /><h3 className="font-display text-2xl">Add a listening room track</h3></div><div className="mt-6 grid gap-3"><input value={newTrack.title} onChange={(event) => setNewTrack({ ...newTrack, title: event.target.value })} placeholder="track title" className="rounded-full border border-[#eac8df]/20 bg-transparent px-5 py-3 text-sm outline-none placeholder:text-[#8f6a87] focus:border-[#86dce9]" data-testid="input-new-track-title" /><input value={newTrack.link} onChange={(event) => setNewTrack({ ...newTrack, link: event.target.value })} placeholder="link (optional)" className="rounded-full border border-[#eac8df]/20 bg-transparent px-5 py-3 text-sm outline-none placeholder:text-[#8f6a87] focus:border-[#86dce9]" data-testid="input-new-track-link" /><button onClick={addTrack} className="mt-2 flex items-center justify-center gap-2 rounded-full bg-[#86dce9] px-5 py-3 text-[10px] font-bold uppercase tracking-[.12em] text-[#42194c]" data-testid="button-add-track"><Plus size={14} /> Add track</button></div></div>
              <div className="rounded-[1.4rem] border border-[#eac8df]/20 bg-[#302039] p-7"><div className="flex items-center gap-3"><ImagePlus size={19} className="text-[#f362b6]" /><h3 className="font-display text-2xl">Add to the visual archive</h3></div><div className="mt-6 grid gap-3"><input type="url" value={newImage} onChange={(event) => setNewImage(event.target.value)} placeholder="image URL" className="rounded-full border border-[#eac8df]/20 bg-transparent px-5 py-3 text-sm outline-none placeholder:text-[#8f6a87] focus:border-[#f362b6]" data-testid="input-new-image-url" /><button onClick={addImage} className="mt-2 flex items-center justify-center gap-2 rounded-full bg-[#f362b6] px-5 py-3 text-[10px] font-bold uppercase tracking-[.12em] text-[#42194c]" data-testid="button-add-image"><Plus size={14} /> Add image</button></div></div>
            </div>
          </div>
        </section>
      )}

      {toast && <div className="toast-in fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-[#42194c] px-5 py-3 font-mono-custom text-[10px] uppercase tracking-[.1em] text-[#ffe06a] shadow-xl" role="status" data-testid="status-toast">{toast}</div>}
    </main>
  );
}

function App() {
  return (
    <Switch>
      <Route path="/hosting" component={HostingPage} />
      <Route path="/archive/flyer/:id" component={FlyerPage} />
      <Route path="/archive" component={ArchivePage} />
      <Route path="/" component={HomePage} />
      <Route component={() => (
        <main className="grid min-h-[100dvh] place-items-center bg-[#f8eddf] px-6 text-[#42194c]">
          <div className="text-center">
            <p className="section-label text-[#b12c78]">404 / wrong room</p>
            <h1 className="mt-4 font-display text-6xl">Nothing here yet.</h1>
            <Link href="/" className="mt-7 inline-flex rounded-full bg-[#42194c] px-5 py-3 font-mono-custom text-[10px] uppercase tracking-[.12em] text-[#ffecd5]" data-testid="link-not-found-home">Back to the experience</Link>
          </div>
        </main>
      )} />
    </Switch>
  );
}

export default App;