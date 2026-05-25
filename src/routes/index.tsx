import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, Download, Cpu, Zap, CircuitBoard } from "lucide-react";
import { HudCircle } from "@/components/HudCircle";
import { Panel, Section } from "@/components/SiteShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Neeraj K — Embedded Systems Engineer" },
      { name: "description", content: "Building intelligent embedded systems and hardware solutions." },
      { property: "og:title", content: "Neeraj K — Embedded Systems Engineer" },
      { property: "og:description", content: "Embedded systems, electronics design, and engineering-focused development." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 pt-16 md:pt-24 pb-20 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-xs text-neon tracking-[0.35em] mb-6 flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-neon anim-pulse-neon" />
              SYS.READY // NEERAJ_K.exe
            </div>
            <h1 className="font-display text-4xl md:text-6xl uppercase leading-[1.05]">
              Building <span className="text-neon">Intelligent</span><br />
              Embedded Systems<br />
              & Hardware <span className="text-neon">Solutions</span>.
            </h1>
            <p className="mt-6 text-muted-foreground max-w-lg leading-relaxed">
              Structural and weight analysis engineer fluent in embedded firmware,
              circuit design, and sensor systems. I prototype hardware that does
              the analytical work — clean signals, reliable control, measurable results.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/projects"
                className="group inline-flex items-center gap-2 bg-neon text-primary-foreground px-5 py-3 text-xs uppercase tracking-[0.25em] font-medium hover:opacity-90 transition"
              >
                View Projects <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 border border-neon text-neon px-5 py-3 text-xs uppercase tracking-[0.25em] hover:bg-neon hover:text-primary-foreground transition-colors"
              >
                Contact Me
              </Link>
              <a
                href="#"
                className="inline-flex items-center gap-2 border border-border px-5 py-3 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
              >
                <Download size={14} /> Resume
              </a>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-4 max-w-md">
              {[
                { k: "EMBEDDED", v: "Systems" },
                { k: "CIRCUIT", v: "Design" },
                { k: "SENSOR", v: "Fusion" },
              ].map((s) => (
                <div key={s.k} className="border-l border-neon/50 pl-3">
                  <div className="text-[10px] text-neon tracking-[0.2em]">{s.k}</div>
                  <div className="text-xs text-muted-foreground">{s.v}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <HudCircle label="NK" size={460} />
          </motion.div>
        </div>
      </section>

      {/* CAPABILITIES */}
      <Section eyebrow="CAPABILITIES" title="Engineering Stack">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Cpu, title: "Embedded Firmware", desc: "Arduino, embedded C, real-time control loops and PID stability tuning." },
            { icon: CircuitBoard, title: "Hardware Design", desc: "R-2R DACs, sensor fusion rigs, PCB and breadboard prototyping." },
            { icon: Zap, title: "Systems Analysis", desc: "Structural & weight analysis informed by automotive engineering principles." },
          ].map((c) => (
            <Panel key={c.title}>
              <c.icon className="text-neon mb-4" size={28} strokeWidth={1.5} />
              <h3 className="font-display text-xl uppercase mb-2">{c.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
            </Panel>
          ))}
        </div>
      </Section>
    </>
  );
}
