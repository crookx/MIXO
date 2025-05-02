export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Terms of Service</h1>
      <div className="prose prose-lg max-w-4xl mx-auto text-muted-foreground"> {/* Using Tailwind typography plugin */}
        <p className="text-sm">Last Updated: {new Date().toLocaleDateString()}</p>

        <h2>1. Agreement to Terms</h2>
        <p>
          By accessing or using the ChronoThreads website (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, then you may not access the Service.
        </p>

        <h2>2. Accounts</h2>
        <p>
          When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
        </p>

        <h2>3. Purchases</h2>
        <p>
          If you wish to purchase any product or service made available through the Service ("Purchase"), you may be asked to supply certain information relevant to your Purchase including, without limitation, your credit card number, the expiration date of your credit card, your billing address, and your shipping information. You represent and warrant that: (i) you have the legal right to use any credit card(s) or other payment method(s) in connection with any Purchase; and that (ii) the information you supply to us is true, correct and complete.
        </p>
         <p>
            We reserve the right to refuse or cancel your order at any time for certain reasons including but not limited to: product or service availability, errors in the description or price of the product or service, error in your order or other reasons.
        </p>


        <h2>4. Intellectual Property</h2>
        <p>
          The Service and its original content, features and functionality are and will remain the exclusive property of ChronoThreads and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of ChronoThreads.
        </p>

        <h2>5. Links To Other Web Sites</h2>
        <p>
          Our Service may contain links to third-party web sites or services that are not owned or controlled by ChronoThreads. ChronoThreads has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services.
        </p>

        <h2>6. Termination</h2>
        <p>
          We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
        </p>

        <h2>7. Limitation Of Liability</h2>
        <p>
          In no event shall ChronoThreads, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
        </p>


         <h2>8. Disclaimer</h2>
        <p>
           Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.
        </p>


        <h2>9. Governing Law</h2>
        <p>
          These Terms shall be governed and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions.
        </p>

        <h2>10. Changes</h2>
        <p>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
        </p>

        <h2>11. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at legal@chronothreads.xyz.
        </p>
      </div>
    </div>
  );
}
