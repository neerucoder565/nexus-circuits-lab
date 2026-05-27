import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ExternalLink } from "lucide-react";
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
    date: "2025-Q3",
    title: "Edge Vision Detection System",
    sub: "On-Device Vision on Resource-Constrained Hardware",
    overview: "Real-time object detection and image preprocessing pipeline running on an FPGA-based preprocessing stage with the VEGA RISC-V processor. Designed for efficient feature extraction, noise reduction, and low-latency detection in hardware-constrained environments.",
    tech: ["FPGA", "VEGA RISC-V", "Image Processing", "Object Detection", "Edge AI"],
    outcomes: "Streamlined vision pipeline delivering low-latency detection on resource-constrained hardware.",
  },
  {
    id: "02",
    date: "2025-Q2",
    title: "4-bit R-2R Ladder DAC",
    sub: "Arduino-driven Analog Output",
    overview: "Built and tested a 4-bit digital-to-analog converter using resistor ladder architecture and Arduino control logic. Verified voltage outputs across all 16 binary combinations.",
    tech: ["Arduino", "R-2R Ladder", "Breadboard", "Multimeter"],
    outcomes: "Stable linear voltage steps; demonstrated DAC fundamentals on bare hardware.",
  },
  {
    id: "03",
    date: "2025-Q1",
    title: "Sensor Fusion Prototype",
    sub: "Embedded Motion Sensing",
    overview: "Integrated motion sensors and fusion algorithms on breadboard hardware. Explored complementary and Kalman-style filtering for orientation tracking.",
    tech: ["IMU", "Arduino", "Sensor Fusion", "Signal Processing"],
    outcomes: "Reliable orientation data from low-cost sensors via fused signal pipeline.",
  },
  {
    id: "04",
    date: "2024-Q4",
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
              <div className="flex items-center gap-3">
                <div className="text-xs text-neon tracking-[0.3em]">PRJ_{p.id}</div>
                <div className="text-[10px] text-muted-foreground tracking-[0.25em]">// {p.date}</div>
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-[9px] tracking-[0.25em] uppercase border border-neon/40 text-neon/80 px-2 py-1">
                  // Code coming soon
                </span>
                <ExternalLink size={16} className="text-muted-foreground opacity-60" />
              </div>
            </div>

            <div className="relative mb-4 aspect-[16/9] border border-border bg-background/40 overflow-hidden grid place-items-center"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(0,255,170,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,170,0.06) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            >
              <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 3px)"
              }} />
              <div className="text-[10px] text-neon tracking-[0.3em] relative">// PHOTO COMING SOON</div>
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
