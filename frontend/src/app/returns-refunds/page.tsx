'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  RotateCcw,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  CreditCard,
  Phone,
  Mail,
  Search,
  FileText,
  Calendar,
  AlertTriangle,
  Package,
  RefreshCw
} from 'lucide-react';

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

const tocItems: TOCItem[] = [
  { id: 'overview', title: 'Overview', level: 1 },
  { id: 'eligibility', title: 'Return Eligibility', level: 1 },
  { id: 'non-eligible', title: 'Non-Eligible Items', level: 1 },
  { id: 'return-process', title: 'Return Process', level: 1 },
  { id: 'refund-process', title: 'Refund Process', level: 1 },
  { id: 'exchange-policy', title: 'Exchange Policy', level: 1 },
  { id: 'shipping-costs', title: 'Shipping Costs', level: 1 },
  { id: 'damaged-items', title: 'Damaged Items', level: 1 },
  { id: 'contact-support', title: 'Contact Support', level: 1 }
];

export default function ReturnsRefundsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('');
  const [lastUpdated] = useState(new Date('2024-01-15'));

  useEffect(() => {
    const handleScroll = () => {
      const sections = tocItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(tocItems[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M40 40c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm20 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6">
            <RotateCcw className="w-4 h-4" />
            Returns & Refunds
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Returns & Refunds Policy
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            We want you to be completely satisfied with your purchase. Our comprehensive return policy ensures a smooth experience for all your needs.
          </p>

          {/* Last Updated Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            <Calendar className="w-4 h-4" />
            Last Updated: {lastUpdated.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card className="shadow-lg border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="w-5 h-5" />
                    Table of Contents
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <nav className="space-y-2">
                    {tocItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                          activeSection === item.id
                            ? 'bg-green-100 text-green-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                        style={{ paddingLeft: `${item.level * 12 + 12}px` }}
                      >
                        {item.title}
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="mt-6 shadow-lg border-0">
                <CardContent className="pt-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Quick Facts</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-600">7-day return window</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-600">Free returns on defects</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-gray-600">5-7 day refunds</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search return policy..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="text-center shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-green-700">Eligible Returns</h3>
                  <p className="text-sm text-gray-600">
                    Damaged, defective, or incorrect items can be returned
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-blue-700">7-Day Window</h3>
                  <p className="text-sm text-gray-600">
                    Return within 7 days of delivery for most items
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <XCircle className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-red-700">Non-Eligible Items</h3>
                  <p className="text-sm text-gray-600">
                    Used, worn, or customer-damaged items cannot be returned
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Terms Content */}
            <div className="space-y-8">
              {/* 1. Overview */}
              <Card id="overview" className="scroll-mt-8 shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Badge variant="secondary" className="w-8 h-8 rounded-full p-0 flex items-center justify-center text-sm font-bold">
                      1
                    </Badge>
                    Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    At our ecommerce platform, customer satisfaction is our top priority. We offer a comprehensive returns and refunds policy
                    designed to make your shopping experience as smooth and worry-free as possible.
                  </p>
                  <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-green-800 font-medium">Hassle-Free Returns</p>
                        <p className="text-sm text-green-700 mt-1">
                          Most items can be returned within 7 days of delivery with our free return shipping for defective items.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 2. Return Eligibility */}
              <Card id="eligibility" className="scroll-mt-8 shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Badge variant="secondary" className="w-8 h-8 rounded-full p-0 flex items-center justify-center text-sm font-bold bg-blue-100 text-blue-700">
                      2
                    </Badge>
                    Return Eligibility
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <p className="text-gray-700 leading-relaxed">
                      Items must meet certain criteria to be eligible for return. Here's what qualifies:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-green-700 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5" />
                          Eligible for Return
                        </h4>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-600">Damaged or defective items</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-600">Incorrect items sent</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-600">Items not as described</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-600">Manufacturing defects</span>
                          </li>
                        </ul>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                          <Clock className="w-5 h-5" />
                          Time Requirements
                        </h4>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-blue-800 font-medium">Return Window</p>
                          <p className="text-blue-700 text-sm mt-1">Within 7 days of delivery</p>
                          <p className="text-blue-600 text-xs mt-2">Some items may have extended return periods</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 3. Non-Eligible Items */}
              <Card id="non-eligible" className="scroll-mt-8 shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Badge variant="secondary" className="w-8 h-8 rounded-full p-0 flex items-center justify-center text-sm font-bold bg-red-100 text-red-700">
                      3
                    </Badge>
                    Non-Eligible Items
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-gray-700 leading-relaxed mb-6">
                    The following items cannot be returned under our standard return policy:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                        <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <span className="text-red-800">Used or worn items</span>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                        <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <span className="text-red-800">Items damaged by customer</span>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                        <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <span className="text-red-800">Opened beauty/cosmetic products</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                        <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <span className="text-red-800">Custom or personalized items</span>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                        <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <span className="text-red-800">Digital downloads/software</span>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                        <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <span className="text-red-800">Perishable goods</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 4. Return Process */}
              <Card id="return-process" className="scroll-mt-8 shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Badge variant="secondary" className="w-8 h-8 rounded-full p-0 flex items-center justify-center text-sm font-bold bg-purple-100 text-purple-700">
                      4
                    </Badge>
                    Return Process
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <p className="text-gray-700 leading-relaxed">
                      Returning an item is simple and straightforward. Follow these steps:
                    </p>

                    <div className="space-y-4">
                      {[
                        { step: 1, title: "Initiate Return Request", desc: "Contact our customer service or start return through your account dashboard" },
                        { step: 2, title: "Provide Details", desc: "Include order number, reason for return, and photos if applicable" },
                        { step: 3, title: "Quality Check", desc: "Our team reviews your request and approves eligible returns" },
                        { step: 4, title: "Pickup/Shipping", desc: "We arrange free pickup for defective items or provide return label" },
                        { step: 5, title: "Refund Processing", desc: "Once item is received and inspected, refund is processed" }
                      ].map((item) => (
                        <div key={item.step} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                            {item.step}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{item.title}</h4>
                            <p className="text-gray-600 text-sm mt-1">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 5. Refund Process */}
              <Card id="refund-process" className="scroll-mt-8 shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Badge variant="secondary" className="w-8 h-8 rounded-full p-0 flex items-center justify-center text-sm font-bold bg-orange-100 text-orange-700">
                      5
                    </Badge>
                    Refund Process
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Refund Types</h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                          <div>
                            <p className="font-medium text-gray-900">Full Refund</p>
                            <p className="text-sm text-gray-600">For defective or incorrect items</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
                          <div>
                            <p className="font-medium text-gray-900">Partial Refund</p>
                            <p className="text-sm text-gray-600">For items with minor issues</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-3 h-3 bg-purple-500 rounded-full mt-2"></div>
                          <div>
                            <p className="font-medium text-gray-900">Store Credit</p>
                            <p className="text-sm text-gray-600">Alternative to cash refund</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Processing Times</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium">Credit/Debit Cards</span>
                          <span className="text-sm text-gray-600">5-7 business days</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium">Mobile Banking</span>
                          <span className="text-sm text-gray-600">2-3 business days</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium">Cash on Delivery</span>
                          <span className="text-sm text-gray-600">After return inspection</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 6. Exchange Policy */}
              <Card id="exchange-policy" className="scroll-mt-8 shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Badge variant="secondary" className="w-8 h-8 rounded-full p-0 flex items-center justify-center text-sm font-bold bg-teal-100 text-teal-700">
                      6
                    </Badge>
                    Exchange Policy
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-gray-700 leading-relaxed mb-6">
                    We offer exchanges for items of equal or lesser value. Exchanges are processed similarly to returns but with some additional considerations.
                  </p>

                  <div className="bg-teal-50 p-6 rounded-lg border-l-4 border-teal-400">
                    <h4 className="font-semibold text-teal-900 mb-3">Exchange Conditions</h4>
                    <ul className="space-y-2 text-teal-800">
                      <li>• Item must be in original condition with tags attached</li>
                      <li>• Exchange for same item in different size/color (subject to availability)</li>
                      <li>• Exchange for different item of equal or lesser value</li>
                      <li>• Price difference will be charged or refunded accordingly</li>
                      <li>• Exchanges must be completed within 14 days of original delivery</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* 7. Shipping Costs */}
              <Card id="shipping-costs" className="scroll-mt-8 shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Badge variant="secondary" className="w-8 h-8 rounded-full p-0 flex items-center justify-center text-sm font-bold bg-gray-100 text-gray-700">
                      7
                    </Badge>
                    Shipping Costs
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Truck className="w-5 h-5 text-green-600" />
                          <h4 className="font-semibold text-green-700">Free Return Shipping</h4>
                        </div>
                        <p className="text-green-800 text-sm">For defective or incorrect items</p>
                        <p className="text-green-600 text-xs mt-2">We cover all shipping costs</p>
                      </div>

                      <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Truck className="w-5 h-5 text-orange-600" />
                          <h4 className="font-semibold text-orange-700">Paid Return Shipping</h4>
                        </div>
                        <p className="text-orange-800 text-sm">For non-defective returns</p>
                        <p className="text-orange-600 text-xs mt-2">Customer bears shipping costs</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">Shipping Cost Details</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700 text-sm leading-relaxed">
                          Return shipping costs depend on the reason for return and your location. For defective items,
                          we provide prepaid return labels. For other returns, you may need to cover the shipping cost,
                          which will be deducted from your refund.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 8. Damaged Items */}
              <Card id="damaged-items" className="scroll-mt-8 shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Badge variant="secondary" className="w-8 h-8 rounded-full p-0 flex items-center justify-center text-sm font-bold bg-red-100 text-red-700">
                      8
                    </Badge>
                    Damaged Items
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <p className="text-gray-700 leading-relaxed">
                      If your item arrives damaged due to shipping, we want to make it right immediately. Our damaged item policy ensures you get a replacement or refund quickly.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-red-700 flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5" />
                          What to Do
                        </h4>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-600">Take photos of the damaged packaging and item</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-600">Keep all original packaging and materials</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-600">Contact us within 48 hours of delivery</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-600">Provide order number and damage description</span>
                          </li>
                        </ul>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold text-green-700 flex items-center gap-2">
                          <Package className="w-5 h-5" />
                          Our Response
                        </h4>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <p className="text-green-800 font-medium">Quick Resolution</p>
                          <p className="text-green-700 text-sm mt-1">
                            We'll send a replacement or process a full refund within 24-48 hours of receiving your report and photos.
                          </p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-blue-800 font-medium">Free Everything</p>
                          <p className="text-blue-700 text-sm mt-1">
                            No cost to you - we cover return shipping, replacement shipping, and any associated fees.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 9. Contact Support */}
              <Card id="contact-support" className="scroll-mt-8 shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Badge variant="secondary" className="w-8 h-8 rounded-full p-0 flex items-center justify-center text-sm font-bold bg-blue-100 text-blue-700">
                      9
                    </Badge>
                    Contact Support
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <p className="text-gray-700 leading-relaxed">
                      Need help with a return or have questions about our policy? Our customer support team is here to assist you.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Contact Methods</h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Phone className="w-5 h-5 text-blue-600" />
                            <div>
                              <p className="font-medium text-gray-900">Phone Support</p>
                              <p className="text-sm text-gray-600">1-800-RETURNS (24/7)</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Mail className="w-5 h-5 text-green-600" />
                            <div>
                              <p className="font-medium text-gray-900">Email Support</p>
                              <p className="text-sm text-gray-600">returns@ecommerce.com</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <RefreshCw className="w-5 h-5 text-purple-600" />
                            <div>
                              <p className="font-medium text-gray-900">Live Chat</p>
                              <p className="text-sm text-gray-600">Available 9 AM - 9 PM EST</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">What to Prepare</h4>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <ul className="space-y-2 text-blue-800 text-sm">
                            <li>• Order number</li>
                            <li>• Reason for return</li>
                            <li>• Photos (if applicable)</li>
                            <li>• Preferred resolution method</li>
                          </ul>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                          <p className="text-green-800 font-medium">Response Time</p>
                          <p className="text-green-700 text-sm mt-1">
                            We typically respond to all inquiries within 2-4 hours during business hours.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">Start Your Return</h4>
                      <p className="text-gray-700 text-sm mb-4">
                        Ready to initiate your return? Use the button below to get started with our automated return process.
                      </p>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        Start Return Process
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
