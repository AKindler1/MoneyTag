"use client"

import { motion } from "framer-motion"
import { ArrowRight, Lock, Tag, Terminal, Shield, ChevronDown, Loader2 } from "lucide-react"
import { formatLargeCurrency, calculateLeakStats, getCurrentFiscalYear } from "@/lib/moneytag-data"
import { useToptierAgencies } from "@/hooks/use-spending-data"
import type { Screen } from "@/components/nav-header"

export interface ScreenMissionProps {
  onNavigate: (screen: Screen) => void
}

function MoneyLeakAnimation({ totalBudgetLabel }: { totalBudgetLabel: string }) {
  const leakPaths = Array.from({ length: 8 }, (_, i) => i)
  const fy = getCurrentFiscalYear()
  return (
    <div className="relative h-80 w-full overflow-hidden">
      <svg viewBox="0 0 600 300" className="h-full w-full" aria-hidden="true">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,255,65,0.06)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="600" height="300" fill="url(#grid)" />

        <motion.path
          d="M 200 60 L 170 240 L 430 240 L 400 60 Z"
          fill="none"
          stroke="#00FF41"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        <motion.text
          x="300"
          y="155"
          textAnchor="middle"
          fill="#00FF41"
          fontFamily="monospace"
          fontSize="22"
          fontWeight="bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {totalBudgetLabel}
        </motion.text>
        <motion.text
          x="300"
          y="178"
          textAnchor="middle"
          fill="#666666"
          fontFamily="monospace"
          fontSize="10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          {`U.S. TREASURY FY${fy}`}
        </motion.text>

        {leakPaths.map((i) => {
          const x = 190 + (i % 4) * 60 + (i >= 4 ? 30 : 0)
          const y = i >= 4 ? 200 : 130
          return (
            <g key={i}>
              <motion.circle
                cx={x}
                cy={y}
                r="4"
                fill="#FF3131"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 1], scale: [0, 1, 1] }}
                transition={{ delay: 1.5 + i * 0.1, duration: 0.3 }}
              />
              <motion.line
                x1={x}
                y1={y + 4}
                x2={x}
                y2={y + 40}
                stroke="#FF3131"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: [0, 0.6, 0.6] }}
                transition={{ delay: 2 + i * 0.1, duration: 0.5, repeat: Infinity, repeatType: "loop", repeatDelay: 1 }}
              />
            </g>
          )
        })}

        <motion.path
          d="M 180 100 C 220 90 240 170 280 130 C 320 90 340 200 380 160 C 400 130 410 180 420 150"
          fill="none"
          stroke="#00FF41"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 3, duration: 2, ease: "easeInOut" }}
          style={{ filter: "drop-shadow(0 0 8px rgba(0,255,65,0.6))" }}
        />

        <motion.g initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 4.5 }}>
          <rect x="440" y="130" width="120" height="30" fill="#050505" stroke="#00FF41" strokeWidth="1" />
          <text x="500" y="150" textAnchor="middle" fill="#00FF41" fontFamily="monospace" fontSize="11">
            MONEYTAG
          </text>
        </motion.g>
      </svg>
    </div>
  )
}

function PipelineStep({ icon, label, description, delay }: { icon: React.ReactNode; label: string; description: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      viewport={{ once: true }}
      className="flex flex-1 flex-col items-center gap-3 border border-border bg-card p-6 text-center"
    >
      <div className="flex h-12 w-12 items-center justify-center border border-primary/30 bg-primary/5">
        {icon}
      </div>
      <h3 className="font-mono text-sm font-bold tracking-wider text-primary">{label}</h3>
      <p className="font-mono text-xs leading-relaxed text-muted-foreground">{description}</p>
    </motion.div>
  )
}

function LiveStats() {
  const { data, isLoading } = useToptierAgencies()
  const stats = data ? calculateLeakStats(data.results) : null

  if (isLoading || !stats) {
    return (
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-px bg-border md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2 bg-card p-10">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <div className="h-3 w-24 animate-pulse bg-secondary" />
          </div>
        ))}
      </div>
    )
  }

  const statItems = [
    { value: formatLargeCurrency(stats.totalBudget), label: "TOTAL BUDGET AUTHORITY", color: "text-primary", glow: "glow-green" },
    { value: formatLargeCurrency(stats.totalObligated), label: "TOTAL OBLIGATED", color: "text-primary", glow: "glow-green" },
    { value: formatLargeCurrency(stats.unobligated), label: "UNOBLIGATED FUNDS", color: "text-destructive", glow: "glow-red" },
    { value: `${stats.agencyCount}`, label: "ACTIVE AGENCIES", color: "text-primary", glow: "glow-green" },
  ]

  return (
    <div className="mx-auto grid max-w-5xl grid-cols-2 gap-px bg-border md:grid-cols-4">
      {statItems.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-2 bg-card p-6 md:p-10"
        >
          <span className={`font-mono text-2xl font-bold md:text-4xl ${stat.color} ${stat.glow}`}>
            {stat.value}
          </span>
          <span className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground md:text-[10px]">{stat.label}</span>
        </motion.div>
      ))}
    </div>
  )
}

export function ScreenMission({ onNavigate }: ScreenMissionProps) {
  const { data: agenciesData } = useToptierAgencies()
  const stats = agenciesData ? calculateLeakStats(agenciesData.results) : null
  const totalBudgetLabel = stats ? formatLargeCurrency(stats.totalBudget) : "..."

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-6 pb-16 pt-20">
        <div className="grid-bg absolute inset-0" />
        <div className="relative z-10 flex max-w-5xl flex-col items-center gap-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 border border-primary/30 bg-primary/5 px-4 py-1.5"
          >
            <Shield className="h-3 w-3 text-primary" />
            <span className="font-mono text-[10px] tracking-[0.3em] text-primary">FEDERAL SPENDING TRACKER v1.0</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-balance text-center font-mono text-5xl font-bold leading-tight tracking-tight text-foreground md:text-7xl"
          >
            From Treasury
            <br />
            <span className="glow-green text-primary">to Bedside.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="max-w-2xl text-pretty text-center font-mono text-sm leading-relaxed text-muted-foreground"
          >
            MoneyTag tracks every federal dollar from appropriation to expenditure,
            creating a transparent chain of custody from the U.S. Treasury
            to its final destination. Powered by live USASpending.gov data.
            Every. Single. Dollar. Tracked.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <button
              onClick={() => onNavigate("ledger")}
              className="group flex items-center gap-2 bg-primary px-6 py-3 font-mono text-xs font-bold tracking-wider text-primary-foreground transition-all hover:bg-primary/90"
            >
              VIEW LIVE LEDGER
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="relative z-10 mt-12 w-full max-w-3xl"
        >
          <MoneyLeakAnimation totalBudgetLabel={totalBudgetLabel} />
        </motion.div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="mt-8">
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        </motion.div>
      </section>

      {/* Pipeline Section */}
      <section className="border-t border-border px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-12 text-center">
            <span className="font-mono text-[10px] tracking-[0.3em] text-primary">HOW IT WORKS</span>
            <h2 className="mt-2 font-mono text-3xl font-bold text-foreground">The Spending Lifecycle</h2>
          </motion.div>

          <div className="flex flex-col gap-4 md:flex-row">
            <PipelineStep
              icon={<Lock className="h-6 w-6 text-primary" />}
              label="PHASE A: APPROPRIATION"
              description="Congress allocates funds and the Treasury issues budget authority. Every dollar is tagged and tracked from the moment it enters the federal pipeline."
              delay={0}
            />
            <div className="hidden items-center md:flex">
              <ArrowRight className="h-5 w-5 text-primary" />
            </div>
            <PipelineStep
              icon={<Tag className="h-6 w-6 text-primary" />}
              label="PHASE B: FLOW"
              description="Funds flow through federal agencies, bureaus, and sub-agencies. Every organization is a node in the spending hierarchy, fully traceable."
              delay={0.15}
            />
            <div className="hidden items-center md:flex">
              <ArrowRight className="h-5 w-5 text-primary" />
            </div>
            <PipelineStep
              icon={<Terminal className="h-6 w-6 text-primary" />}
              label="PHASE C: EXPENDITURE"
              description="Money reaches the final expenditure. Direct payments, contracts, grants, and purchases are recorded with full accountability at the terminal level."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Stats Section -- LIVE DATA */}
      <section className="border-t border-border px-6 py-20">
        <div className="mx-auto mb-8 max-w-5xl text-center">
          <span className="font-mono text-[10px] tracking-[0.3em] text-primary">LIVE FROM USASPENDING.GOV</span>
          <h2 className="mt-2 font-mono text-3xl font-bold text-foreground">Federal Budget at a Glance</h2>
        </div>
        <LiveStats />
      </section>

      {/* CTA Section */}
      <section className="border-t border-border px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center"
        >
          <span className="font-mono text-[10px] tracking-[0.3em] text-destructive">THE PROBLEM IS SYSTEMIC</span>
          <h2 className="text-balance font-mono text-3xl font-bold text-foreground">
            Trillions flow through federal agencies with limited real-time visibility.
          </h2>
          <p className="text-pretty font-mono text-sm leading-relaxed text-muted-foreground">
            MoneyTag doesn{"'"}t ask for permission. It demands proof.
            Explore the live ledger powered by real USASpending data to see where every tagged dollar sits right now.
          </p>
          <button
            onClick={() => onNavigate("ledger")}
            className="group mt-4 flex items-center gap-2 bg-primary px-8 py-4 font-mono text-xs font-bold tracking-wider text-primary-foreground transition-all hover:bg-primary/90"
          >
            ENTER THE LEDGER
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>
      </section>
    </div>
  )
}
