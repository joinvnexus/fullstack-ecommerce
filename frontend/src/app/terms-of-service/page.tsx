'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollText, Search, FileText, Shield, AlertTriangle, Mail, Phone, Calendar } from 'lucide-react';

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

const tocItems: TOCItem[] = [
  { id: 'acceptance', title: 'Acceptance of Terms', level: 1 },
  { id: 'use-license', title: 'Use License', level: 1 },
  { id: 'user-accounts', title: 'User Accounts', level: 1 },
  { id: 'orders-payments', title: 'Orders and Payments', level: 1 },
  { id: 'shipping-delivery', title: 'Shipping and Delivery', level: 1 },
  { id: 'returns-refunds', title: 'Returns and Refunds', level: 1 },
  { id: 'intellectual-property', title: 'Intellectual Property', level: 1 },
  { id: 'limitation-liability', title: 'Limitation of Liability', level: 1 },
  { id: 'termination', title: 'Termination', level: 1 },
  { id: 'governing-law', title: 'Governing Law', level: 1 },
  { id: 'changes-terms', title: 'Changes to Terms', level: 1 },
  { id: 'contact-info', title: 'Contact Information', level: 1 }
];

export default function TermsOfServicePage() {
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

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <FileText className="w-4 h-4" />
            Legal Documents
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Please read these terms of service carefully before using our website.
            By accessing or using our services, you agree to be bound by these terms.
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
                    <ScrollText className="w-5 h-5" />
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
                            ? 'bg-blue-100 text-blue-700 font-medium'
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

              {/* Quick Actions */}
              <Card className="mt-6 shadow-lg border-0">
                <CardContent className="pt-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Quick Actions</h4>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <Mail className="w-4 h-4 mr-2" />
                      Email to Legal
                    </Button>
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
                  placeholder="Search terms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Terms Content */}
            <div className="space-y-8">
              {/* 1. Acceptance of Terms */}
              <Card id="acceptance" className="scroll-mt-8 shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Badge variant="secondary" className="w-8 h-8 rounded-full p-0 flex items-center justify-center text-sm font-bold">
                      1
                    </Badge>
                    Acceptance of Terms
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-gray-700 leading-relaxed">
                    By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
                    If you do not agree to abide by the above, please do not use this service.
                  </p>
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-blue-800 font-medium">Important Notice</p>
                        <p className="text-sm text-blue-700 mt-1">
                          These terms apply to all visitors, users, and others who access or use our service.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 2. Use License */}
              <Card id="use-license" className="scroll-mt-8 shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Badge variant="secondary" className="w-8 h-8 rounded-full p-0 flex items-center justify-center text-sm font-bold bg-green-100 text-green-700">
                      2
                    </Badge>
                    Use License
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Permission is granted to temporarily access the materials (information or software) on our website for personal,
                    non-commercial transitory viewing only.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-600">This is the grant of a license, not a transfer of title</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-600">You may not modify or copy the materials</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-600">You may not use the materials for any commercial purpose</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 3. User Accounts */}
              <Card id="user-accounts" className="scroll-mt-8 shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Badge variant="secondary" className="w-8 h-8 rounded-full p-0 flex items-center justify-center text-sm font-bold bg-purple-100 text-purple-700">
                      3
                    </Badge>
                    User Accounts
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                      When you create an account with us, you must provide information that is accurate, complete, and current at all times.
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Account Responsibilities:</h4>
                      <ul className="space-y-2 text-gray-600">
                        <li>• Keep your account information secure and confidential</li>
                        <li>• Notify us immediately of any unauthorized use</li>
                        <li>• Provide accurate information during registration</li>
                        <li>• Maintain up-to-date contact information</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 4. Orders and Payments */}
              <Card id="orders-payments" className="scroll-mt-8 shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Badge variant="secondary" className="w-8 h-8 rounded-full p-0 flex items-center justify-center text-sm font-bold bg-orange-100 text-orange-700">
                      4
                    </Badge>
                    Orders and Payments
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Order Policies</h4>
                      <ul className="space-y-2 text-gray-600">
                        <li>• Orders cannot be modified once confirmed</li>
                        <li>• Prices are subject to change without notice</li>
                        <li>• All orders are subject to product availability</li>
                        <li>• Order confirmation will be sent via email</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Payment Terms</h4>
                      <ul className="space-y-2 text-gray-600">
                        <li>• Payment must be completed to confirm order</li>
                        <li>• Failed payments will cancel the order</li>
                        <li>• Refunds processed within 5-7 business days</li>
                        <li>• Multiple payment methods accepted</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 5. Shipping and Delivery */}
              <Card id="shipping-delivery" className="scroll-mt-8 shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Badge variant="secondary" className="w-8 h-8 rounded-full p-0 flex items-center justify-center text-sm font-bold bg-cyan-100 text-cyan-700">
                      5
                    </Badge>
                    Shipping and Delivery
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                      We strive to deliver your orders as quickly and efficiently as possible. Delivery times may vary based on your location and product availability.
                    </p>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Delivery Timeframes:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-semibold text-blue-700">Dhaka</div>
                          <div className="text-blue-600">1-2 business days</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-blue-700">Other Cities</div>
                          <div className="text-blue-600">2-5 business days</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-blue-700">Express</div>
                          <div className="text-blue-600">Same day/next day</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 6. Returns and Refunds */}
              <Card id="returns-refunds" className="scroll-mt-8 shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Badge variant="secondary" className="w-8 h-8 rounded-full p-0 flex items-center justify-center text-sm font-bold bg-yellow-100 text-yellow-700">
                      6
                    </Badge>
                    Returns and Refunds
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                      We want you to be completely satisfied with your purchase. If you're not happy with your order, we offer a comprehensive return policy.
                    </p>
                    <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                      <h4 className="font-semibold text-green-900 mb-2">Return Conditions:</h4>
                      <ul className="space-y-1 text-green-800 text-sm">
                        <li>• Items must be unused and in original packaging</li>
                        <li>• Return within 7 days of delivery</li>
                        <li>• Valid for damaged or incorrect items</li>
                        <li>• Return shipping costs may apply</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 7. Intellectual Property */}
              <Card id="intellectual-property" className="scroll-mt-8 shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Badge variant="secondary" className="w-8 h-8 rounded-full p-0 flex items-center justify-center text-sm font-bold bg-indigo-100 text-indigo-700">
                      7
                    </Badge>
                    Intellectual Property
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-gray-700 leading-relaxed">
                    The website and its original content, features, and functionality are and will remain the exclusive property of our company and its licensors.
                    The website is protected by copyright, trademark, and other laws.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4" />
                    <span>All rights reserved © 2024</span>
                  </div>
                </CardContent>
              </Card>

              {/* 8. Limitation of Liability */}
              <Card id="limitation-liability" className="scroll-mt-8 shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Badge variant="secondary" className="w-8 h-8 rounded-full p-0 flex items-center justify-center text-sm font-bold bg-red-100 text-red-700">
                      8
                    </Badge>
                    Limitation of Liability
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-gray-700 leading-relaxed">
                    In no event shall our company, nor its directors, employees, partners, agents, suppliers, or affiliates,
                    be liable for any indirect, incidental, special, consequential, or punitive damages, including without
                    limitation, loss of profits, data, use, goodwill, or other intangible losses.
                  </p>
                </CardContent>
              </Card>

              {/* 9. Termination */}
              <Card id="termination" className="scroll-mt-8 shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Badge variant="secondary" className="w-8 h-8 rounded-full p-0 flex items-center justify-center text-sm font-bold bg-gray-100 text-gray-700">
                      9
                    </Badge>
                    Termination
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-gray-700 leading-relaxed">
                    We may terminate or suspend your account immediately, without prior notice or liability,
                    for any reason whatsoever, including without limitation if you breach the Terms.
                  </p>
                  <p className="text-gray-700 leading-relaxed mt-3">
                    Upon termination, your right to use the service will cease immediately.
                  </p>
                </CardContent>
              </Card>

              {/* 10. Governing Law */}
              <Card id="governing-law" className="scroll-mt-8 shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Badge variant="secondary" className="w-8 h-8 rounded-full p-0 flex items-center justify-center text-sm font-bold bg-teal-100 text-teal-700">
                      10
                    </Badge>
                    Governing Law
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-gray-700 leading-relaxed">
                    These Terms shall be interpreted and governed by the laws of Bangladesh, without regard to its conflict of law provisions.
                    Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
                  </p>
                </CardContent>
              </Card>

              {/* 11. Changes to Terms */}
              <Card id="changes-terms" className="scroll-mt-8 shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Badge variant="secondary" className="w-8 h-8 rounded-full p-0 flex items-center justify-center text-sm font-bold bg-amber-100 text-amber-700">
                      11
                    </Badge>
                    Changes to Terms
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-gray-700 leading-relaxed">
                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time.
                    If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
                  </p>
                  <p className="text-gray-700 leading-relaxed mt-3">
                    What constitutes a material change will be determined at our sole discretion.
                  </p>
                </CardContent>
              </Card>

              {/* 12. Contact Information */}
              <Card id="contact-info" className="scroll-mt-8 shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Badge variant="secondary" className="w-8 h-8 rounded-full p-0 flex items-center justify-center text-sm font-bold bg-blue-100 text-blue-700">
                      12
                    </Badge>
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-gray-700 leading-relaxed mb-6">
                    If you have any questions about these Terms of Service, please contact us:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Email</p>
                        <p className="text-gray-600">legal@ecommerce.com</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <Phone className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-gray-900">Phone</p>
                        <p className="text-gray-600">+880 123 456 7890</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <p className="text-blue-800 text-sm">
                      <strong>Response Time:</strong> We typically respond to inquiries within 24-48 hours during business days.
                    </p>
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
