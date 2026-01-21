'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'কীভাবে অর্ডার করব?',
    answer: 'অর্ডার করার জন্য প্রথমে আপনাকে রেজিস্টার করতে হবে। তারপর পছন্দের পণ্য কার্টে যোগ করে চেকআউট করুন। পেমেন্ট সম্পন্ন করার পর অর্ডার কনফার্ম হবে।'
  },
  {
    question: 'পেমেন্ট কীভাবে করব?',
    answer: 'আমরা বিভিন্ন পেমেন্ট মেথড সাপোর্ট করি: কার্ড (Visa, MasterCard), মোবাইল ব্যাংকিং (bKash, Nagad), এবং ক্যাশ অন ডেলিভারি।'
  },
  {
    question: 'ডেলিভারি কতদিন লাগবে?',
    answer: 'ঢাকার মধ্যে ১-২ দিন, ঢাকার বাইরে ২-৫ দিন। ডেলিভারি সময় পণ্য এবং লোকেশন অনুসারে পরিবর্তিত হয়।'
  },
  {
    question: 'পণ্য রিটার্ন করা যাবে?',
    answer: 'হ্যাঁ, ড্যামেজড বা ভুল পণ্য হলে ৭ দিনের মধ্যে রিটার্ন করা যাবে। রিটার্ন পলিসি বিস্তারিত দেখুন।'
  },
  {
    question: 'অ্যাকাউন্ট ভুলে গেছি কী করব?',
    answer: 'পাসওয়ার্ড রিসেট করার জন্য লগইন পেজে "পাসওয়ার্ড ভুলে গেছি" লিঙ্কে ক্লিক করে আপনার ইমেইল দিন। রিসেট লিঙ্ক পাবেন।'
  },
  {
    question: 'অর্ডার ট্র্যাক করব কীভাবে?',
    answer: 'আপনার অ্যাকাউন্টে লগইন করে "আমার অর্ডার" সেকশনে গিয়ে অর্ডার স্ট্যাটাস দেখতে পারেন।'
  },
  {
    question: 'পণ্যের গুণগত মান কেমন?',
    answer: 'আমরা শুধুমাত্র বিশ্বস্ত সাপ্লায়ার থেকে পণ্য সংগ্রহ করি এবং সব পণ্যের গুণগত মান নিশ্চিত করি।'
  },
  {
    question: 'কাস্টমার সাপোর্ট কখন পাওয়া যায়?',
    answer: 'সোমবার থেকে শুক্রবার সকাল ৯টা থেকে বিকাল ৬টা পর্যন্ত। শনিবার সকাল ৯টা থেকে দুপুর ২টা।'
  }
];

function FAQItem({ faq }: { faq: FAQItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="mb-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardTitle className="flex items-center justify-between text-left">
              <span className="pr-4">{faq.question}</span>
              <ChevronDown
                className={`h-5 w-5 transition-transform ${
                  isOpen ? 'transform rotate-180' : ''
                }`}
              />
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

export default function FAQPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">সচরাচর জিজ্ঞাসিত প্রশ্নাবলী</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            আমাদের সাধারণ প্রশ্নাবলীর উত্তর খুঁজে নিন। যদি আপনার প্রশ্নের উত্তর না পান,
            তাহলে যোগাযোগ ফর্ম ব্যবহার করে আমাদের সাথে যোগাযোগ করুন।
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} faq={faq} />
          ))}
        </div>

        <Card className="mt-12 text-center">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4">এখনও প্রশ্ন আছে?</h3>
            <p className="text-muted-foreground mb-6">
              উপরের প্রশ্নাবলীতে আপনার উত্তর না পেলে, সরাসরি আমাদের সাথে যোগাযোগ করুন।
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              যোগাযোগ করুন
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}