'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronDown, Search, HelpCircle, MessageCircle, Phone, Mail } from 'lucide-react';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  tags: string[];
}

const faqs: FAQItem[] = [
  {
    id: '1',
    category: 'Ordering',
    question: 'How do I place an order?',
    answer: 'To place an order, first create an account or log in to your existing account. Browse our products, add items to your cart, and proceed to checkout. Complete the payment process and your order will be confirmed with an email notification.',
    tags: ['order', 'account', 'checkout']
  },
  {
    id: '2',
    category: 'Payment',
    question: 'What payment methods do you accept?',
    answer: 'We accept various payment methods including credit/debit cards (Visa, MasterCard, American Express), mobile banking (bKash, Nagad, Rocket), bank transfers, and cash on delivery for eligible locations.',
    tags: ['payment', 'card', 'mobile banking']
  },
  {
    id: '3',
    category: 'Shipping',
    question: 'How long does delivery take?',
    answer: 'Delivery times vary by location: 1-2 days within Dhaka, 2-5 days outside Dhaka, and 3-7 days for other cities. Express delivery options are available for urgent orders. You can track your order status in real-time.',
    tags: ['delivery', 'shipping', 'time']
  },
  {
    id: '4',
    category: 'Returns',
    question: 'Can I return or exchange products?',
    answer: 'Yes, we offer a 7-day return policy for damaged, defective, or incorrect items. Items must be in original condition with tags attached. Return shipping costs may apply depending on the reason. Please review our complete return policy for detailed terms.',
    tags: ['return', 'exchange', 'refund']
  },
  {
    id: '5',
    category: 'Account',
    question: 'What should I do if I forgot my password?',
    answer: 'Click the "Forgot Password" link on the login page and enter your registered email address. You will receive a password reset link via email. Follow the instructions to create a new password. Contact support if you don\'t receive the email.',
    tags: ['password', 'login', 'reset']
  },
  {
    id: '6',
    category: 'Orders',
    question: 'How can I track my order?',
    answer: 'Log in to your account and go to "My Orders" section. You can view real-time order status, tracking information, and delivery updates. You will also receive SMS and email notifications at each stage of delivery.',
    tags: ['track', 'order', 'status']
  },
  {
    id: '7',
    category: 'Products',
    question: 'What is your product quality like?',
    answer: 'We source products only from trusted manufacturers and suppliers. All products undergo quality checks before shipping. We offer warranties on eligible items and stand behind the quality of everything we sell.',
    tags: ['quality', 'warranty', 'products']
  },
  {
    id: '8',
    category: 'Support',
    question: 'When is customer support available?',
    answer: 'Our customer support team is available Monday to Friday from 9 AM to 6 PM, and Saturday from 9 AM to 2 PM. You can reach us via phone, email, or live chat. Emergency support is available 24/7 for urgent order issues.',
    tags: ['support', 'contact', 'hours']
  },
  {
    id: '9',
    category: 'Shipping',
    question: 'Do you offer international shipping?',
    answer: 'Currently, we ship within Bangladesh only. We are working on expanding our shipping network to include international destinations. Stay tuned for updates on our international shipping options.',
    tags: ['international', 'shipping', 'global']
  },
  {
    id: '10',
    category: 'Payment',
    question: 'Is my payment information secure?',
    answer: 'Yes, we use industry-standard SSL encryption and secure payment gateways. Your payment information is never stored on our servers. We comply with PCI DSS standards and partner with trusted financial institutions.',
    tags: ['security', 'payment', 'ssl']
  },
  {
    id: '11',
    category: 'Account',
    question: 'How do I update my account information?',
    answer: 'Log in to your account and go to "Account Settings". You can update your personal information, shipping addresses, payment methods, and notification preferences. Changes are saved automatically.',
    tags: ['account', 'update', 'settings']
  },
  {
    id: '12',
    category: 'Products',
    question: 'Do you offer product warranties?',
    answer: 'Yes, most products come with manufacturer warranties. Warranty terms vary by product category. Check individual product pages for specific warranty information. We also offer our own satisfaction guarantee on all purchases.',
    tags: ['warranty', 'guarantee', 'products']
  }
];

const categories = ['All', 'Ordering', 'Payment', 'Shipping', 'Returns', 'Account', 'Orders', 'Products', 'Support'];

function FAQItem({ faq }: { faq: FAQItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="mb-4 group hover:shadow-lg transition-all duration-300 border-l-4 border-l-transparent hover:border-l-blue-500">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 rounded-t-lg">
            <CardTitle className="flex items-center justify-between text-left">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <HelpCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <span className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                    {faq.question}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {faq.category}
                    </span>
                  </div>
                </div>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${
                  isOpen ? 'transform rotate-180' : ''
                }`}
              />
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 pb-6">
            <div className="pl-8 border-l-2 border-gray-200 ml-6">
              <p className="text-gray-700 leading-relaxed mb-4">{faq.answer}</p>
              <div className="flex flex-wrap gap-2">
                {faq.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredFAQs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M40 40c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm20 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <HelpCircle className="w-4 h-4" />
            Help Center
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Find answers to common questions about our products, orders, shipping, and more.
            Can't find what you're looking for? Contact our support team.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-12 space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg rounded-2xl border-2 border-gray-200 focus:border-blue-500 shadow-lg"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-blue-600 hover:bg-blue-700 shadow-lg'
                    : 'hover:bg-gray-100 border-gray-300'
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4 mb-16">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq) => (
              <FAQItem key={faq.id} faq={faq} />
            ))
          ) : (
            <div className="text-center py-16">
              <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No FAQs found</h3>
              <p className="text-gray-500">
                Try adjusting your search terms or browse different categories.
              </p>
            </div>
          )}
        </div>

        {/* Contact Section */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-2xl">
          <CardContent className="pt-12 pb-12">
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-4">Still have questions?</h3>
              <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto">
                Can't find the answer you're looking for? Our friendly support team is here to help you with any questions or concerns.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="flex flex-col items-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
                  <MessageCircle className="w-8 h-8 mb-3" />
                  <h4 className="font-semibold mb-2">Live Chat</h4>
                  <p className="text-sm text-blue-100">Instant support during business hours</p>
                </div>
                <div className="flex flex-col items-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
                  <Mail className="w-8 h-8 mb-3" />
                  <h4 className="font-semibold mb-2">Email Support</h4>
                  <p className="text-sm text-blue-100">Get detailed help via email</p>
                </div>
                <div className="flex flex-col items-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
                  <Phone className="w-8 h-8 mb-3" />
                  <h4 className="font-semibold mb-2">Phone Support</h4>
                  <p className="text-sm text-blue-100">Speak directly with our team</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 font-semibold rounded-2xl hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <MessageCircle className="w-5 h-5" />
                  Contact Support
                </a>
                <a
                  href="tel:+8801234567890"
                  className="inline-flex items-center gap-3 px-8 py-4 border-2 border-white text-white font-semibold rounded-2xl hover:bg-white hover:text-blue-600 transition-all duration-300"
                >
                  <Phone className="w-5 h-5" />
                  Call Now
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
