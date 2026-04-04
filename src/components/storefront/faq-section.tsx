import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    q: "Are your products 100% organic?",
    a: "Yes. All of our sources are thoroughly vetted and strictly organically grown, without the use of chemical pesticides or synthetic fertilizers. We provide documentation on all product packaging.",
  },
  {
    q: "How long does shipping take?",
    a: "Within Cameroon: 2–4 business days. West & Central Africa: 5–8 business days. International orders: 7–14 business days depending on customs processing.",
  },
  {
    q: "Consultation and Safety",
    a: "While our herbal clinical extracts are natural and safe, we always recommend consulting with your primary healthcare provider before adding any new supplements, especially if you are on prescribed medications.",
  },
  {
    q: "How should I store the botanical extracts?",
    a: "Store in a cool, dark place away from direct sunlight. Once opened, certain formulations may require refrigeration. Refer to the label instructions on your product's packaging.",
  },
  {
    q: "Can I combine different wellness bundles?",
    a: "Yes, many of our formulations work synergistically. To ensure safety and efficacy, consult with our support team or your healthcare provider before combining advanced protocols.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept Visa, Mastercard, and AMEX globally, as well as MTN Mobile Money and Orange Money for regional orders across Africa.",
  },
];

export function FaqSection() {
  return (
    <section className="px-4 sm:px-6 py-16 lg:px-12 bg-white">
      <div className="container max-w-3xl mx-auto">
        <div className="text-center mb-10 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#f2c94c]">
            Support Center
          </p>
          <h2 className="text-2xl font-black text-primary tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className={
                i === FAQS.length - 1
                  ? "border-none"
                  : "border-b border-black/6"
              }
            >
              <AccordionTrigger className="text-left text-sm font-bold text-foreground hover:text-primary hover:no-underline transition-colors py-4">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed pb-4 font-medium">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
