import { useEffect, useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowUpRight, Check, LoaderCircle, Mail, Sparkles } from 'lucide-react';
import { Link } from 'wouter';
import { useSubmitHostingInquiry } from '@workspace/api-client-react';

import hostPortrait from '@assets/IMG_9506_1788105157821.jpeg';
import logoImage from '@assets/IMG_9314_1788103115409.jpeg';
import masqueradeImage from '@assets/IMG_9478_1788104999100.jpeg';

const metaValues = [
  ['meta[name="description"]', 'Bring Cujo Sama and the Haicuu Experience into your room, gathering, or beautifully unusual event.'],
  ['meta[property="og:title"]', 'Host Cujo Sama | The Haicuu Experience'],
  ['meta[property="og:description"]', 'Bring Cujo Sama and the Haicuu Experience into your room, gathering, or beautifully unusual event.'],
  ['meta[name="twitter:title"]', 'Host Cujo Sama | The Haicuu Experience'],
  ['meta[name="twitter:description"]', 'Bring Cujo Sama and the Haicuu Experience into your room, gathering, or beautifully unusual event.'],
] as const;

function HostingPage() {
  const [inquirySent, setInquirySent] = useState(false);
  const [inquiryError, setInquiryError] = useState('');
  const [inquiry, setInquiry] = useState({ name: '', email: '', room: '' });
  const submitInquiry = useSubmitHostingInquiry({
    mutation: {
      onSuccess: () => {
        setInquiryError('');
        setInquirySent(true);
      },
      onError: () => {
        setInquiryError('The note could not reach the room. Please try again in a moment.');
      },
    },
  });

  const handleInquirySubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setInquiryError('');
    submitInquiry.mutate({
      data: {
        name: inquiry.name.trim(),
        email: inquiry.email.trim(),
        room: inquiry.room.trim(),
      },
    });
  };

  useEffect(() => {
    const previousTitle = document.title;
    const previousMetaValues = metaValues.map(([selector, value]) => {
      const element = document.querySelector<HTMLMetaElement>(selector);
      const previousContent = element?.getAttribute('content') ?? '';
      element?.setAttribute('content', value);
      return [element, previousContent] as const;
    });
    document.title = 'Host Cujo Sama | The Haicuu Experience';
    return () => {
      document.title = previousTitle;
      previousMetaValues.forEach(([element, content]) => element?.setAttribute('content', content));
    };
  }, []);

  return (
    <main className="hosting-page grain min-h-[100dvh] bg-[#f8eddf] text-[#302039]">
      <nav className="nav-blur fixed inset-x-0 top-0 z-40 border-b border-white/10 text-[#fbf0e4]" aria-label="Main navigation">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between px-5 py-4 md:px-10">
          <Link href="/" className="group flex items-center gap-3" data-testid="link-hosting-home">
            <img src={logoImage} alt="Llamaste Productions" className="h-9 w-9 rounded-full object-cover transition-transform duration-500 group-hover:rotate-[-12deg] group-hover:scale-110" />
            <span className="font-mono-custom text-[10px] uppercase tracking-[.22em] text-[#f6d8ea]">Llamaste / <span className="text-[#7cdeed]">Haicuu</span></span>
          </Link>
          <div className="hidden items-center gap-7 text-[11px] uppercase tracking-[.17em] md:flex">
            <Link href="/" className="opacity-70 transition-opacity hover:opacity-100" data-testid="link-hosting-experience">The experience</Link>
            <Link href="/#listen" className="opacity-70 transition-opacity hover:opacity-100" data-testid="link-hosting-listen">Listen</Link>
            <Link href="/archive" className="opacity-70 transition-opacity hover:opacity-100" data-testid="link-hosting-archive">Archive</Link>
            <Link href="/hosting" className="text-[#ffe06a]" data-testid="link-hosting-current">Host Cujo Sama</Link>
          </div>
          <Link href="/#top" className="group inline-flex items-center gap-2 rounded-full bg-[#f465b9] px-4 py-2 text-[10px] font-bold uppercase tracking-[.16em] text-[#302039]" data-testid="link-hosting-reserve">
            Visit the room <ArrowUpRight size={13} className="transition-transform group-hover:rotate-45" />
          </Link>
        </div>
      </nav>

      <header className="hosting-hero relative overflow-hidden px-5 pb-24 pt-32 md:px-10 md:pb-36 md:pt-44">
        <div className="hosting-hero__ring hosting-hero__ring--one" />
        <div className="hosting-hero__ring hosting-hero__ring--two" />
        <div className="relative mx-auto grid max-w-[1180px] items-center gap-14 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
          <div className="relative z-10">
            <Link href="/" className="reveal inline-flex items-center gap-2 font-mono-custom text-[10px] uppercase tracking-[.17em] text-[#7f1c67] transition-colors hover:text-[#42194c]" data-testid="link-hosting-back">
              <ArrowLeft size={14} /> back to the experience
            </Link>
            <p className="section-label reveal reveal-delay-1 mt-14 text-[#7f1c67]">a room can be a portal</p>
            <h1 className="hosting-title reveal reveal-delay-2 mt-6 max-w-[720px] font-display text-6xl leading-[.83] text-[#42194c] sm:text-8xl md:text-[8.5rem]">
              Bring the<br /><span className="text-[#e94fa9]">Haicuu</span><br />home.
            </h1>
            <p className="reveal reveal-delay-3 mt-9 max-w-[500px] font-display text-2xl leading-[1.08] text-[#613b68] md:text-3xl">
              Cujo Sama can bring the spark, the pause, and the beautifully unexpected to a room that is ready for more than a schedule.
            </p>
            <a href="#hosting-packages" className="reveal reveal-delay-3 mt-9 inline-flex items-center gap-3 rounded-full bg-[#42194c] px-6 py-3.5 text-xs font-bold uppercase tracking-[.12em] text-[#ffecd5] shadow-[0_6px_0_#e74eaa] transition-transform hover:-translate-y-1" data-testid="link-hosting-packages">
              See the invitations <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="hosting-hero__portrait relative mx-auto w-full max-w-[560px] reveal reveal-delay-2">
            <div className="absolute -inset-5 rounded-[2.6rem] border border-[#fff2de]/70 md:-inset-8" />
            <div className="relative overflow-hidden rounded-[2rem] border-[7px] border-[#fff0df] bg-[#42194c] shadow-[0_18px_0_rgba(127,28,102,.17),0_34px_60px_rgba(53,30,69,.2)]">
              <img src={hostPortrait} alt="Cujo Sama speaking into a microphone outdoors" className="block aspect-[4/5] w-full object-cover" data-testid="img-hosting-portrait" />
              <div className="absolute inset-x-5 bottom-5 rounded-[1.2rem] bg-[#fff0df]/90 p-4 backdrop-blur-sm md:inset-x-7 md:bottom-7">
                <p className="font-mono-custom text-[9px] uppercase tracking-[.15em] text-[#7f1c67]">the host / the guide / the mischief</p>
                <p className="mt-2 font-display text-3xl leading-none text-[#42194c]">Cujo Sama</p>
              </div>
            </div>
            <div className="float-slow absolute -right-2 -top-7 z-10 grid h-28 w-28 place-items-center rounded-full border-4 border-[#fff0df] bg-[#ffe06a] p-4 text-center shadow-[0_8px_0_rgba(127,28,102,.15)] md:-right-8 md:h-36 md:w-36">
              <Sparkles size={20} className="mb-1" />
              <span className="font-mono-custom text-[9px] uppercase leading-4 tracking-[.1em]">make room<br />for wonder</span>
            </div>
          </div>
        </div>
      </header>

      <section className="hosting-intro px-5 py-24 md:px-10 md:py-36" aria-labelledby="hosting-intro-title">
        <div className="mx-auto grid max-w-[1180px] gap-14 lg:grid-cols-[.7fr_1fr] lg:gap-28">
          <div>
            <p className="section-label text-[#b12c78]">01 / meet the energy</p>
            <h2 id="hosting-intro-title" className="mt-6 max-w-[520px] font-display text-5xl leading-[.92] text-[#42194c] md:text-7xl">
              Not a keynote.<br /><span className="text-[#df4b9f]">A shift in weather.</span>
            </h2>
          </div>
          <div className="max-w-[620px] text-base leading-7 text-[#684d6e]">
            <p>Cujo Sama, also known as the Dalai Lama, knows how to turn a gathering into a shared little universe. He hosts with a microphone in one hand and a sense of possibility in the other—making space for music, words, laughter, and the kind of surprise people repeat on the way home.</p>
            <p className="mt-6">Bring the Haicuu Experience to your dinner, gallery, backyard, studio, office, or afterparty. The room does not need to be fancy. It just needs to be willing.</p>
            <div className="mt-9 flex flex-wrap gap-2" aria-label="Gatherings that can host the experience">
              {['dinner tables', 'gallery openings', 'backyards', 'studio nights', 'office parties', 'after-hours'].map((room) => (
                <span key={room} className="rounded-full border border-[#d9bfd2] bg-[#fdf4e8] px-4 py-2 font-mono-custom text-[10px] uppercase tracking-[.1em] text-[#7f1c67]">{room}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="hosting-packages" className="hosting-packages relative overflow-hidden bg-[#302039] px-5 py-24 text-[#ffecd5] md:px-10 md:py-36" aria-labelledby="hosting-packages-title">
        <div className="absolute -right-20 top-20 h-72 w-72 rounded-full border border-[#f362b6]/30" />
        <div className="absolute -left-28 bottom-20 h-80 w-80 rounded-full border border-[#86dce9]/25" />
        <div className="relative mx-auto max-w-[1180px]">
          <div className="max-w-[720px]">
            <p className="section-label text-[#86dce9]">02 / choose your portal</p>
            <h2 id="hosting-packages-title" className="mt-5 font-display text-5xl leading-[.9] md:text-8xl">Two ways to<br /><span className="text-[#f362b6]">open the room.</span></h2>
            <p className="mt-7 max-w-[590px] text-base leading-7 text-[#d9bfd2]">One invitation builds the whole world. The other lets Cujo Sama walk into the world you already made and turn the lights a little warmer.</p>
          </div>
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <article className="hosting-package hosting-package--full rounded-[1.6rem] bg-[#f362b6] p-7 text-[#42194c] shadow-[0_10px_0_#86dce9] md:p-9" data-testid="card-hosting-full-experience">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="section-label">the whole constellation</p>
                  <h3 className="mt-5 max-w-[390px] font-display text-4xl leading-[.9] md:text-5xl">The full Haicuu Experience</h3>
                </div>
                <Sparkles className="shrink-0" size={25} />
              </div>
              <p className="mt-8 max-w-[470px] text-base leading-7">A bespoke night hosted by Cujo Sama, with live sound, moving image, words, and enough room for your guests to become part of the story.</p>
              <div className="mt-8 flex items-end justify-between gap-5 border-t border-[#42194c]/20 pt-6">
                <div><p className="font-mono-custom text-[9px] uppercase tracking-[.13em]">starting invitation</p><p className="mt-2 font-display text-5xl">$10,000</p></div>
                <span className="max-w-[130px] text-right font-mono-custom text-[9px] uppercase leading-4 tracking-[.1em]">Cujo Sama + full experience</span>
              </div>
            </article>
            <article className="hosting-package rounded-[1.6rem] border border-[#eac8df]/25 bg-[#42194c] p-7 md:p-9" data-testid="card-hosting-host-only">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="section-label text-[#86dce9]">the guest appearance</p>
                  <h3 className="mt-5 max-w-[390px] font-display text-4xl leading-[.9] md:text-5xl">Simply host your event</h3>
                </div>
                <Mail className="shrink-0 text-[#86dce9]" size={25} />
              </div>
              <p className="mt-8 max-w-[470px] text-base leading-7 text-[#d9bfd2]">You bring the room, the people, and the reason to gather. Cujo Sama brings the welcome, the rhythm, and the unmistakable energy that makes an event feel alive. This is the host-only appearance—not the full Haicuu production.</p>
              <div className="hosting-quote-notes mt-8 border-y border-[#eac8df]/20 py-5" aria-label="Host-only quote scope">
                <p className="font-mono-custom text-[9px] uppercase tracking-[.13em] text-[#86dce9]">what the range means</p>
                <ul className="mt-3 grid gap-2 text-sm leading-6 text-[#f4ddeb]">
                  <li className="hosting-quote-note"><Check size={14} className="mt-1 shrink-0 text-[#86dce9]" />Cujo Sama’s live hosting appearance for your gathering.</li>
                  <li className="hosting-quote-note"><Check size={14} className="mt-1 shrink-0 text-[#86dce9]" />Production, travel, and event details are confirmed with you before the final quote.</li>
                </ul>
              </div>
              <div className="mt-8 flex items-end justify-between gap-5 border-t border-[#eac8df]/20 pt-6">
                <div><p className="font-mono-custom text-[9px] uppercase tracking-[.13em] text-[#86dce9]">indicative host-only range</p><p className="mt-2 font-display text-5xl text-[#f362b6]">$4,000–$5,000</p></div>
                <span className="max-w-[150px] text-right font-mono-custom text-[9px] uppercase leading-4 tracking-[.1em] text-[#d9bfd2]">final quote confirmed in conversation</span>
              </div>
            </article>
          </div>
          <p className="mt-8 font-mono-custom text-[10px] uppercase tracking-[.12em] text-[#9f7c98]">No checkout here / every good room starts with a conversation.</p>
        </div>
      </section>

      <section className="hosting-scene relative overflow-hidden bg-[#86dce9] px-5 py-20 md:px-10 md:py-28">
        <div className="relative mx-auto grid max-w-[1180px] items-center gap-10 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <p className="section-label text-[#42194c]">03 / imagine the entrance</p>
            <h2 className="mt-5 max-w-[540px] font-display text-5xl leading-[.92] text-[#42194c] md:text-7xl">The door opens.<br /><span className="text-[#f8eddf]">The ordinary leaves.</span></h2>
            <p className="mt-7 max-w-[440px] text-base leading-7 text-[#42194c]">Maybe it is a toast that becomes a poem. Maybe a dance floor that gets a little braver. Maybe the host simply arrives and reminds everyone they are allowed to be delighted.</p>
            <a href="#hosting-inquire" className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#42194c] px-6 py-3.5 text-xs font-bold uppercase tracking-[.12em] text-[#ffecd5] transition-transform hover:-translate-y-1" data-testid="link-hosting-inquire-scene">
              Tell us about your room <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="relative rotate-2 rounded-[1.5rem] border-[7px] border-[#fff0df] bg-[#fff0df] p-2 shadow-[0_12px_0_rgba(66,25,76,.15)]">
            <img src={masqueradeImage} alt="The Masquerade of Words artwork for The Haicuu Experience" className="block aspect-[1.78] w-full rounded-[1rem] object-cover" data-testid="img-hosting-masquerade" />
            <span className="absolute -bottom-5 -left-4 rounded-full bg-[#ffe06a] px-4 py-3 font-mono-custom text-[9px] uppercase tracking-[.1em] text-[#42194c] shadow-[0_6px_0_rgba(66,25,76,.15)]">same wonder / new room</span>
          </div>
        </div>
      </section>

      <section id="hosting-inquire" className="hosting-inquire bg-[#f8eddf] px-5 py-24 md:px-10 md:py-36" aria-labelledby="hosting-inquire-title">
        <div className="mx-auto grid max-w-[1180px] gap-12 lg:grid-cols-[.85fr_1fr] lg:gap-24">
          <div>
            <p className="section-label text-[#b12c78]">04 / open the conversation</p>
            <h2 id="hosting-inquire-title" className="mt-5 max-w-[520px] font-display text-5xl leading-[.9] text-[#42194c] md:text-8xl">Tell us what<br /><span className="text-[#df4b9f]">you are making.</span></h2>
            <p className="mt-7 max-w-[420px] text-base leading-7 text-[#684d6e]">A little context helps the right kind of magic find you. Share your name, your room, and the shape of the gathering you have in mind.</p>
          </div>
          <div className="micro-lift rounded-[1.6rem] bg-[#42194c] p-7 text-[#ffecd5] shadow-[0_10px_0_#f362b6] md:p-9">
            {!inquirySent ? (
              <form onSubmit={handleInquirySubmit} className="grid gap-5" data-testid="form-hosting-inquiry">
                <label className="grid gap-2 font-mono-custom text-[10px] uppercase tracking-[.12em] text-[#d9bfd2]">
                  Your name
                  <input required minLength={1} maxLength={120} value={inquiry.name} onChange={(event) => setInquiry({ ...inquiry, name: event.target.value })} placeholder="the person opening the door" className="rounded-full border border-[#eac8df]/25 bg-[#302039] px-5 py-3 text-sm text-[#ffecd5] outline-none placeholder:text-[#8f6a87] focus:border-[#86dce9]" data-testid="input-hosting-name" />
                </label>
                <label className="grid gap-2 font-mono-custom text-[10px] uppercase tracking-[.12em] text-[#d9bfd2]">
                  Email for the next step
                  <input required type="email" maxLength={320} value={inquiry.email} onChange={(event) => setInquiry({ ...inquiry, email: event.target.value })} placeholder="you@yourroom.com" className="rounded-full border border-[#eac8df]/25 bg-[#302039] px-5 py-3 text-sm text-[#ffecd5] outline-none placeholder:text-[#8f6a87] focus:border-[#86dce9]" data-testid="input-hosting-email" />
                </label>
                <label className="grid gap-2 font-mono-custom text-[10px] uppercase tracking-[.12em] text-[#d9bfd2]">
                  Room / event details
                  <textarea required minLength={10} maxLength={4000} rows={4} value={inquiry.room} onChange={(event) => setInquiry({ ...inquiry, room: event.target.value })} placeholder="a gallery, a backyard, a dinner, something that has not been named yet..." className="resize-none rounded-[1.2rem] border border-[#eac8df]/25 bg-[#302039] px-5 py-4 text-sm text-[#ffecd5] outline-none placeholder:text-[#8f6a87] focus:border-[#86dce9]" data-testid="textarea-hosting-room" />
                </label>
                {inquiryError && <p className="rounded-[1rem] border border-[#f362b6]/50 bg-[#5a274f] px-4 py-3 text-sm leading-6 text-[#ffecd5]" role="alert" data-testid="status-hosting-inquiry-error">{inquiryError}</p>}
                <button type="submit" disabled={submitInquiry.isPending} className="mt-2 inline-flex items-center justify-center gap-3 rounded-full bg-[#ffe06a] px-6 py-4 text-xs font-bold uppercase tracking-[.12em] text-[#42194c] transition-transform hover:-translate-y-1 disabled:cursor-wait disabled:opacity-70" data-testid="button-submit-hosting-inquiry">
                  {submitInquiry.isPending ? <><LoaderCircle size={16} className="animate-spin" /> Sending the note...</> : <>Send the invitation <ArrowUpRight size={16} /></>}
                </button>
                <p className="font-mono-custom text-[9px] uppercase leading-4 tracking-[.1em] text-[#9f7c98]">No payment or booking is taken here / we use these details only to reply about your event.</p>
              </form>
            ) : (
              <div className="py-8 text-center" role="status" data-testid="status-hosting-inquiry">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#f362b6] text-[#42194c]"><Check size={30} /></div>
                <p className="section-label mt-7 text-[#86dce9]">the note arrived</p>
                <h3 className="mt-3 font-display text-4xl">Beautiful. The room is listening.</h3>
                <p className="mx-auto mt-4 max-w-[380px] text-sm leading-6 text-[#d9bfd2]">Your hosting inquiry is queued for Llamaste Productions. We’ll reply using the email you shared. No payment was taken and no booking has been made.</p>
                <button type="button" onClick={() => setInquirySent(false)} className="mt-7 rounded-full border border-[#eac8df]/30 px-5 py-3 font-mono-custom text-[10px] uppercase tracking-[.12em] text-[#ffecd5] transition-colors hover:border-[#f362b6]" data-testid="button-edit-hosting-inquiry">Send another note</button>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-[#302039] px-5 pb-8 pt-16 text-[#ffecd5] md:px-10">
        <div className="mx-auto max-w-[1180px]">
          <div className="flex flex-col justify-between gap-12 border-b border-[#eac8df]/20 pb-14 md:flex-row">
            <div>
              <img src={logoImage} alt="Llamaste Productions" className="h-20 w-20 rounded-full object-cover" data-testid="img-hosting-footer-logo" />
              <p className="mt-5 max-w-[330px] font-display text-3xl leading-none text-[#f362b6]">Make room<br />for the unexpected.</p>
            </div>
            <div className="grid grid-cols-2 gap-x-14 gap-y-4 self-end font-mono-custom text-[10px] uppercase tracking-[.15em] text-[#cc9fbd]">
              <Link href="/" className="transition-colors hover:text-[#ffe06a]" data-testid="link-hosting-footer-experience">The experience</Link>
              <Link href="/archive" className="transition-colors hover:text-[#ffe06a]" data-testid="link-hosting-footer-archive">The archive</Link>
              <a href="#hosting-inquire" className="transition-colors hover:text-[#ffe06a]" data-testid="link-hosting-footer-inquire">Start a conversation</a>
              <Link href="/#top" className="transition-colors hover:text-[#ffe06a]" data-testid="link-hosting-footer-return">Back to the room</Link>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-3 pt-6 font-mono-custom text-[9px] uppercase tracking-[.14em] text-[#8f6a87] md:flex-row">
            <span>Llamaste Productions / est. 1998</span><span>Haicuu / hosted by Cujo Sama</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default HostingPage;