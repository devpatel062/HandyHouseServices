import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const accentGradient = 'linear-gradient(135deg, #e0e7ff 0%, #2563eb 100%)';

export default function Footer() {
  return (
    <footer className="w-full py-10 px-4 bg-transparent">
      <div className="max-w-5xl mx-auto rounded-3xl border border-blue-100 bg-white/70 backdrop-blur shadow-xl p-8 grid grid-cols-1 md:grid-cols-3 gap-10" style={{ borderImage: `${accentGradient} 1` }}>
        <div>
          <h2 className="text-2xl font-extrabold mb-3 text-transparent bg-clip-text" style={{ backgroundImage: accentGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>HouseHold Services</h2>
          <p className="text-sm text-gray-700">Your trusted partner for spotless homes and offices. We deliver exceptional cleaning solutions tailored to your needs.</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3 text-blue-600">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/aboutUs" className="hover:underline text-gray-700 hover:text-blue-600 transition">About Us</Link></li>
            <li><Link to="/RepairServices" className="hover:underline text-gray-700 hover:text-blue-600 transition">Our Services</Link></li>
            <li><Link to="/Faq" className="hover:underline text-gray-700 hover:text-blue-600 transition">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3 text-blue-600">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="rounded-full p-2 bg-white/80 shadow hover:bg-blue-50 transition">
              <FaFacebookF size={22} className="text-blue-600 hover:text-blue-700 transition" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="rounded-full p-2 bg-white/80 shadow hover:bg-blue-50 transition">
              <FaInstagram size={22} className="text-blue-500 hover:text-blue-700 transition" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="rounded-full p-2 bg-white/80 shadow hover:bg-blue-50 transition">
              <FaTwitter size={22} className="text-blue-400 hover:text-blue-600 transition" />
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto text-center text-xs text-gray-500 mt-8 pt-4 border-t border-blue-100">
        &copy; {new Date().getFullYear()} HouseHold Services. All Rights Reserved.
      </div>
    </footer>
  );
}