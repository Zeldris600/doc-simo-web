import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FaqSection() {
  return (
    <section className="px-6 py-24 lg:px-12 bg-white">
      <div className="container max-w-5xl mx-auto">
        <div className="text-center mb-16 w-full space-y-4">
          <p className="text-xs font-bold uppercase text-[#f2c94c] tracking-tight">
            Support Center
          </p>
          <h2 className="text-3xl font-black text-black sm:text-4xl tracking-tight">
            Inquiries & Support
          </h2>
        </div>

        <div className="w-full">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem
              value="item-1"
              className="border-b border-border py-4"
            >
              <AccordionTrigger className="text-left text-xl font-bold text-foreground hover:text-primary hover:no-underline transition-colors">
                Are your products 100% organic?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed pt-4 font-medium">
                Yes. All of our sources are thoroughly vetted and strictly
                organically grown, without the use of chemical pesticides or
                synthetic fertilizers. We provide certifications on all product
                packaging.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="item-2"
              className="border-b border-border py-4"
            >
              <AccordionTrigger className="text-left text-xl font-bold text-foreground hover:text-primary hover:no-underline transition-colors">
                How long does shipping take?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed pt-4 font-medium">
                Standard free shipping usually takes 3-5 business days
                domestically. If you are ordering internationally, please allow
                7-14 business days depending on customs processing in your area.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border-none py-4">
              <AccordionTrigger className="text-left text-xl font-bold text-foreground hover:text-primary hover:no-underline transition-colors">
                Consultation and Safety
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed pt-4 font-medium">
                While our herbal clinical extracts are natural and safe, we
                always recommend consulting with your primary healthcare
                provider before adding any new supplements to your routine,
                especially if you are on prescribed medications.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
}
