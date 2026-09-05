import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";

const burgundy = "#661813";

function Arrow({ down = false }: { down?: boolean }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" className={down ? "h-5 w-5 rotate-90" : "h-5 w-5"}><path d="M4 12h15M14 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>;
}

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-12%" }} transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

function Button({ children, light = false, href = "#preorder" }: { children: React.ReactNode; light?: boolean; href?: string }) {
  return <motion.a href={href} whileHover={{ scale: 1.025 }} whileTap={{ scale: 0.98 }} className={`group inline-flex items-center justify-center gap-5 px-7 py-4 text-[11px] font-bold tracking-[0.2em] transition-colors ${light ? "bg-[#f5eee4] text-[#661813] hover:bg-white" : "bg-[#661813] text-white hover:bg-[#4d100d]"}`}>{children}<span className="transition-transform group-hover:translate-x-1"><Arrow /></span></motion.a>;
}

function CustomCursor() {
  const x = useSpring(0, { stiffness: 500, damping: 35 });
  const y = useSpring(0, { stiffness: 500, damping: 35 });
  useEffect(() => {
    const move = (e: MouseEvent) => { x.set(e.clientX - 7); y.set(e.clientY - 7); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);
  return <motion.div style={{ x, y }} className="pointer-events-none fixed left-0 top-0 z-[100] hidden h-3.5 w-3.5 rounded-full bg-[#661813] mix-blend-multiply lg:block" />;
}

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const imageY = useTransform(scrollYProgress, [0, 0.8], [0, -80]);
  const imageScale = useTransform(scrollYProgress, [0, 0.45, 1], [1, 1.06, 0.96]);
  const imageRotate = useTransform(scrollYProgress, [0, 0.5, 1], [0, -1.5, 0]);
  const coverOpacity = useTransform(scrollYProgress, [0.35, 0.62], [1, 0]);
  const openOpacity = useTransform(scrollYProgress, [0.35, 0.62], [0, 1]);
  const words = ["PLAN", "MOVE", "TRACK", "RESET", "CHANGE"];
  const [wordIndex, setWordIndex] = useState(-1);
  useMotionValueEvent(scrollYProgress, "change", (v) => setWordIndex(v < 0.16 ? -1 : Math.min(4, Math.floor((v - 0.16) * 6.1))));
  return <section ref={ref} className="relative h-[220vh] bg-[#f3eadf]">
    <div className="sticky top-0 h-screen overflow-hidden">
      <header className="absolute inset-x-0 top-0 z-30 flex h-24 items-center justify-between px-5 md:px-10 lg:px-16">
        <a href="#" className="font-serif text-[21px] font-semibold tracking-[0.12em] text-[#661813]">BUSY GIRL CO.</a>
        <nav className="hidden items-center gap-9 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#661813] lg:flex"><a href="#showcase">The Planner</a><a href="#inside">What's Inside</a><a href="#system">The System</a><a href="#reviews">Reviews</a></nav>
        <a href="#preorder" className="border-b border-[#661813] pb-1 text-[10px] font-bold tracking-[0.2em] text-[#661813]">PRE-ORDER</a>
      </header>
      <div className="absolute inset-0 flex items-end md:items-center">
        <div className="relative z-10 w-full px-5 pb-12 md:w-[56%] md:px-10 md:pb-0 lg:px-16">
          <motion.p style={{ opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]) }} className="mb-6 text-[11px] font-bold uppercase tracking-[0.28em] text-[#661813]">The Busy Girl Planner</motion.p>
          <motion.h1 style={{ opacity: useTransform(scrollYProgress, [0, 0.22], [1, 0]), y: useTransform(scrollYProgress, [0, 0.25], [0, -25]) }} className="max-w-[720px] font-serif text-[clamp(3.15rem,6.2vw,6.9rem)] leading-[0.86] tracking-[-0.05em] text-[#661813]">PLAN YOUR DAY.<br />MOVE YOUR BODY.<br /><em className="font-light">CHANGE YOUR LIFE.</em></motion.h1>
          <motion.p style={{ opacity: useTransform(scrollYProgress, [0, 0.17], [1, 0]) }} className="mt-7 text-sm text-[#661813]/70 md:text-base">The planner designed for your real, busy life.</motion.p>
        </div>
        <motion.div style={{ y: imageY, scale: imageScale, rotate: imageRotate }} className="absolute inset-x-0 top-24 h-[52vh] md:inset-y-0 md:left-[50%] md:right-0 md:top-0 md:h-auto">
          <motion.img style={{ opacity: coverOpacity }} src="/images/planner-hero.jpg" alt="Closed burgundy Busy Girl planner" className="absolute inset-0 h-full w-full object-cover" />
          <motion.img style={{ opacity: openOpacity }} src="/images/planner-open.jpg" alt="Open Busy Girl planner showing planning pages" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#f3eadf]/20 via-transparent to-[#f3eadf] md:bg-gradient-to-r md:from-[#f3eadf] md:via-transparent md:to-transparent" />
        </motion.div>
        <AnimatePresence mode="wait">{wordIndex >= 0 && <motion.div key={wordIndex} initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -25 }} className="absolute inset-0 z-20 flex items-center justify-center font-serif text-[18vw] leading-none text-white mix-blend-difference">{words[wordIndex]}</motion.div>}</AnimatePresence>
        <motion.div style={{ opacity: useTransform(scrollYProgress, [0.9, 1], [0, 1]) }} className="absolute inset-x-0 bottom-12 z-20 text-center font-serif text-3xl italic text-[#661813] md:text-5xl">Feel in control.</motion.div>
        <div className="absolute bottom-8 right-8 z-20 hidden items-center gap-3 text-[9px] font-bold tracking-[0.2em] text-[#661813] md:flex"><span>SCROLL TO OPEN</span><Arrow down /></div>
      </div>
    </div>
  </section>;
}

const systemItems = [["01", "PLAN", "Plan your week.", "Clear the mental clutter."], ["02", "MOVE", "Track movement.", "Build routines you actually enjoy."], ["03", "NOURISH", "Organise your meals.", "Make healthy choices easier."], ["04", "TRACK", "Build habits.", "See yourself showing up."]];

function Philosophy() {
  return <section className="bg-[#fffaf4] px-5 py-28 md:px-10 md:py-44 lg:px-16"><div className="mx-auto max-w-6xl">
    <Reveal><p className="font-serif text-3xl italic text-[#a56f69] md:text-5xl">You don't need more motivation.</p></Reveal>
    <Reveal delay={0.12}><h2 className="mt-3 max-w-5xl font-serif text-[clamp(3rem,7vw,7.5rem)] leading-[0.92] tracking-[-0.045em] text-[#661813]">You need a system that actually works with your life.</h2></Reveal>
    <div className="mt-20 grid gap-12 border-t border-[#661813]/20 pt-10 md:grid-cols-2 md:gap-24"><Reveal><h3 className="font-serif text-5xl text-[#661813] md:text-7xl">Meet <em>Busy Girl.</em></h3></Reveal><Reveal delay={0.15}><p className="max-w-lg text-base leading-7 text-[#4b2925]/75">Busy Girl was created for the days when life feels full, routines feel impossible, and "I'll start Monday" keeps becoming next Monday.<br /><br />A planner designed to make everyday life feel simpler, more organised and more manageable.</p><div className="mt-8"><Button href="#showcase">EXPLORE THE PLANNER</Button></div></Reveal></div>
  </div></section>;
}

function System() {
  return <section id="system" className="bg-[#661813] px-5 py-28 text-[#f6eee4] md:px-10 md:py-40 lg:px-16"><div className="mx-auto max-w-7xl"><Reveal><p className="section-label text-[#dca69e]">THE BUSY GIRL SYSTEM</p><h2 className="mt-5 font-serif text-[clamp(3.3rem,7vw,7rem)] leading-[0.88] tracking-[-0.04em]">ONE PLANNER.<br /><em>YOUR WHOLE ROUTINE.</em></h2></Reveal>
    <div className="mt-20 grid border-l border-t border-white/20 md:grid-cols-2 lg:grid-cols-4">{systemItems.map((item, i) => <motion.article key={item[1]} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10%" }} transition={{ delay: i * .12, duration: .7 }} className="min-h-72 border-b border-r border-white/20 p-7 transition-colors hover:bg-white hover:text-[#661813] md:min-h-96"><span className="text-[10px] tracking-[.2em] opacity-60">{item[0]}</span><h3 className="mt-16 font-serif text-5xl">{item[1]}</h3><p className="mt-8 text-sm leading-6 opacity-80">{item[2]}<br />{item[3]}</p></motion.article>)}</div>
  </div></section>;
}

const pageContent = [["Weekly planning", "Make space for what matters."], ["Habit tracking", "Tiny marks. Visible momentum."], ["Wellness", "Check in with how you feel."], ["Meals", "Take the guesswork out of dinner."], ["Movement", "Plan movement that feels good."], ["Notes + reminders", "Keep it all in one calm place."]];

function Inside() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });
  const [page, setPage] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", v => setPage(Math.min(5, Math.floor(v * 6))));
  return <section id="inside" ref={ref} className="relative h-[420vh] bg-[#eee2d6]"><div className="sticky top-0 flex h-screen flex-col overflow-hidden px-5 py-20 md:flex-row md:items-center md:px-10 lg:px-16">
    <div className="z-10 md:w-[38%]"><p className="section-label">LOOK INSIDE</p><h2 className="mt-4 font-serif text-6xl text-[#661813] md:text-8xl">WHAT'S<br /><em>INSIDE?</em></h2><p className="mt-5 text-sm text-[#661813]/65">More than a diary. Your everyday system.</p><div className="mt-10 hidden md:block"><AnimatePresence mode="wait"><motion.div key={page} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}><span className="text-[10px] tracking-[.2em]">0{page + 1} / 06</span><h3 className="mt-2 font-serif text-3xl text-[#661813]">{pageContent[page][0]}</h3><p className="mt-2 text-sm text-[#661813]/60">{pageContent[page][1]}</p></motion.div></AnimatePresence></div></div>
    <div className="relative mt-8 h-[48vh] md:mt-0 md:h-[72vh] md:w-[62%]"><motion.img src={page % 2 ? "/images/planner-lifestyle.jpg" : "/images/planner-open.jpg"} key={page % 2} initial={{ opacity: .5, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} className="h-full w-full object-cover shadow-[0_30px_70px_rgba(64,20,16,.18)]" alt="Detailed view of the Busy Girl planner" /><div className="absolute inset-0 bg-gradient-to-r from-[#eee2d6]/30 to-transparent" /><div className="absolute bottom-5 left-5 bg-[#fffaf4]/95 px-5 py-4 md:hidden"><p className="font-serif text-xl text-[#661813]">{pageContent[page][0]}</p></div></div>
  </div></section>;
}

const times = [["7:00 AM", "Plan your day."], ["12:30 PM", "Move your body."], ["6:00 PM", "Reset your routine."], ["10:30 PM", "Show up for yourself."]];
function DayWithBusyGirl() {
  return <section className="bg-[#fffaf4] py-28 md:py-40"><div className="px-5 md:px-10 lg:px-16"><Reveal><p className="section-label">A DAY WITH BUSY GIRL</p><h2 className="mt-4 max-w-4xl font-serif text-6xl leading-[.95] text-[#661813] md:text-8xl">A little intention,<br /><em>all day long.</em></h2></Reveal></div>
    <div className="mt-20 grid lg:grid-cols-2"><div className="min-h-[70vh] overflow-hidden"><motion.img whileInView={{ scale: 1 }} initial={{ scale: 1.08 }} transition={{ duration: 1.5 }} src="/images/planner-lifestyle.jpg" alt="Planning a busy day" className="h-full w-full object-cover" /></div><div className="flex flex-col justify-center px-5 py-12 md:px-16">{times.map((x, i) => <Reveal key={x[0]} delay={i * .08} className="grid grid-cols-[100px_1fr] border-t border-[#661813]/20 py-7 text-[#661813] md:grid-cols-[160px_1fr]"><span className="text-xs font-bold tracking-[.12em]">{x[0]}</span><span className="font-serif text-2xl md:text-4xl">{x[1]}</span></Reveal>)}<Reveal><p className="mt-10 font-serif text-4xl italic text-[#a56f69] md:text-5xl">Small systems. Big difference.</p></Reveal></div></div>
  </section>;
}

function SundayReset() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const tasks = ["emails", "laundry", "groceries", "workout", "appointments", "meals", "errands"];
  return <section ref={ref} className="h-[250vh] bg-[#d9aaa3]"><div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-5">
    <motion.h2 style={{ opacity: useTransform(scrollYProgress, [0, .28, .5], [1, 1, 0]) }} className="absolute top-[16%] z-20 text-center font-serif text-5xl text-[#661813] md:text-7xl">Feeling a little behind?</motion.h2>
    {tasks.map((task, i) => { const angle = (i / tasks.length) * Math.PI * 2; const x = Math.cos(angle) * (26 + i % 2 * 10); const y = Math.sin(angle) * (25 + i % 3 * 6); return <motion.span key={task} style={{ left: `${50+x}%`, top: `${52+y}%`, x: useTransform(scrollYProgress, [0, .65], [0, -x * 9]), y: useTransform(scrollYProgress, [0, .65], [0, -y * 7]), opacity: useTransform(scrollYProgress, [.35, .68], [1, 0]) }} className="absolute font-serif text-xl italic text-[#661813] md:text-3xl">{task}</motion.span> })}
    <motion.img style={{ opacity: useTransform(scrollYProgress, [.25, .58], [0, 1]), scale: useTransform(scrollYProgress, [.25, .7], [.75, 1]), rotate: useTransform(scrollYProgress, [.25, .7], [8, 0]) }} src="/images/planner-hero.jpg" alt="Busy Girl planner ready for a Sunday reset" className="h-[50vh] w-[70vw] max-w-2xl object-cover shadow-2xl md:h-[64vh] md:w-[44vw]" />
    <motion.div style={{ opacity: useTransform(scrollYProgress, [.68, .84], [0, 1]), y: useTransform(scrollYProgress, [.68, .84], [25, 0]) }} className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#661813]/82 text-center text-[#fff7ef] backdrop-blur-[2px]"><p className="section-label text-[#e5b7b0]">SUNDAY, 6:00 PM</p><h2 className="mt-4 font-serif text-[18vw] leading-none md:text-[10vw]">LET'S RESET.</h2><p className="mt-8 text-sm leading-7 md:text-base">Plan the week.<br />Clear the mind.<br />Start again.</p></motion.div>
  </div></section>;
}

function HabitTracker() {
  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  return <section className="bg-[#fffaf4] px-5 py-32 text-[#661813] md:px-10 md:py-44 lg:px-16"><div className="mx-auto max-w-6xl"><p className="section-label text-center">THE HABIT TRACKER</p><div className="mt-16 flex justify-between gap-2 border-y border-[#661813]/20 py-9 md:py-14">{days.map((d, i) => <motion.div key={d} initial="off" whileInView="on" viewport={{ once: true, margin: "-20%" }} className="flex flex-col items-center gap-5"><motion.div variants={{ off: { backgroundColor: "transparent", scale: .8 }, on: { backgroundColor: burgundy, scale: 1 } }} transition={{ delay: .15 + i*.1, duration: .4 }} className="flex h-8 w-8 items-center justify-center rounded-full border border-[#661813] text-white md:h-14 md:w-14"><motion.svg variants={{ off: { pathLength: 0 }, on: { pathLength: 1 } }} viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current md:h-6 md:w-6"><motion.path d="m6 12 4 4 8-9" strokeWidth="2" fill="none" /></motion.svg></motion.div><span className="text-[8px] font-bold tracking-[.1em] md:text-[11px] md:tracking-[.2em]">{d}</span></motion.div>)}</div>
    <Reveal className="mt-20 text-center"><h2 className="font-serif text-5xl md:text-8xl">CONSISTENCY <em>&gt;</em><br />MOTIVATION</h2><p className="mt-7 leading-7 text-[#661813]/65">You don't have to do everything.<br />You just have to keep showing up.</p></Reveal></div></section>;
}

function BeforeAfter() {
  const [position, setPosition] = useState(50);
  const before = ["Messy schedule", "Missed workouts", "Forgotten tasks", "Random routines", "\"I'll start Monday.\""];
  const after = ["Planned week", "Tracked habits", "Movement", "Meals organised", "Time for yourself"];
  return <section className="bg-[#efe1d9] py-28 md:py-40"><Reveal className="px-5 text-center"><p className="section-label">THE SHIFT</p><h2 className="mt-4 font-serif text-5xl text-[#661813] md:text-8xl">FROM BUSY TO <em>IN CONTROL.</em></h2></Reveal>
    <div className="relative mx-auto mt-16 h-[580px] max-w-7xl select-none overflow-hidden md:h-[680px]"><div className="absolute inset-0 flex flex-col items-center justify-center bg-[#661813] px-8 text-[#fff8f0]"><span className="section-label text-[#d9aaa3]">AFTER</span><h3 className="mt-6 font-serif text-5xl italic md:text-7xl">Calm. Clear. Ready.</h3><ul className="mt-10 space-y-3 text-center text-sm tracking-[.08em]">{after.map(x => <li key={x}>{x}</li>)}</ul></div><div className="absolute inset-y-0 left-0 flex flex-col items-center justify-center overflow-hidden bg-[#d9aaa3] px-8 text-[#661813]" style={{ width: `${position}%` }}><div className="w-screen max-w-7xl text-center"><span className="section-label">BEFORE</span><h3 className="mt-6 font-serif text-5xl italic md:text-7xl">Scattered. Stretched.</h3><ul className="mt-10 space-y-3 text-sm tracking-[.08em]">{before.map(x => <li key={x}>{x}</li>)}</ul></div></div><div className="absolute inset-y-0 w-px bg-white" style={{ left: `${position}%` }}><div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#fffaf4] text-[#661813] shadow-xl"><span className="text-xl">↔</span></div></div><input aria-label="Compare before and after" type="range" min="8" max="92" value={position} onChange={e => setPosition(Number(e.target.value))} className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0" /></div>
  </section>;
}

function ProductShowcase() {
  return <section id="showcase" className="bg-[#fffaf4] px-5 py-28 md:px-10 md:py-44 lg:px-16"><div className="mx-auto max-w-7xl"><Reveal className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="section-label">THE BUSY GIRL PLANNER</p><h2 className="mt-4 font-serif text-6xl text-[#661813] md:text-8xl">Made to live<br /><em>with you.</em></h2></div><p className="max-w-xs text-sm leading-6 text-[#661813]/60">Considered pages, tactile details, and a beautiful object you'll want to keep close.</p></Reveal>
    <div className="mt-16 grid gap-4 md:grid-cols-12 md:grid-rows-2"><motion.figure whileHover={{ scale: .995 }} className="group overflow-hidden md:col-span-7 md:row-span-2"><img src="/images/planner-hero.jpg" alt="Busy Girl planner cover" className="aspect-[4/5] h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" /></motion.figure><figure className="overflow-hidden md:col-span-5"><img src="/images/planner-detail.jpg" alt="Close up of planner paper and binding" className="aspect-[4/3] h-full w-full object-cover" /></figure><figure className="overflow-hidden md:col-span-5"><img src="/images/planner-open.jpg" alt="Busy Girl planner open pages" className="aspect-[4/3] h-full w-full object-cover" /></figure></div><div className="mt-6 flex justify-between text-[9px] font-bold tracking-[.18em] text-[#661813]/60"><span>COVER / OPEN / DETAIL</span><span>DESIGNED FOR THE EVERYDAY</span></div>
  </div></section>;
}

function SocialProof() {
  const quotes = ["My week feels less like a list I am chasing.", "It gives my habits somewhere to live.", "The reset page is the ritual I needed."];
  return <section id="reviews" className="bg-[#ead2cd] px-5 py-28 text-[#661813] md:px-10 md:py-40 lg:px-16"><div className="mx-auto max-w-7xl"><Reveal><p className="section-label">IN THEIR WORDS</p><blockquote className="mt-8 max-w-6xl font-serif text-[clamp(3.2rem,7.5vw,8rem)] leading-[.95] tracking-[-.04em]">“I finally feel like I have my life together.”</blockquote><p className="mt-6 text-xs italic opacity-60">Sample testimonial copy, ready to replace with verified customer feedback.</p></Reveal><div className="mt-20 grid border-t border-[#661813]/25 md:grid-cols-3">{quotes.map((q, i) => <Reveal key={q} delay={i*.1} className="border-b border-[#661813]/25 py-9 md:border-r md:px-8 md:first:pl-0"><p className="font-serif text-2xl leading-snug">“{q}”</p><p className="mt-8 text-[9px] font-bold tracking-[.18em] opacity-60">SAMPLE REVIEW 0{i+1}</p></Reveal>)}</div></div></section>;
}

function Value() {
  const values = ["PLAN BETTER", "BUILD HABITS", "MOVE MORE", "FEEL ORGANISED", "SHOW UP"];
  return <section className="bg-[#fffaf4] px-5 py-28 md:px-10 md:py-40 lg:px-16"><div className="mx-auto max-w-7xl"><Reveal><h2 className="font-serif text-6xl leading-[.92] text-[#661813] md:text-8xl">DESIGNED FOR REAL LIFE.<br /><em>NOT PERFECT LIFE.</em></h2></Reveal><div className="mt-16">{values.map((v, i) => <motion.div key={v} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i*.06 }} className="group flex items-center justify-between border-t border-[#661813]/25 py-5 text-[#661813] last:border-b md:py-7"><span className="text-[10px] tracking-[.2em]">0{i+1}</span><h3 className="font-serif text-3xl transition-transform group-hover:-translate-x-3 md:text-5xl">{v}</h3><Arrow /></motion.div>)}</div></div></section>;
}

function Preorder() {
  return <section id="preorder" className="relative min-h-screen overflow-hidden bg-[#661813] text-[#fff8ef]"><img src="/images/planner-lifestyle.jpg" alt="The Busy Girl lifestyle" className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-luminosity" /><div className="absolute inset-0 bg-gradient-to-r from-[#661813] via-[#661813]/90 to-[#661813]/35" /><div className="relative z-10 flex min-h-screen items-center px-5 py-28 md:px-10 lg:px-16"><Reveal className="max-w-5xl"><p className="section-label text-[#e5b7b0]">PRE-ORDER THE PLANNER</p><h2 className="mt-5 font-serif text-[clamp(3.5rem,8vw,8rem)] leading-[.9] tracking-[-.04em]">READY TO GET YOUR LIFE A LITTLE MORE <em>TOGETHER?</em></h2><p className="mt-8 text-base leading-7 text-white/75">Your routine doesn't need to be perfect.<br />It just needs a plan.</p><div className="mt-10 flex flex-col gap-3 sm:flex-row"><Button light>JOIN THE PRE-ORDER</Button><a href="#footer" className="inline-flex items-center justify-center border border-white/35 px-7 py-4 text-[10px] font-bold tracking-[.18em] transition-colors hover:bg-white hover:text-[#661813]">FOLLOW THE JOURNEY</a></div></Reveal></div></section>;
}

function Final() {
  return <section className="flex min-h-screen items-center justify-center bg-[#f3eadf] px-5 py-36 text-center text-[#661813]"><Reveal><p className="font-serif text-3xl italic md:text-5xl">Your best days don't happen by accident.</p><h2 className="mt-5 font-serif text-[clamp(4rem,10vw,10rem)] leading-[.85] tracking-[-.05em]">You make a plan<br /><em>for them.</em></h2><p className="mx-auto mt-12 max-w-lg text-[11px] font-bold leading-6 tracking-[.22em]">PLAN YOUR DAY. &nbsp; MOVE YOUR BODY. &nbsp; CHANGE YOUR LIFE.</p><div className="mt-10"><Button>JOIN THE BUSY GIRLS</Button></div></Reveal></section>;
}

function Footer() {
  return <footer id="footer" className="bg-[#46100d] px-5 pb-8 pt-20 text-[#f6eee4] md:px-10 lg:px-16"><div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-14 border-b border-white/20 pb-16 md:flex-row"><div><p className="font-serif text-3xl tracking-[.1em]">BUSY GIRL CO.</p><p className="mt-4 max-w-xs text-sm leading-6 text-white/55">A plan for your real, busy, beautiful life.</p></div><div className="grid grid-cols-2 gap-16 text-[10px] font-bold tracking-[.15em]"><div className="space-y-4"><a className="block" href="#showcase">THE PLANNER</a><a className="block" href="#inside">WHAT'S INSIDE</a><a className="block" href="#reviews">REVIEWS</a></div><div className="space-y-4"><a className="block" href="#preorder">PRE-ORDER</a><a className="block" href="#">INSTAGRAM</a><a className="block" href="#">TIKTOK</a></div></div></div><div className="flex flex-col justify-between gap-4 pt-7 text-[8px] tracking-[.15em] text-white/40 md:flex-row"><span>© 2026 BUSY GIRL CO.</span><span>PLAN. MOVE. CHANGE.</span></div></div></footer>;
}

export default function App() {
  return <><CustomCursor /><main><Hero /><Philosophy /><System /><Inside /><DayWithBusyGirl /><SundayReset /><HabitTracker /><BeforeAfter /><ProductShowcase /><SocialProof /><Value /><Preorder /><Final /></main><Footer /></>;
}
