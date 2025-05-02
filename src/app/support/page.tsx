import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Mail, Phone, MapPin } from 'lucide-react';

export default function SupportPage() {
  const faqs = [
    { id: 'faq1', question: 'How do I track my order?', answer: 'Once your order ships, you will receive a confirmation email with a tracking number. You can use this number on the carrier\'s website to track your package.' },
    { id: 'faq2', question: 'What is your return policy?', answer: 'We accept returns within 30 days of delivery for items in new, unused condition with original tags attached. Please visit our Returns Portal to initiate a return.' },
    { id: 'faq3', question: 'Do you ship internationally?', answer: 'Yes, we ship to most countries worldwide. Shipping costs and delivery times vary depending on the destination. Duties and taxes may apply upon arrival.' },
    { id: 'faq4', question: 'How do I care for my ChronoThreads gear?', answer: 'Care instructions vary by product. Please refer to the specific care label on your garment. Generally, we recommend gentle cycles and avoiding high heat.' },
     { id: 'faq5', question: 'What payment methods do you accept?', answer: 'We accept major credit cards (Visa, MasterCard, American Express), PayPal, and other secure payment methods available at checkout.' },
  ];

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Customer Support</h1>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        {/* Contact Information */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <div className="space-y-4 text-muted-foreground">
             <p className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <span>support@chronothreads.xyz</span>
            </p>
             <p className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <span>+1 (555) FUTURE-0 (Mon-Fri, 9am-5pm PST)</span>
            </p>
            <p className="flex items-start gap-3">
                 <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                 <span>ChronoThreads HQ<br/>123 Cyberpunk Ave<br/>Neo-Sector 7, CA 90210</span>
            </p>
             <p className="mt-6">
                For specific inquiries, please use the contact form below or reach out via email for the quickest response.
            </p>
             {/* TODO: Add a contact form component here */}
          </div>
        </div>

        {/* FAQs */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map(faq => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-left hover:text-accent">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
