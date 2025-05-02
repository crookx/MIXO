export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Privacy Policy</h1>
      <div className="prose prose-lg max-w-4xl mx-auto text-muted-foreground"> {/* Using Tailwind typography plugin for basic styling */}
        <p className="text-sm">Last Updated: {new Date().toLocaleDateString()}</p>

        <h2>1. Introduction</h2>
        <p>
          Welcome to ChronoThreads. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us at privacy@chronothreads.xyz.
        </p>

        <h2>2. Information We Collect</h2>
        <p>
          We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, when you participate in activities on the website or otherwise when you contact us.
        </p>
        <p>
          The personal information that we collect depends on the context of your interactions with us and the website, the choices you make and the products and features you use. The personal information we collect may include the following: Name, Email Address, Mailing Address, Phone Number, Payment Information, etc.
        </p>

        <h2>3. How We Use Your Information</h2>
        <p>
          We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations. These purposes include:
        </p>
        <ul>
          <li>To facilitate account creation and logon process.</li>
          <li>To post testimonials.</li>
          <li>Request feedback.</li>
          <li>To enable user-to-user communications.</li>
          <li>To manage user accounts.</li>
          <li>To send administrative information to you.</li>
          <li>To protect our Services.</li>
          <li>To enforce our terms, conditions and policies for business purposes, to comply with legal and regulatory requirements or in connection with our contract.</li>
          <li>To respond to legal requests and prevent harm.</li>
           <li>Fulfill and manage your orders.</li>
           <li>To deliver and facilitate delivery of services to the user.</li>
           <li>To respond to user inquiries/offer support to users.</li>
            <li>To send you marketing and promotional communications.</li>
           <li>Deliver targeted advertising to you.</li>
        </ul>


        <h2>4. Will Your Information Be Shared With Anyone?</h2>
        <p>
          We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We may process or share your data that we hold based on the following legal basis: Consent, Legitimate Interests, Performance of a Contract, Legal Obligations, Vital Interests.
        </p>

        <h2>5. How Long Do We Keep Your Information?</h2>
        <p>
          We keep your information for as long as necessary to fulfill the purposes outlined in this privacy notice unless otherwise required by law.
        </p>

         <h2>6. How Do We Keep Your Information Safe?</h2>
        <p>
            We aim to protect your personal information through a system of organizational and technical security measures. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
        </p>


        <h2>7. Do We Collect Information From Minors?</h2>
        <p>
          We do not knowingly solicit data from or market to children under 18 years of age.
        </p>

        <h2>8. What Are Your Privacy Rights?</h2>
        <p>
          In some regions (like the EEA, UK, and Canada), you have rights that allow you greater access to and control over your personal information. You may review, change, or terminate your account at any time.
        </p>

        <h2>9. Controls for Do-Not-Track Features</h2>
        <p>
            Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track (“DNT”) feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage no uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online.
        </p>


        <h2>10. Updates to This Notice</h2>
        <p>
          We may update this privacy notice from time to time. The updated version will be indicated by an updated "Revised" date and the updated version will be effective as soon as it is accessible.
        </p>

         <h2>11. How Can You Contact Us About This Notice?</h2>
        <p>
           If you have questions or comments about this notice, you may email us at privacy@chronothreads.xyz or by post to:
        </p>
         <p>
            ChronoThreads<br/>
            Attn: Privacy Officer<br/>
            123 Cyberpunk Ave<br/>
            Neo-Sector 7, CA 90210<br/>
            United States
        </p>
      </div>
    </div>
  );
}
