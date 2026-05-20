import { motion } from "framer-motion";

export function PageHeader({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-8 md:pt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 24 }}
        className="max-w-3xl"
      >
        {eyebrow && (
          <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary-deep">
            {eyebrow}
          </span>
        )}
        <h1 className="mt-4 text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
          <span className="text-gradient">{title}</span>
        </h1>
        {description && <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl">{description}</p>}
      </motion.div>
    </div>
  );
}
