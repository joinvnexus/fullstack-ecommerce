import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">সেবা প্রদানের শর্তাবলী</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>শেষ আপডেট: {new Date().toLocaleDateString('bn-BD')}</CardTitle>
          </CardHeader>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>১. সাধারণ শর্তাবলী</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                এই ওয়েবসাইট ব্যবহার করে আপনি এই শর্তাবলী মেনে নিচ্ছেন। যদি আপনি এই শর্তাবলীর
                সাথে একমত না হন, তাহলে অনুগ্রহ করে এই ওয়েবসাইট ব্যবহার করবেন না।
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>২. ব্যবহারের শর্তাবলী</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-muted-foreground leading-relaxed space-y-2">
                <li>• আপনার অ্যাকাউন্ট তথ্য সঠিক এবং আপ-টু-ডেট রাখুন</li>
                <li>• অন্যের তথ্য বা পরিচয় চুরি করবেন না</li>
                <li>• ওয়েবসাইটের নিরাপত্তা ভঙ্গ করার চেষ্টা করবেন না</li>
                <li>• অর্ডার দেওয়ার সময় সব তথ্য সঠিকভাবে প্রদান করুন</li>
                <li>• কোনো অবৈধ বা হারাম কার্যকলাপে জড়িত হবেন না</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>৩. অর্ডার এবং পেমেন্ট</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-muted-foreground leading-relaxed space-y-2">
                <li>• অর্ডার কনফার্ম করার পর পরিবর্তন করা যাবে না</li>
                <li>• পেমেন্ট সফল না হলে অর্ডার ক্যান্সেল হবে</li>
                <li>• পণ্যের দাম পরিবর্তন হতে পারে, অর্ডারের সময়ের দাম প্রযোজ্য</li>
                <li>• প্রচলিত মূল্য এবং স্টক সাপেক্ষে</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>৪. ডেলিভারি এবং রিটার্ন</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-muted-foreground leading-relaxed space-y-2">
                <li>• ডেলিভারি সময় প্রোডাক্ট এবং লোকেশন অনুসারে পরিবর্তিত হয়</li>
                <li>• ডেলিভারি চার্জ অর্ডারের সময় দেখানো হয়</li>
                <li>• রিটার্ন পলিসি আলাদাভাবে নির্ধারিত</li>
                <li>• ড্যামেজড পণ্য রিটার্নের জন্য ৭ দিনের মধ্যে যোগাযোগ করুন</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>৫. বুদ্ধিবৃত্তিক সম্পত্তি</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                এই ওয়েবসাইটের সব কনটেন্ট, লোগো, এবং ডিজাইন আমাদের বুদ্ধিবৃত্তিক সম্পত্তি।
                অনুমতি ছাড়া কোনো কপি বা ব্যবহার নিষিদ্ধ।
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>৬. লাইবিলিটি</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                আমরা যতটা সম্ভব সঠিক তথ্য প্রদানের চেষ্টা করি, কিন্তু কোনো ভুল তথ্যের জন্য
                দায়ী থাকব না। ওয়েবসাইট ব্যবহারের ঝুঁকি আপনার নিজের।
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>৭. শর্তাবলী পরিবর্তন</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                আমরা যেকোনো সময় এই শর্তাবলী পরিবর্তন করতে পারি। পরিবর্তনের পর ওয়েবসাইট
                ব্যবহার করলে নতুন শর্তাবলী মেনে নেওয়া হয়।
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>৮. যোগাযোগ</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                এই শর্তাবলী সম্পর্কে কোনো প্রশ্ন থাকলে যোগাযোগ করুন:
              </p>
              <div className="mt-4 text-muted-foreground">
                <p>ইমেইল: legal@ecommerce.com</p>
                <p>ফোন: +880 123 456 7890</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}