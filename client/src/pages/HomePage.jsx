import Layout from '../components/common/Layout';
import SearchForm from '../components/home/SearchForm';
import { Shield, Clock, CreditCard, Headphones, Star, Bus } from 'lucide-react';

const features = [
  { icon: <Shield size={24} />, title: 'Safe & Secure', desc: 'SSL encrypted payments and secure data handling' },
  { icon: <Clock size={24} />, title: 'Real-time Updates', desc: 'Live seat availability and bus tracking' },
  { icon: <CreditCard size={24} />, title: 'Easy Payments', desc: 'Pay via Stripe, Razorpay, UPI and more' },
  { icon: <Headphones size={24} />, title: '24/7 Support', desc: 'Round-the-clock customer assistance' },
];

const popularRoutes = [
  { from: 'Delhi', to: 'Chandigarh', price: 350, duration: '4h', buses: 12 },
  { from: 'Mumbai', to: 'Pune', price: 250, duration: '3h', buses: 18 },
  { from: 'Bangalore', to: 'Hyderabad', price: 750, duration: '10h', buses: 8 },
  { from: 'Chennai', to: 'Coimbatore', price: 550, duration: '6h', buses: 10 },
  { from: 'Delhi', to: 'Agra', price: 300, duration: '3.5h', buses: 15 },
  { from: 'Kolkata', to: 'Siliguri', price: 650, duration: '8h', buses: 7 },
];

const testimonials = [
  { name: 'Rajesh Kumar', review: 'Super easy to book! Got my ticket in under 2 minutes. The seat selection UI is amazing.', rating: 5, city: 'Delhi' },
  { name: 'Priya Sharma', review: 'Finally a bus booking app that actually works well on mobile. Love the instant confirmation.', rating: 5, city: 'Mumbai' },
  { name: 'Arjun Singh', review: 'The cancellation process was hassle-free. Refund came quickly. Very trustworthy platform.', rating: 4, city: 'Chandigarh' },
];

export default function HomePage() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-red-800 text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-orange-300 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <Bus size={15} /> India's Fastest Bus Booking Platform
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold mb-4 leading-tight">
              Book Bus Tickets <br />
              <span className="text-yellow-300">Instantly & Easily</span>
            </h1>
            <p className="text-lg text-white/80 max-w-xl mx-auto">
              Choose from 500+ routes, select your favourite seat, and travel comfortably across India.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <SearchForm />
          </div>
          <div className="flex items-center justify-center gap-8 mt-8 text-white/70 text-sm">
            {['500+ Routes', '1M+ Happy Travellers', 'Instant E-Ticket'].map(t => (
              <div key={t} className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-300" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-display font-bold text-center text-gray-900 mb-2">Why Choose BusBook?</h2>
          <p className="text-gray-500 text-center mb-10">Trusted by millions of travellers across India</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon, title, desc }) => (
              <div key={title} className="text-center p-6 rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all group">
                <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-100 transition-colors">
                  {icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">Popular Routes</h2>
          <p className="text-gray-500 mb-8">Most booked bus routes in India</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularRoutes.map(({ from, to, price, duration, buses }) => (
              <div key={`${from}-${to}`} className="card p-5 hover:shadow-md transition-shadow cursor-pointer group">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{from} → {to}</p>
                      <p className="text-xs text-gray-500">{duration} · {buses} buses daily</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary-600">₹{price}</p>
                    <p className="text-xs text-gray-400">onwards</p>
                  </div>
                </div>
                <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full" style={{ width: '60%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-display font-bold text-center text-gray-900 mb-2">What Travellers Say</h2>
          <p className="text-gray-500 text-center mb-10">Real reviews from real passengers</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ name, review, rating, city }) => (
              <div key={name} className="card p-6">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} size={15} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm italic mb-4">"{review}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 font-bold text-sm flex items-center justify-center">
                    {name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-800">{name}</p>
                    <p className="text-xs text-gray-400">{city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-gradient-to-r from-primary-600 to-red-700 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-display font-bold mb-3">Ready to Travel?</h2>
          <p className="text-white/80 mb-6">Book your bus ticket now and enjoy a seamless journey across India.</p>
          <a href="/search" className="inline-block bg-white text-primary-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors shadow-lg">
            Book Now — It's Free
          </a>
        </div>
      </section>
    </Layout>
  );
}
