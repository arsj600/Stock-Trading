
import React, { useState } from "react";

export function Support() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Support Request Sent:", form); // 👉 Later connect backend
    setSubmitted(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      <h1 className="text-3xl font-bold mb-4">Support Center</h1>
      <p className="text-gray-600">
        Welcome to our support center. Here you’ll find answers to common
        questions and ways to contact us if you need help.
      </p>

      {/* Contact Options */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="p-4 border rounded shadow-sm text-center">
          <h3 className="font-semibold mb-1">Email Us</h3>
          <p className="text-sm text-gray-600">support@wallst.com</p>
        </div>
        <div className="p-4 border rounded shadow-sm text-center">
          <h3 className="font-semibold mb-1">Call Us</h3>
          <p className="text-sm text-gray-600">+91 6262626268</p>
        </div>
        <div className="p-4 border rounded shadow-sm text-center">
          <h3 className="font-semibold mb-1">Live Chat</h3>
          <p className="text-sm text-gray-600">Mon–Fri, 9 AM–6 PM</p>
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Frequently Asked Questions</h2>
        <ul className="space-y-3">
          <li className="border p-3 rounded">
            <p className="font-medium">How do I reset my password?</p>
            <p className="text-gray-600 text-sm">
              Go to Settings → Security → Reset Password.
            </p>
          </li>
          <li className="border p-3 rounded">
            <p className="font-medium">Why can’t I see real-time stock updates?</p>
            <p className="text-gray-600 text-sm">
              Ensure you have a stable internet connection. Live data is powered
              by WebSocket updates.
            </p>
          </li>
          <li className="border p-3 rounded">
            <p className="font-medium">Can I use this app for real trading?</p>
            <p className="text-gray-600 text-sm">
              This platform is a demo/training app. For real trading, connect
              with your broker or financial advisor.
            </p>
          </li>
          <li className="border p-3 rounded">
            <p className="font-medium">How do I delete my account?</p>
            <p className="text-gray-600 text-sm">
              Contact support through the form below with your registered email.
            </p>
          </li>
        </ul>
      </section>

      {/* Knowledge Base / Guides */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Guides & Resources</h2>
        <ul className="list-disc pl-6 text-blue-600 space-y-1">
          <li>
            <a href="#">Beginner’s Guide to Trading</a>
          </li>
          <li>
            <a href="#">Using the Watchlist</a>
          </li>
          <li>
            <a href="#">Understanding Market Data</a>
          </li>
          <li>
            <a href="#">Privacy & Security Policy</a>
          </li>
        </ul>
      </section>

      {/* Contact Form */}
      <section className="border p-6 rounded shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Contact Support</h2>
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your Email"
              className="w-full border p-2 rounded"
              required
            />
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Describe your issue..."
              rows="4"
              className="w-full border p-2 rounded"
              required
            ></textarea>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Submit
            </button>
          </form>
        ) : (
          <p className="text-green-600 font-semibold">
            ✅ Thank you! Your request has been submitted. We will reply within
            24 hours.
          </p>
        )}
      </section>

      {/* Support Hours */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Support Hours</h2>
        <p className="text-gray-600">Monday – Friday: 9:00 AM – 6:00 PM IST</p>
        <p className="text-gray-600">Average Response Time: Within 24 hours</p>
      </section>
    </div>
  );
}
