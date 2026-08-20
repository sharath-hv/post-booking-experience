import {
  QuoteCtaFooter,
  QuoteDetails,
  QuoteFlowProvider,
  QuoteHero,
} from "@/components/organisms/quote/QuoteScreen";

export default function QuotePage() {
  return (
    <QuoteFlowProvider>
      <QuoteHero />
      <QuoteDetails />
      <QuoteCtaFooter />
    </QuoteFlowProvider>
  );
}
