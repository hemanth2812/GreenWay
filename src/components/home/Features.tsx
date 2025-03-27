
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Feature items
const features = [
  {
    id: 1,
    name: 'AI Travel Planner',
    description: 'Personalized eco-friendly itineraries prioritizing public transport, walking, and cycling with intelligent routing.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
      </svg>
    ),
    color: 'bg-green-50 text-green-700',
    image: 'https://images.unsplash.com/photo-1596003906949-67221c37965c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    name: 'Green Suggestions',
    description: 'Discover sustainable venues and transportation options with real-time data on air quality, crowd levels, and more.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    color: 'bg-blue-50 text-blue-700',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    name: 'Green Score & Rewards',
    description: 'Track your eco-friendly choices and earn rewards while reducing your carbon footprint with our gamified system.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
      </svg>
    ),
    color: 'bg-teal-50 text-teal-700',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    name: 'Smart Alerts',
    description: 'Receive real-time eco-tips, air quality updates, and AI challenges to help you make better travel decisions.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
      </svg>
    ),
    color: 'bg-purple-50 text-purple-700',
    image: 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
];

const Features = () => {
  const [activeFeature, setActiveFeature] = useState(features[0].id);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  // Auto rotate featured item
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((current) => {
        const nextIndex = features.findIndex(f => f.id === current) + 1;
        return nextIndex < features.length ? features[nextIndex].id : features[0].id;
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const activeItem = features.find(f => f.id === activeFeature);

  // Animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div id="features" className="relative overflow-hidden bg-background section-padding">
      <div className="container-padding mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Features that make sustainable travel easy
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
            Our smart technology takes the hassle out of eco-friendly travel planning and helps you make better choices for the planet.
          </p>
        </div>

        <div ref={ref} className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          {/* Feature List */}
          <motion.div
            className="space-y-4 sm:space-y-6"
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            {features.map((feature) => (
              <motion.div
                key={feature.id}
                variants={itemVariants}
                onClick={() => setActiveFeature(feature.id)}
                className={`flex items-start p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                  activeFeature === feature.id
                    ? 'bg-white shadow-subtle border border-green-100'
                    : 'hover:bg-white/50'
                }`}
              >
                <div className={`flex-shrink-0 rounded-lg p-2 ${feature.color}`}>
                  {feature.icon}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-foreground">
                    {feature.name}
                  </h3>
                  <p className="mt-1 text-foreground/80">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Feature Image */}
          <div className="mt-10 lg:mt-0">
            <div className="relative rounded-2xl overflow-hidden shadow-elevation">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className={`transition-all duration-700 absolute inset-0 ${
                    activeFeature === feature.id
                      ? 'opacity-100 z-10'
                      : 'opacity-0 z-0'
                  }`}
                >
                  <img
                    src={feature.image}
                    alt={feature.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6">
                    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${feature.color} mb-2`}>
                      {feature.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
