import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">আমাদের সম্পর্কে</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>আমাদের গল্প</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              আমরা একটি আধুনিক ই-কমার্স প্ল্যাটফর্ম যা গ্রাহকদের জন্য সেরা অনলাইন শপিং অভিজ্ঞতা প্রদান করার জন্য প্রতিশ্রুতিবদ্ধ।
              আমাদের লক্ষ্য হলো উচ্চমানের পণ্য, দ্রুত ডেলিভারি এবং অসাধারণ গ্রাহক সেবা প্রদান করা।
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>আমাদের মিশন</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                গ্রাহকদের জন্য সহজ এবং বিশ্বস্ত অনলাইন শপিং অভিজ্ঞতা তৈরি করা, যেখানে প্রত্যেক গ্রাহকের চাহিদা প্রাধান্য পায়।
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>আমাদের ভিশন</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                বাংলাদেশের সবচেয়ে বিশ্বস্ত এবং প্রিয় ই-কমার্স প্ল্যাটফর্ম হয়ে উঠতে, যেখানে প্রযুক্তি এবং মানবিক সেবা একসাথে কাজ করে।
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>যোগাযোগ করুন</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">অফিস</h4>
                <p className="text-muted-foreground">
                  ঢাকা, বাংলাদেশ<br />
                  ইমেইল: info@ecommerce.com<br />
                  ফোন: +880 123 456 7890
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">বিজনেস ঘণ্টা</h4>
                <p className="text-muted-foreground">
                  সোমবার - শুক্রবার: ৯:০০ AM - ৬:০০ PM<br />
                  শনিবার: ৯:০০ AM - ২:০০ PM<br />
                  রবিবার: বন্ধ
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}