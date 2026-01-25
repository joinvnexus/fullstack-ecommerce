'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  Eye,
  Lock,
  Users,
  Cookie,
  Mail,
  Phone,
  Search,
  FileText,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Info,
  Database,
  UserCheck,
  Settings
} from 'lucide-react';

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

const tocItems: TOCItem[] = [
  { id: 'overview', title: 'Overview', level: 1 },
  { id: 'information-collect', title: 'Information We Collect', level: 1 },
  { id: 'how-we-use', title: 'How We Use Your Information', level: 1 },
  { id: 'information-sharing', title: 'Information Sharing', level: 1 },
  { id: 'data-security', title: 'Data Security', level: 1 },
  { id: 'your-rights', title: 'Your Rights', level: 1 },
  { id: 'cookies-tracking', title: 'Cookies and Tracking', level: 1 },
  { id: 'contact-us', title: 'Contact Us', level: 1 }
];

export default function PrivacyPolicyPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%236366F1' fill-opacity='0.1'%3E%3Cpath d='M40 40c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm20 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Privacy Policy
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
          </p>

          {/* Last Updated Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
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

              {/* Quick Stats */}
              <Card className="mt-6 shadow-lg border-0">
                <CardContent className="pt-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Key Points</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Lock className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-600">Data encryption</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <UserCheck className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-600">Your rights protected</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Eye className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-gray-600">Transparent practices</span>
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
                  placeholder="Search privacy policy..."
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
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-blue-700">Data Protection</h3>
                  <p className="text-sm text-gray-600">
                    We implement robust security measures to protect your information
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserCheck className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-green-700">Your Rights</h3>
                  <p className="text-sm text-gray-600">
                    Access, update, or delete your personal information anytime
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-purple-700">Transparency</h3>
                  <p className="text-sm text-gray-600">
                    Clear information about how we collect and use your data
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Terms Content */}
            <div className="space-y-8">
              {/* 1. Overview */}
              <Card id="overview" className="scroll-mt-8 shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Badge variant="secondary" className="w-8 h-8 rounded-full p-0 flex items-center justify-center text-sm font-bold">
                      1
                    </Badge>
                    Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    This Privacy Policy describes how we collect, use, and protect your personal information when you use our ecommerce platform.
                    We are committed to protecting your privacy and being transparent about our data practices.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-blue-800 font-medium">Our Commitment</p>
                        <p className="text-sm text-blue-700 mt-1">
                          We only collect information necessary to provide our services and improve your experience.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 2. Information We Collect */}
              <Card id="information-collect" className="scroll-mt-8 shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Badge variant="secondary" className="w-8 h-8 rounded-full p-0 flex items-center justify-center text-sm font-bold bg-green-100 text-green-700">
                      2
                    </Badge>
                    Information We Collect
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <p className="text-gray-700 leading-relaxed">
                      We collect information to provide better services and improve your shopping experience.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-green-700 flex items-center gap-2">
                          <Database className="w-5 h-5" />
                          Personal Information
                        </h4>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-600">Name, email address, phone number</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-600">Shipping and billing addresses</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-600">Payment information</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-600">Order history and preferences</span>
                          </li>
                        </ul>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold text-blue-700 flex items-center gap-2">
                          <Eye className="w-5 h-5" />
                          Usage Information
                        </h4>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-blue-800 font-medium">Automatic Collection</p>
                          <p className="text-blue-700 text-sm mt-1">
                            IP address, browser type, device information, and browsing behavior on our site.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 3. How We Use Your Information */}
              <Card id="how-we-use" className="scroll-mt-8 shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Badge variant="secondary" className="w-8 h-8 rounded-full p-0 flex items-center justify-center text-sm font-bold bg-purple-100 text-purple-700">
                      3
                    </Badge>
                    How We Use Your Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <p className="text-gray-700 leading-relaxed">
                      We use your information responsibly to provide services and improve your experience.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                          <span className="text-purple-800">Process and fulfill orders</span>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                          <span className="text-purple-800">Provide customer support</span>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                          <span className="text-purple-800">Send order confirmations and updates</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                          <span className="text-purple-800">Improve our products and services</span>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                          <span className="text-purple-800">Personalize your shopping experience</span>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                          <span className="text-purple-800">Comply with legal obligations</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 4. Information Sharing */}
              <Card id="information-sharing" className="scroll-mt-8 shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Badge variant="secondary" className="w-8 h-8 rounded-full p-0 flex items-center justify-center text-sm font-bold bg-orange-100 text-orange-700">
                      4
                    </Badge>
                    Information Sharing
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <p className="text-gray-700 leading-relaxed">
                      We do not sell your personal information. We only share it when necessary for our services.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-orange-700 mb-4">We Share With</h4>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="w-3 h-3 bg-orange-500 rounded-full mt-2"></div>
                            <div>
                              <p className="font-medium text-gray-900">Service Providers</p>
                              <p className="text-sm text-gray-600">Payment processors, shipping companies, etc.</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-3 h-3 bg-orange-500 rounded-full mt-2"></div>
                            <div>
                              <p className="font-medium text-gray-900">Legal Requirements</p>
                              <p className="text-sm text-gray-600">When required by law or to protect rights</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-green-700 mb-4">We Don't Share</h4>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="w-3 h-3 bg-red-500 rounded-full mt-2"></div>
                            <div>
                              <p className="font-medium text-gray-900">Third-party marketing</p>
                              <p className="text-sm text-gray-600">We don't sell your data for advertising</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-3 h-3 bg-red-500 rounded-full mt-2"></div>
                            <div>
                              <p className="font-medium text-gray-900">Unauthorized parties</p>
                              <p className="text-sm text-gray-600">Without your consent or legal requirement</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 5. Data Security */}
              <Card id="data-security" className="scroll-mt-8 shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Badge variant="secondary" className="w-8 h-8 rounded-full p-0 flex items-center justify-center text-sm font-bold bg-red-100 text-red-700">
                      5
                    </Badge>
                    Data Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <p className="text-gray-700 leading-relaxed">
                      We implement industry-standard security measures to protect your personal information.
                    </p>

                    <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-400">
                      <h4 className="font-semibold text-red-900 mb-3">Security Measures</h4>
                      <ul className="space-y-2 text-red-800">
                        <li>• SSL/TLS encryption for data transmission</li>
                        <li>• Secure data storage with access controls</li>
                        <li>• Regular security audits and updates</li>
                        <li>• Employee training on data protection</li>
                        <li>• Incident response procedures</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 6. Your Rights */}
              <Card id="your-rights" className="scroll-mt-8 shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Badge variant="secondary" className="w-8 h-8 rounded-full p-0 flex items-center justify-center text-sm font-bold bg-teal-100 text-teal-700">
                      6
                    </Badge>
                    Your Rights
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <p className="text-gray-700 leading-relaxed">
                      You have control over your personal information and can exercise these rights anytime.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-teal-50 rounded-lg">
                          <UserCheck className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                          <span className="text-teal-800">Access your personal information</span>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-teal-50 rounded-lg">
                          <UserCheck className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                          <span className="text-teal-800">Correct inaccurate information</span>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-teal-50 rounded-lg">
                          <UserCheck className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                          <span className="text-teal-800">Delete your information</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-teal-50 rounded-lg">
                          <UserCheck className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                          <span className="text-teal-800">Object to processing</span>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-teal-50 rounded-lg">
                          <UserCheck className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                          <span className="text-teal-800">Data portability</span>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-teal-50 rounded-lg">
                          <UserCheck className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                          <span className="text-teal-800">Withdraw consent</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 7. Cookies and Tracking */}
              <Card id="cookies-tracking" className="scroll-mt-8 shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Badge variant="secondary" className="w-8 h-8 rounded-full p-0 flex items-center justify-center text-sm font-bold bg-gray-100 text-gray-700">
                      7
                    </Badge>
                    Cookies and Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <p className="text-gray-700 leading-relaxed">
                      We use cookies and similar technologies to enhance your browsing experience.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                          <Cookie className="w-5 h-5" />
                          Types of Cookies
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium">Essential Cookies</span>
                            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Required</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium">Analytics Cookies</span>
                            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">Optional</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium">Marketing Cookies</span>
                            <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">Optional</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                          <Settings className="w-5 h-5" />
                          Cookie Settings
                        </h4>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-blue-800 font-medium">Manage Preferences</p>
                          <p className="text-blue-700 text-sm mt-1">
                            You can control cookie settings through your browser or our cookie preferences.
                          </p>
                          <Button className="mt-3 bg-blue-600 hover:bg-blue-700 text-white text-sm">
                            Cookie Settings
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 8. Contact Us */}
              <Card id="contact-us" className="scroll-mt-8 shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Badge variant="secondary" className="w-8 h-8 rounded-full p-0 flex items-center justify-center text-sm font-bold bg-indigo-100 text-indigo-700">
                      8
                    </Badge>
                    Contact Us
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <p className="text-gray-700 leading-relaxed">
                      Have questions about your privacy or this policy? We're here to help.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Contact Methods</h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Mail className="w-5 h-5 text-blue-600" />
                            <div>
                              <p className="font-medium text-gray-900">Privacy Email</p>
                              <p className="text-sm text-gray-600">privacy@ecommerce.com</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Phone className="w-5 h-5 text-green-600" />
                            <div>
                              <p className="font-medium text-gray-900">Privacy Hotline</p>
                              <p className="text-sm text-gray-600">1-800-PRIVACY (24/7)</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Data Protection Officer</h4>
                        <div className="bg-indigo-50 p-4 rounded-lg">
                          <p className="text-indigo-800 font-medium">John Smith</p>
                          <p className="text-indigo-700 text-sm mt-1">
                            Data Protection Officer<br />
                            Available Monday - Friday, 9 AM - 5 PM EST
                          </p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                          <p className="text-green-800 font-medium">Response Time</p>
                          <p className="text-green-700 text-sm mt-1">
                            We respond to privacy inquiries within 48 hours.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">Submit a Privacy Request</h4>
                      <p className="text-gray-700 text-sm mb-4">
                        Exercise your data rights by submitting a formal request.
                      </p>
                      <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        Submit Privacy Request
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
