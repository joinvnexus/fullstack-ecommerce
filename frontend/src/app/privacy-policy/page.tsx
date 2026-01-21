import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">প্রাইভেসি পলিসি</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>শেষ আপডেট: {new Date().toLocaleDateString('bn-BD')}</CardTitle>
          </CardHeader>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>১. তথ্য সংগ্রহ</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                আমরা আপনার ব্যক্তিগত তথ্য সংগ্রহ করি যখন আপনি আমাদের ওয়েবসাইটে রেজিস্টার করেন, অর্ডার দেন,
                বা আমাদের সাথে যোগাযোগ করেন। এই তথ্য অন্তর্ভুক্ত করে আপনার নাম, ইমেইল, ফোন নম্বর,
                এবং ডেলিভারি ঠিকানা।
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>২. তথ্য ব্যবহার</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                সংগৃহীত তথ্য ব্যবহার করা হয় অর্ডার প্রসেসিং, গ্রাহক সেবা প্রদান, এবং আমাদের
                পরিষেবা উন্নত করার জন্য। আমরা আপনার তথ্য তৃতীয় পক্ষের সাথে শেয়ার করি না,
                যদি না আইন দ্বারা বাধ্য করা হয়।
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>৩. তথ্য সুরক্ষা</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                আমরা আপনার ব্যক্তিগত তথ্য সুরক্ষিত রাখার জন্য শক্তিশালী নিরাপত্তা ব্যবস্থা
                ব্যবহার করি, যার মধ্যে এনক্রিপশন এবং সুরক্ষিত সার্ভার অন্তর্ভুক্ত। তথাপি,
                ইন্টারনেটের মাধ্যমে কোনো তথ্য ১০০% নিরাপদ নয়।
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>৪. কুকিজ</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                আমাদের ওয়েবসাইট কুকিজ ব্যবহার করে আপনার ব্রাউজিং অভিজ্ঞতা উন্নত করার জন্য।
                আপনি যেকোনো সময় আপনার ব্রাউজার সেটিংস থেকে কুকিজ ব্লক করতে পারেন।
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>৫. তথ্য পরিবর্তন</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                আপনি যেকোনো সময় আপনার অ্যাকাউন্টে লগইন করে আপনার তথ্য আপডেট বা মুছে ফেলতে পারেন।
                তথ্য মুছে ফেলার অনুরোধ করার জন্য support@ecommerce.com-এ ইমেইল করুন।
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>৬. যোগাযোগ</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                এই প্রাইভেসি পলিসি সম্পর্কে কোনো প্রশ্ন থাকলে, আমাদের সাথে যোগাযোগ করুন:
              </p>
              <div className="mt-4 text-muted-foreground">
                <p>ইমেইল: privacy@ecommerce.com</p>
                <p>ফোন: +880 123 456 7890</p>
                <p>ঠিকানা: ঢাকা, বাংলাদেশ</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}