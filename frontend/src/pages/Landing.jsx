import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, BarChart3, MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    title: 'Live fleet telemetry',
    description: 'Monitor location, trip status, and maintenance alerts from one unified command center.',
    icon: <MapPin size={20} />,
  },
  {
    title: 'Operational intelligence',
    description: 'Gain instant visibility into costs, route efficiency, and driver performance.',
    icon: <BarChart3 size={20} />,
  },
  {
    title: 'Role-based control',
    description: 'Secure access for administrators, dispatchers, analysts, and safety officers.',
    icon: <ShieldCheck size={20} />,
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background text-text-primary overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,_rgba(0,212,170,0.18),transparent_28%)]" />
      <div className="absolute right-0 top-1/4 w-72 h-72 rounded-full bg-[#ff6b3580] blur-3xl pointer-events-none" />
      <div className="relative px-6 py-8 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-3 rounded-3xl border border-primary/30 bg-surface-elevated/80 px-4 py-2 text-sm text-primary shadow-lg shadow-primary/10 backdrop-blur-xl">
                <Truck size={18} />
                FleetEdge — intelligent fleet command
              </div>
              <h1 className="mt-8 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                Build the safest, fastest and most efficient fleet operations.
              </h1>
              <p className="mt-6 max-w-2xl text-base text-text-secondary sm:text-lg lg:text-xl">
                A polished enterprise dashboard for vehicle tracking, route planning, maintenance management and expense visibility — designed for modern transportation teams.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  to="/login"
                  className="btn-primary inline-flex items-center justify-center gap-2 shadow-xl shadow-primary/20"
                >
                  Get started
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to="/register"
                  className="btn-secondary inline-flex items-center justify-center gap-2"
                >
                  Request access
                </Link>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative w-full max-w-xl rounded-[2rem] border border-white/5 bg-surface p-8 shadow-2xl shadow-black/20 backdrop-blur-xl"
            >
              <div className="absolute inset-x-0 top-0 h-1 rounded-b-full bg-gradient-to-r from-primary via-primary-alt to-accent" />
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-text-muted">Command center preview</p>
                  <h2 className="mt-3 text-3xl font-bold">One dashboard for every mission.</h2>
                </div>
                <div className="rounded-3xl bg-primary/10 p-4 text-primary shadow-inner shadow-primary/10">
                  <ShieldCheck size={24} />
                </div>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-background border border-border p-5">
                  <p className="text-sm text-text-muted uppercase tracking-[0.25em] mb-3">Live status</p>
                  <p className="font-semibold text-text-primary">Active vehicles, trips and alerts updated in real time.</p>
                </div>
                <div className="rounded-3xl bg-background border border-border p-5">
                  <p className="text-sm text-text-muted uppercase tracking-[0.25em] mb-3">Insights</p>
                  <p className="font-semibold text-text-primary">Operational analytics to reduce downtime and maximize utilization.</p>
                </div>
                <div className="rounded-3xl bg-background border border-border p-5">
                  <p className="text-sm text-text-muted uppercase tracking-[0.25em] mb-3">Safety first</p>
                  <p className="font-semibold text-text-primary">Route hygiene, maintenance warnings and compliance monitoring.</p>
                </div>
                <div className="rounded-3xl bg-background border border-border p-5">
                  <p className="text-sm text-text-muted uppercase tracking-[0.25em] mb-3">Secure access</p>
                  <p className="font-semibold text-text-primary">Role-based control for dispatchers, analysts and admins.</p>
                </div>
              </div>
            </motion.div>
          </header>

          <section className="mt-16 rounded-[2rem] bg-surface border border-border p-8 shadow-2xl shadow-black/10 backdrop-blur-xl">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-primary mb-3">Why FleetEdge?</p>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Modern fleet management that scales with your operation.</h2>
                <p className="mt-4 text-text-secondary leading-8">From driver coordination to route delivery, FleetEdge brings clarity to every process and keeps teams aligned with smart dashboards, role-aware permissions, and fast data at a glance.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {features.map((feature) => (
                  <div key={feature.title} className="rounded-3xl border border-border p-6 bg-background/80">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-text-secondary text-sm leading-6">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Landing;
