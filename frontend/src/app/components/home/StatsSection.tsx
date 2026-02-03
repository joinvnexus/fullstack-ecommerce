'use client';

import { useEffect, useState } from 'react';
import { Users, ShoppingBag, Star, TrendingUp } from 'lucide-react';

const stats = [
  {
    id: 1,
    label: 'Happy Customers',
    value: 50000,
    suffix: '+',
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
    description: 'Trusted by thousands'
  },
  {
    id: 2,
    label: 'Products Available',
    value: 10000,
    suffix: '+',
    icon: ShoppingBag,
    color: 'from-purple-500 to-pink-500',
    description: 'Wide selection'
  },
  {
    id: 3,
    label: 'Average Rating',
    value: 4.8,
    suffix: '/5',
    icon: Star,
    color: 'from-yellow-500 to-orange-500',
    description: 'Customer satisfaction'
  },
  {
    id: 4,
    label: 'Growth Rate',
    value: 150,
    suffix: '%',
    icon: TrendingUp,
    color: 'from-green-500 to-emerald-500',
    description: 'Year over year'
  }
];

const StatsSection = () => {
  const [animatedValues, setAnimatedValues] = useState(stats.map(() => 0));
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('stats-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = duration / steps;

    stats.forEach((stat, index) => {
      let current = 0;
      const target = stat.value;
      const stepValue = target / steps;

      const timer = setInterval(() => {
        current += stepValue;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }

        setAnimatedValues(prev => {
          const newValues = [...prev];
          newValues[index] = Math.floor(current);
          return newValues;
        });
      }, increment);
    });
  }, [isVisible]);

  return (
    <section id="stats-section" className="py-20 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Trusted by Thousands Worldwide
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join our growing community of satisfied customers who trust us for quality products and exceptional service
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            const displayValue = isVisible ? animatedValues[index] : 0;

            return (
              <div
                key={stat.id}
                className={`group bg-gradient-to-br ${stat.color} rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 transform-gpu`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 bg-white/20 rounded-xl backdrop-blur-sm group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold tabular-nums">
                      {typeof stat.value === 'number' && stat.value % 1 === 0
                        ? displayValue.toLocaleString()
                        : displayValue.toFixed(1)
                      }
                      <span className="text-lg font-normal">{stat.suffix}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-white/90 transition-colors">
                    {stat.label}
                  </h3>
                  <p className="text-white/80 text-sm group-hover:text-white/90 transition-colors">
                    {stat.description}
                  </p>
                </div>

                {/* Animated background effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            );
          })}
        </div>

        {/* Additional Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-8 px-8 py-4 bg-gray-50 rounded-full">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 font-medium">Active 24/7</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 font-medium">Secure Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 font-medium">Fast Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
