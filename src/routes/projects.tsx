import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Github, ExternalLink } from "lucide-react";
import { Section } from "@/components/SiteShell";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Neeraj K" },
      { name: "description", content: "Featured embedded systems and hardware engineering projects." },
      { property: "og:title", content: "Projects — Neeraj K" },
      { property: "og:description", content: "Bluetooth mesh comms, R-2R DAC, sensor fusion and PID control prototypes." },
    ],
  }),
  component: Projects,
});

const PROJECTS = [
  {
    id: "01",
    title: "Offline Emergency Comms",
    sub: "Bluetooth Mesh Networking",
    overview: "Disaster-resilient device-to-device emergency messaging without internet connectivity. Prioritises life-critical traffic and reduces network congestion.",
    tech: ["Bluetooth Mesh", "Embedded C", "Priority Queue", "Networking"],
    outcomes: "Concept validated for low-bandwidth survival comms with priority-aware routing.",
  },
  {
    id: "02",
    title: "4-bit R-2R Ladder DAC",
    sub: "Arduino-driven Analog Output",
    overview: "Built and tested a 4-bit digital-to-analog converter using resistor ladder architecture and Arduino control logic. Verified voltage outputs across all 16 binary combinations.",
    tech: ["Arduino", "R-2R Ladder", "Breadboard", "Multimeter"],
    outcomes: "Stable linear voltage steps; demonstrated DAC fundamentals on bare hardware.",
  },
  {
    id: "03",
    title: "Sensor Fusion Prototype",
    sub: "Embedded Motion Sensing",
    overview: "Integrated motion sensors and fusion algorithms on breadboard hardware. Explored complementary and Kalman-style filtering for orientation tracking.",
    tech: ["IMU", "Arduino", "Sensor Fusion", "Signal Processing"],
    outcomes: "Reliable orientation data from low-cost sensors via fused signal pipeline.",
  },
  {
    id: "04",
    title: "PID Control System",
    sub: "Stability & Overshoot Reduction",
    overview: "Studied and implemented proportional, integral and derivative control. Tuned parameters for stability, overshoot reduction and faster system response.",
    tech: ["Control Theory", "Arduino", "Simulation", "Tuning"],
    outcomes: "Hands-on intuition for PID tuning trade-offs across plant dynamics.",
  },
];

function Projects() {
  return (
    <Section eyebrow="PROJECT INDEX" title="Featured Work">
      <div className="grid md:grid-cols-2 gap-6">
        {PROJECTS.map((p, i) => (
          <motion.article
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="corners relative border border-border bg-card/40 p-6 glow-border-hover group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-xs text-neon tracking-[0.3em]">PRJ_{p.id}</div>
              <div className="flex gap-2 opacity-60 group-hover:opacity-100 transition">
                <a href="https://github.com/Neerajk-official" target="_blank" rel="noreferrer" aria-label="GitHub" className="text-muted-foreground hover:text-neon"><Github size={16} /></a>
                <ExternalLink size={16} className="text-muted-foreground" />
              </div>
            </div>

            <h3 className="font-display text-2xl uppercase leading-tight">{p.title}</h3>
            <div className="text-xs text-neon mt-1 tracking-widest">{p.sub}</div>

            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{p.overview}</p>

            <div className="mt-5 flex flex-wrap gap-1.5">
              {p.tech.map((t) => (
                <span key={t} className="text-[10px] tracking-widest uppercase border border-border px-2 py-1 text-muted-foreground">
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-border/60">
              <div className="text-[10px] text-neon tracking-[0.25em] mb-1">// OUTCOME</div>
              <div className="text-xs text-muted-foreground">{p.outcomes}</div>
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
