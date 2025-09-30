import React from "react";

export const About = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-4">About Us</h1>
      <p className="text-gray-700">
        Welcome to our Stock Trading App! We are passionate about making trading
        and investing simple, transparent, and accessible for everyone. Whether
        you are a beginner learning the basics or an experienced trader, our
        platform is designed to provide you with the tools you need to make
        better financial decisions.
      </p>

      <section>
        <h2 className="text-xl font-semibold mb-2">Our Mission</h2>
        <p className="text-gray-700">
          Our mission is to empower individuals to take control of their
          financial journey by providing real-time market insights, easy-to-use
          tools, and a safe environment to practice and grow their trading
          skills.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">What We Offer</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Real-time stock market updates</li>
          <li>Interactive charts and analysis tools</li>
          <li>Portfolio management features</li>
          <li>Practice trading in a risk-free environment</li>
          <li>Educational resources for beginners</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Our Values</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            <span className="font-medium">Transparency:</span> Clear and honest
            information to build trust.
          </li>
          <li>
            <span className="font-medium">Innovation:</span> Continuously
            improving features to meet user needs.
          </li>
          <li>
            <span className="font-medium">Accessibility:</span> Making trading
            tools available to everyone, regardless of experience.
          </li>
          <li>
            <span className="font-medium">Support:</span> Dedicated to helping
            our users succeed in their trading journey.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Our Vision</h2>
        <p className="text-gray-700">
          We envision a future where financial literacy and trading knowledge
          are widespread, enabling people to achieve their financial goals with
          confidence. Our platform is a step towards making that vision a
          reality.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
        <p className="text-gray-700">
          Have questions or feedback? Reach out to us at{" "}
          <span className="text-blue-600">support@wallst.com</span>.
        </p>
      </section>
    </div>
  );
};
