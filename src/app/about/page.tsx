import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">About ChronoThreads</h1>
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div>
           <Image
            src="https://picsum.photos/seed/aboutus/800/600"
            alt="Futuristic Fashion Concept"
            width={800}
            height={600}
            className="rounded-lg shadow-lg object-cover w-full"
            data-ai-hint="futuristic abstract technology"
          />
        </div>
        <div className="space-y-4 text-lg text-muted-foreground">
          <p>
            Welcome to ChronoThreads, where fashion meets the future. We believe that clothing is more than just fabric; it's an extension of identity, technology, and the world to come.
          </p>
          <p>
            Founded on the principles of innovation and style, ChronoThreads merges cutting-edge materials with timeless design aesthetics. Our collections are crafted for the forward-thinkers, the pioneers, and those who dare to envision tomorrow's possibilities today.
          </p>
           <p>
             We are committed to sustainability and ethical production, utilizing advanced manufacturing techniques and eco-conscious materials to minimize our footprint on the planet we're shaping.
          </p>
          <p>
            Join us on this journey into the future of fashion. Explore our collections and wear the world of tomorrow.
          </p>
        </div>
      </div>
    </div>
  );
}
