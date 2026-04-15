import { PrototypeShell } from "@/components/prototype/PrototypeShell";

const improvementSections = [
  {
    title: "Stakeholder view",
    items: [
      "Show the current owner, prior owners, and transfer chain in one timeline.",
      "Highlight dates executed for deeds, mutation entries, and related approvals.",
      "Expose who can act on the property: owner, bank, legal heir, or authorized representative.",
    ],
  },
  {
    title: "Encumbrance intelligence",
    items: [
      "Track mortgages, liens, court stays, attachments, and other encumbrances.",
      "Show lender name, account reference, amount outstanding, and closure status.",
      "Flag properties with pending dues or incomplete release documents.",
    ],
  },
  {
    title: "Income and usage",
    items: [
      "Add lease, rent, crop income, or commercial income details where applicable.",
      "Capture income source, period, and supporting document references.",
      "Mark mismatch cases when declared income does not align with recorded usage.",
    ],
  },
  {
    title: "Operational improvements",
    items: [
      "Create document verification status for sale deed, patta, EC, tax receipt, and survey map.",
      "Add audit trail for every record change with timestamp and user identity.",
      "Provide search, filters, export, and alerts for high-risk or expiring records.",
    ],
  },
];

const workflow = [
  "Upload or sync ownership records",
  "Link supporting documents and execution dates",
  "Capture encumbrances and income-related entries",
  "Generate a stakeholder summary and risk flag",
];

export default function StakeholderInsightsPage() {
  return (
    <PrototypeShell
      heading="Stakeholder Information Layer"
      subheading="A dedicated view for land ownership, executed dates, income details, and encumbrances so stakeholders can assess a property with less manual checking."
    >
      <div className="grid gap-6">
        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-white/45">Refined problem statement</p>
            <p className="mt-3 text-lg leading-8 text-white/85">
              Provide stakeholders with a single, verified view of land ownership history, dates executed,
              income details, and any encumbrances on the property so they can make faster and safer decisions.
            </p>
          </div>
          <div className="rounded-2xl border border-[#f7d8b0]/20 bg-[#20170f] p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[#f7d8b0]/70">Suggested workflow</p>
            <div className="mt-4 space-y-3">
              {workflow.map((step, index) => (
                <div key={step} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#f7d8b0]/30 bg-white/5 text-sm font-semibold text-[#f7d8b0]">
                    {index + 1}
                  </div>
                  <p className="text-sm text-white/80">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {improvementSections.map((section) => (
            <article key={section.title} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <h2 className="text-base font-semibold text-white">{section.title}</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-white/70">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#f7d8b0] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h2 className="text-base font-semibold text-white">What this adds to the project</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[
              "Better due diligence for buyers, banks, and officials.",
              "Clear visibility into ownership change dates and supporting documents.",
              "A cleaner path to surface risks before a transaction is approved.",
            ].map((item) => (
              <div key={item} className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>
    </PrototypeShell>
  );
}
