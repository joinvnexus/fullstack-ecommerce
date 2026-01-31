'use client';

import { useState } from 'react';
import { Ruler, Shirt, Zap, Info } from 'lucide-react';
import BreadcrumbNavigation from '@/app/components/layout/BreadcrumbNavigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const SizeGuidePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('clothing');
  const [selectedUnit, setSelectedUnit] = useState<'cm' | 'inches'>('cm');

  const categories = [
    { id: 'clothing', label: 'Clothing', icon: Shirt },
    { id: 'shoes', label: 'Shoes', icon: Ruler },
    { id: 'electronics', label: 'Electronics', icon: Zap },
  ];

  const sizeCharts = {
    clothing: {
      title: 'Clothing Size Guide',
      description: 'Find your perfect fit with our comprehensive clothing size guide.',
      measurements: [
        { size: 'XS', chest: { cm: '86-91', inches: '34-36' }, waist: { cm: '66-71', inches: '26-28' }, hips: { cm: '86-91', inches: '34-36' } },
        { size: 'S', chest: { cm: '91-96', inches: '36-38' }, waist: { cm: '71-76', inches: '28-30' }, hips: { cm: '91-96', inches: '36-38' } },
        { size: 'M', chest: { cm: '96-101', inches: '38-40' }, waist: { cm: '76-81', inches: '30-32' }, hips: { cm: '96-101', inches: '38-40' } },
        { size: 'L', chest: { cm: '101-106', inches: '40-42' }, waist: { cm: '81-86', inches: '32-34' }, hips: { cm: '101-106', inches: '40-42' } },
        { size: 'XL', chest: { cm: '106-111', inches: '42-44' }, waist: { cm: '86-91', inches: '34-36' }, hips: { cm: '106-111', inches: '42-44' } },
        { size: 'XXL', chest: { cm: '111-116', inches: '44-46' }, waist: { cm: '91-96', inches: '36-38' }, hips: { cm: '111-116', inches: '44-46' } },
      ]
    },
    shoes: {
      title: 'Shoe Size Guide',
      description: 'Get the perfect shoe fit with our international size conversion chart.',
      measurements: [
        { size: 'US 6', eu: '39', uk: '5.5', cm: '24.1' },
        { size: 'US 7', eu: '40', uk: '6.5', cm: '24.8' },
        { size: 'US 8', eu: '41', uk: '7.5', cm: '25.4' },
        { size: 'US 9', eu: '42', uk: '8.5', cm: '26.0' },
        { size: 'US 10', eu: '43', uk: '9.5', cm: '26.7' },
        { size: 'US 11', eu: '44', uk: '10.5', cm: '27.3' },
        { size: 'US 12', eu: '45', uk: '11.5', cm: '28.0' },
      ]
    },
    electronics: {
      title: 'Device Compatibility Guide',
      description: 'Check compatibility and specifications for our electronic products.',
      measurements: [
        { device: 'Smartphone', screen: '6.1"', battery: '3,279 mAh', os: 'iOS/Android' },
        { device: 'Tablet', screen: '10.2"', battery: '8,500 mAh', os: 'iPadOS/Android' },
        { device: 'Laptop', screen: '13.3"-17.3"', battery: '4-8 hours', os: 'Windows/macOS' },
        { device: 'Smartwatch', screen: '1.2"-1.9"', battery: '1-7 days', os: 'watchOS/Wear OS' },
        { device: 'Headphones', driver: '40mm', battery: '20-30 hours', connectivity: 'Bluetooth 5.0' },
      ]
    }
  };

  const currentChart = sizeCharts[selectedCategory as keyof typeof sizeCharts];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <BreadcrumbNavigation
            items={[
              { label: 'Home', href: '/' },
              { label: 'Size Guide', isActive: true }
            ]}
          />
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Ruler size={32} className="text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Size Guide</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find your perfect fit with our comprehensive size guides and compatibility charts
          </p>
        </div>

        {/* Category Selector */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-200">
            <div className="flex space-x-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                      selectedCategory === category.id
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <Icon size={16} />
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Size Chart */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentChart.title}
            </h2>
            <p className="text-gray-600">{currentChart.description}</p>
          </div>

          {/* Unit Toggle for Clothing */}
          {selectedCategory === 'clothing' && (
            <div className="flex justify-center mb-6">
              <div className="bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setSelectedUnit('cm')}
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    selectedUnit === 'cm'
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  Centimeters
                </button>
                <button
                  onClick={() => setSelectedUnit('inches')}
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    selectedUnit === 'inches'
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  Inches
                </button>
              </div>
            </div>
          )}

          {/* Size Table */}
          <div className="overflow-x-auto">
            {selectedCategory === 'clothing' && (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Size</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      Chest ({selectedUnit})
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      Waist ({selectedUnit})
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      Hips ({selectedUnit})
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentChart.measurements.map((measurement: any, index: number) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {measurement.size}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {measurement.chest[selectedUnit]}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {measurement.waist[selectedUnit]}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {measurement.hips[selectedUnit]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {selectedCategory === 'shoes' && (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">US Size</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">EU Size</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">UK Size</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Foot Length (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  {currentChart.measurements.map((measurement: any, index: number) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {measurement.size}
                      </td>
                      <td className="py-3 px-4 text-gray-700">{measurement.eu}</td>
                      <td className="py-3 px-4 text-gray-700">{measurement.uk}</td>
                      <td className="py-3 px-4 text-gray-700">{measurement.cm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {selectedCategory === 'electronics' && (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Device Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Screen Size</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Battery</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Operating System</th>
                  </tr>
                </thead>
                <tbody>
                  {currentChart.measurements.map((measurement: any, index: number) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {measurement.device}
                      </td>
                      <td className="py-3 px-4 text-gray-700">{measurement.screen}</td>
                      <td className="py-3 px-4 text-gray-700">{measurement.battery}</td>
                      <td className="py-3 px-4 text-gray-700">{measurement.os}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* How to Measure */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8">
          <div className="flex items-start gap-4">
            <Info size={24} className="text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-4">
                How to Take Your Measurements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                <div>
                  <h4 className="font-medium text-blue-900 mb-2">Chest</h4>
                  <p className="text-blue-700">
                    Measure around the fullest part of your chest, keeping the tape horizontal.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-blue-900 mb-2">Waist</h4>
                  <p className="text-blue-700">
                    Measure around your natural waistline, typically the narrowest part.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-blue-900 mb-2">Hips</h4>
                  <p className="text-blue-700">
                    Measure around the widest part of your hips and buttocks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Still not sure about your size?
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline">
              Contact Support
            </Button>
            <Button variant="outline">
              View Size Videos
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeGuidePage;