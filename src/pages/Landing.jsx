import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import PublicIcon from '@mui/icons-material/Public'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import MapIcon from '@mui/icons-material/Map'
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import GroupIcon from '@mui/icons-material/Group'
import OfflineBoltIcon from '@mui/icons-material/OfflineBolt'
import SecurityIcon from '@mui/icons-material/Security'

const features = [
  {
    icon: <PublicIcon className="text-blue-400" style={{ fontSize: 36 }} />, title: 'Localized Alerts',
    desc: 'Instant flood warnings for your street, community, or LGA. Stay ahead of danger.'
  },
  {
    icon: <WarningAmberIcon className="text-yellow-400" style={{ fontSize: 36 }} />, title: 'AI Flood Prediction',
    desc: '24hr, 48hr, and 7-day risk scoring using real rainfall and water level data.'
  },
  {
    icon: <MapIcon className="text-green-400" style={{ fontSize: 36 }} />, title: 'Community Map',
    desc: 'See high-risk zones, plan evacuation routes, and help neighbors.'
  },
  {
    icon: <NotificationsActiveIcon className="text-pink-400" style={{ fontSize: 36 }} />, title: 'Multi-channel Alerts',
    desc: 'Get notified via SMS, WhatsApp, push, and voice — even for those who cannot read.'
  },
  {
    icon: <GroupIcon className="text-purple-400" style={{ fontSize: 36 }} />, title: 'Community Dashboard',
    desc: 'Local authorities and emergency teams can monitor and broadcast alerts to all.'
  },
  {
    icon: <OfflineBoltIcon className="text-orange-400" style={{ fontSize: 36 }} />, title: 'Offline Mode',
    desc: 'Basic warnings work even with poor network. Never be left in the dark.'
  },
  {
    icon: <SecurityIcon className="text-teal-400" style={{ fontSize: 36 }} />, title: 'Emergency Contact',
    desc: 'Quickly notify neighbors, local response teams, and emergency numbers.'
  },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 relative overflow-hidden">
      {/* CSS Animated Water Waves Background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-32 md:h-48 lg:h-64 overflow-hidden">
          <div className="w-full h-full animate-wave1" style={{background: 'linear-gradient(180deg, #2563eb33 60%, transparent 100%)', opacity: 0.5}}></div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-24 md:h-32 lg:h-40 overflow-hidden">
          <div className="w-full h-full animate-wave2" style={{background: 'linear-gradient(180deg, #2563eb22 60%, transparent 100%)', opacity: 0.4}}></div>
        </div>
      </div>
      {/* Tailwind custom keyframes (add to your global CSS):
      @keyframes wave1 { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      @keyframes wave2 { 0% { transform: translateX(0); } 100% { transform: translateX(50%); } }
      .animate-wave1 { animation: wave1 12s linear infinite; }
      .animate-wave2 { animation: wave2 16s linear infinite; }
      */}

      {/* Hero Section */}
      <header className="pt-12 pb-8 px-4 text-center bg-gradient-to-b from-blue-900/60 to-gray-950 border-b border-blue-900">
        <img src="/images/logo.png" alt="FloodSense Logo" className="mx-auto mb-6 w-24 h-24 md:w-32 md:h-32 rounded-full shadow-lg border-4 border-blue-500 object-contain" />
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-blue-400 drop-shadow">FloodSense: Predict, Prepare, Stay Safe.</h1>
        <p className="text-lg md:text-2xl max-w-2xl mx-auto mb-6 text-gray-300">
          FloodSense helps individuals and communities in flood-prone areas stay safe by delivering real-time alerts, AI-powered flood predictions, and emergency guidance — all from your phone.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center mt-6">
          <RouterLink to="/dashboard">
            <button className="bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 text-white font-semibold py-3 px-8 rounded-lg text-lg shadow-lg transition">Get Started</button>
          </RouterLink>
          <RouterLink to="/dashboard">
            <button className="bg-green-500 hover:bg-green-600 focus:ring-2 focus:ring-green-400 text-white font-semibold py-3 px-8 rounded-lg text-lg shadow-lg transition">Check Your Flood Risk</button>
          </RouterLink>
          <a href="#community">
            <button className="bg-gray-800 hover:bg-gray-700 focus:ring-2 focus:ring-gray-600 text-gray-100 font-semibold py-3 px-8 rounded-lg text-lg border border-gray-700 transition">Join the Community</button>
          </a>
        </div>
      </header>

      {/* Short Intro Section */}
      <section className="py-8 px-4 max-w-3xl mx-auto text-center bg-gray-900/70 rounded-xl shadow mb-8">
        <h2 className="text-2xl font-bold mb-4 text-blue-300">What is FloodSense?</h2>
        <p className="text-lg text-gray-300">
          FloodSense is an AI-driven flood monitoring and early warning system built to help people living in flood-prone areas stay informed before danger strikes. We combine weather data, water-level monitoring, and machine learning to detect potential floods and notify you instantly.
        </p>
      </section>

      {/* Problem Statement */}
      <section className="py-8 px-4 max-w-4xl mx-auto bg-gray-900/70 rounded-xl shadow mb-8">
        <h2 className="text-2xl font-bold mb-4 text-red-400">Why FloodSense?</h2>
        <p className="text-gray-300 mb-4">
          Flooding destroys thousands of homes every year — not because people don’t care, but because they don’t get warned early enough. Many communities lack access to:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-200">
          <li>Early warning systems</li>
          <li>Real-time weather/flood data</li>
          <li>Localized risk alerts</li>
          <li>Emergency guidance</li>
          <li>Reliable communication channels</li>
        </ul>
        <p className="mt-4 text-gray-400">This leads to avoidable loss of life, property damage, displacement, and panic.</p>
      </section>

      {/* Key Features */}
      <section id="features" className="py-12 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-blue-300">How FloodSense Protects You</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="bg-gray-900 rounded-xl p-6 shadow-lg flex flex-col items-start h-full border border-gray-800 hover:shadow-blue-400/30 transition">
              <div className="mb-3">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-blue-200">{f.title}</h3>
              <p className="text-gray-300 text-base">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-8 px-4 max-w-4xl mx-auto bg-gray-900/70 rounded-xl shadow mb-8 border border-gray-800">
        <h2 className="text-2xl font-bold mb-4 text-green-300">Why You'll Love FloodSense</h2>
        <ul className="list-disc list-inside space-y-3 text-lg text-gray-200">
          <li>Stay informed 24/7</li>
          <li>Protect your family from sudden floods</li>
          <li>Reduce property damage</li>
          <li>Receive trusted alerts from verified sources</li>
          <li>No technical skills required</li>
          <li>Works smoothly even in rural communities</li>
          <li>Built for both individuals and community leaders</li>
        </ul>
      </section>

      {/* Who We Built This For */}
      <section id="community" className="py-8 px-4 max-w-4xl mx-auto bg-gray-900/70 rounded-xl shadow mb-8">
        <h2 className="text-2xl font-bold mb-4 text-purple-300">Who Is FloodSense For?</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-200">
          <span>Families in flood-prone communities</span>
          <span>Residents near rivers/waterways</span>
          <span>Farmers</span>
          <span>Landlords & tenants</span>
          <span>Schools & institutions</span>
          <span>Emergency responders</span>
          <span>Community leaders</span>
          <span>Government agencies</span>
        </div>
      </section>

      
      {/* How It Works */}
      <section className="py-8 px-4 max-w-4xl mx-auto bg-gray-900/70 rounded-xl shadow mb-8">
        <h2 className="text-2xl font-bold mb-4 text-blue-300">How It Works</h2>
        <ol className="list-decimal list-inside space-y-3 text-lg text-gray-200">
          <li>Sign Up & Enter Your Location</li>
          <li>AI Monitors Flood Risk</li>
          <li>Receive Alerts Instantly</li>
          <li>Take Action with Safety Steps</li>
          <li>Stay Updated Until Safe</li>
        </ol>
      </section>

      {/* Dashboard Preview */}
      <section className="py-8 px-4 max-w-4xl mx-auto text-center bg-gray-900/70 rounded-xl shadow mb-8">
        <h2 className="text-2xl font-bold mb-4 text-blue-300">Real-Time Dashboard Preview</h2>
        <p className="text-gray-300 mb-4">See your current flood risk, 24-hour prediction, 3–7 day forecast, map of high-risk zones, water-level history, and emergency contact button — all in one place.</p>
        <div className="bg-gray-900 rounded-xl p-3 shadow-lg inline-block border border-gray-800">
          <img
            src="/images/dashboardScreenshot.png"
            alt="FloodSense Dashboard preview"
            className="max-w-full h-auto rounded-lg border border-gray-800 object-contain"
          />
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-8 px-4 max-w-4xl mx-auto bg-gray-900/70 rounded-xl shadow mb-8">
        <h2 className="text-2xl font-bold mb-4 text-blue-300">Our Technology</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-200">
          <li>AI models trained on historical flood data</li>
          <li>Weather APIs for real-time rainfall and storm updates</li>
          <li>Water level sensors (optional)</li>
          <li>Big data analysis to score flood risk</li>
          <li>Smart notification system for SMS, WhatsApp & app alerts</li>
        </ul>
        <p className="mt-4 text-gray-400">We turn complex data into simple, understandable alerts that keep you safe.</p>
      </section>

      {/* Safety Tips Preview */}
      <section className="py-8 px-4 max-w-4xl mx-auto bg-gray-900/70 rounded-xl shadow mb-8">
        <h2 className="text-2xl font-bold mb-4 text-yellow-300">Quick Safety Tips</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-200">
          <li>Keep your important documents in waterproof bags</li>
          <li>Turn off electrical appliances during heavy rain</li>
          <li>Know your nearest safe location</li>
          <li>Avoid walking or driving through flood water</li>
          <li>Store emergency numbers</li>
        </ul>
        <RouterLink to="/dashboard">
          <button className="mt-4 bg-yellow-500 hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-400 text-gray-900 font-semibold py-2 px-6 rounded-lg text-lg shadow transition">See Full Guide</button>
        </RouterLink>
      </section>

      {/* Testimonials / Community Voices */}
      <section className="py-8 px-4 max-w-4xl mx-auto bg-gray-900/70 rounded-xl shadow mb-8">
        <h2 className="text-2xl font-bold mb-4 text-blue-300">Community Voices</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900 rounded-xl p-6 shadow border border-gray-800">
            <p className="text-lg text-gray-200 mb-2">“FloodSense helped my family avoid serious damage during a heavy rainfall.”</p>
            <span className="text-gray-400">— User from Imo State</span>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 shadow border border-gray-800">
            <p className="text-lg text-gray-200 mb-2">“This platform is exactly what we need in our community.”</p>
            <span className="text-gray-400">— Local Leader</span>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8 px-4 max-w-4xl mx-auto bg-gray-900/70 rounded-xl shadow mb-8 border border-gray-800">
        <h2 className="text-2xl font-bold mb-4 text-blue-300">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <p className="font-semibold text-gray-200">Is FloodSense free?</p>
            <p className="text-gray-400">Yes, the basic version is free for individuals.</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <p className="font-semibold text-gray-200">How accurate are the predictions?</p>
            <p className="text-gray-400">Our system uses live weather data and machine learning to give reliable risk assessments.</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <p className="font-semibold text-gray-200">Does it work without internet?</p>
            <p className="text-gray-400">Yes, key features still show on low or poor network.</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <p className="font-semibold text-gray-200">Do I need a smartphone?</p>
            <p className="text-gray-400">A simple Android phone is enough.</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <p className="font-semibold text-gray-200">Can my community sign up as a group?</p>
            <p className="text-gray-400">Yes, we support community dashboards.</p>
          </div>
        </div>
      </section>

      {/* Footer CTA & Links */}
      <footer className="py-12 px-4 bg-gray-900 text-center text-gray-400">
        <img src="/images/logo.png" alt="FloodSense Logo" className="mx-auto mb-4 w-16 h-16 rounded-full shadow border-2 border-blue-500 object-contain" />
        <h2 className="text-xl font-bold mb-4 text-blue-300">Protect Your Home Today</h2>
        <p className="mb-6">Join thousands of people preparing smarter for the rainy season.</p>
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
          <RouterLink to="/dashboard">
            <button className="bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 text-white font-semibold py-3 px-8 rounded-lg text-lg shadow-lg transition">Create an Account</button>
          </RouterLink>
          <RouterLink to="/dashboard">
            <button className="bg-green-500 hover:bg-green-600 focus:ring-2 focus:ring-green-400 text-white font-semibold py-3 px-8 rounded-lg text-lg shadow-lg transition">Check My Flood Risk</button>
          </RouterLink>
          <a href="#features">
            <button className="bg-gray-800 hover:bg-gray-700 focus:ring-2 focus:ring-gray-600 text-gray-100 font-semibold py-3 px-8 rounded-lg text-lg border border-gray-700 transition">Learn More</button>
          </a>
        </div>
        <div className="flex flex-wrap justify-center gap-6 mb-4 text-sm">
          <a href="#" className="hover:underline">About FloodSense</a>
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms & Conditions</a>
          <a href="#" className="hover:underline">Contact</a>
          <a href="#" className="hover:underline">Twitter</a>
          <a href="#" className="hover:underline">Facebook</a>
        </div>
        <div className="text-xs mt-2">Built by Team FloodSense for the 3MTT Hackathon</div>
        <div className="text-xs">&copy; {new Date().getFullYear()} FloodSense.</div>
      </footer>
    </div>
  )
}
