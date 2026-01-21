import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function ReturnsRefundsPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">রিটার্ন এবং রিফান্ড পলিসি</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>শেষ আপডেট: {new Date().toLocaleDateString('bn-BD')}</CardTitle>
          </CardHeader>
        </Card>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">যোগ্য পণ্য রিটার্ন</h3>
              <p className="text-sm text-muted-foreground">
                ড্যামেজড বা ভুল পণ্য রিটার্ন করা যাবে
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Clock className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">৭ দিনের মধ্যে</h3>
              <p className="text-sm text-muted-foreground">
                ডেলিভারির তারিখ থেকে ৭ দিনের মধ্যে রিটার্ন করুন
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">অযোগ্য পণ্য</h3>
              <p className="text-sm text-muted-foreground">
                ব্যবহৃত বা ড্যামেজড পণ্য রিটার্ন করা যাবে না
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>রিটার্নের শর্তাবলী</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">যোগ্য পণ্য</h4>
                    <p className="text-sm text-muted-foreground">
                      ড্যামেজড, ভুল পণ্য, বা ম্যানুফ্যাকচারিং ত্রুটিযুক্ত পণ্য রিটার্ন করা যাবে।
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">অযোগ্য পণ্য</h4>
                    <p className="text-sm text-muted-foreground">
                      খোলা, ব্যবহৃত, বা গ্রাহকের দোষে ড্যামেজড পণ্য রিটার্ন করা যাবে না।
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">সময়সীমা</h4>
                    <p className="text-sm text-muted-foreground">
                      ডেলিভারির তারিখ থেকে ৭ কার্যদিবসের মধ্যে রিটার্ন রিকোয়েস্ট করতে হবে।
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>রিটার্ন প্রক্রিয়া</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
                <li>support@ecommerce.com-এ ইমেইল করে বা কাস্টমার কেয়ারে ফোন করে রিটার্ন রিকোয়েস্ট করুন</li>
                <li>আপনার অর্ডার নম্বর এবং সমস্যার বিস্তারিত বিবরণ প্রদান করুন</li>
                <li>আমাদের টিম আপনার রিকোয়েস্ট যাচাই করবে</li>
                <li>যোগ্য হলে পিকআপ এরেঞ্জমেন্ট করা হবে</li>
                <li>পণ্য পাওয়ার পর রিফান্ড প্রসেস করা হবে</li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>রিফান্ড প্রক্রিয়া</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">রিফান্ডের ধরন</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <strong>ফুল রিফান্ড:</strong> ভুল বা ড্যামেজড পণ্যের জন্য</li>
                    <li>• <strong>পারশিয়াল রিফান্ড:</strong> কিছু ক্ষেত্রে</li>
                    <li>• <strong>এক্সচেঞ্জ:</strong> একই মূল্যের পণ্যের সাথে</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">রিফান্ড টাইমলাইন</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <strong>কার্ড পেমেন্ট:</strong> ৫-৭ কার্যদিবস</li>
                    <li>• <strong>মোবাইল ব্যাংকিং:</strong> ২-৩ কার্যদিবস</li>
                    <li>• <strong>ক্যাশ অন ডেলিভারি:</strong> রিটার্ন কমপ্লিট হওয়ার পর</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>বিশেষ নোট</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-muted-foreground">
                <p>• রিটার্নের জন্য পণ্যের অরিজিনাল প্যাকেজিং এবং ট্যাগ থাকতে হবে</p>
                <p>• পিকআপ চার্জ গ্রাহককে বহন করতে হবে (যদি রিটার্ন যোগ্য না হয়)</p>
                <p>• সিজনাল আইটেমের জন্য আলাদা পলিসি প্রযোজ্য</p>
                <p>• বড় আকারের পণ্যের জন্য বিশেষ এরেঞ্জমেন্ট করা হয়</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>যোগাযোগ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground">
                <p className="mb-2">রিটার্ন বা রিফান্ড সম্পর্কে কোনো প্রশ্ন থাকলে যোগাযোগ করুন:</p>
                <div className="space-y-1">
                  <p>ইমেইল: returns@ecommerce.com</p>
                  <p>ফোন: +880 123 456 7890 (কাস্টমার কেয়ার)</p>
                  <p>অফিস ঘণ্টা: সোমবার - শুক্রবার, ৯:০০ AM - ৬:০০ PM</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}