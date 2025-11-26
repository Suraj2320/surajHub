import { Link } from "wouter";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPolicy() {
  const sections = [
    {
      title: "1. Introduction",
      content: "SurajHub ('we', 'us', 'our' or 'Company') operates the SurajHub website. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data."
    },
    {
      title: "2. Information Collection and Use",
      subsections: [
        {
          subtitle: "2.1 Personal Data",
          content: "We collect the following types of personal information: Name, email address, phone number, postal address, payment information, browsing history, search queries, product preferences, and device information."
        },
        {
          subtitle: "2.2 Usage Data",
          content: "We automatically collect certain information about your device when you access our Service, including IP address, browser type, pages visited, time and date stamps, and referring/exit pages."
        },
        {
          subtitle: "2.3 Cookies and Tracking",
          content: "We use cookies and similar tracking technologies to track activity on our Service and hold certain information. You have the option to refuse cookies, but this may affect your ability to access certain features."
        }
      ]
    },
    {
      title: "3. Use of Data",
      subsections: [
        {
          subtitle: "3.1 SurajHub uses the collected data for various purposes:",
          content: "• To provide and maintain our Service\n• To notify you about changes to our Service\n• To allow you to participate in interactive features\n• To provide customer support\n• To gather analysis or valuable information for service improvement\n• To monitor usage patterns and detect fraudulent activity\n• To personalize your shopping experience"
        }
      ]
    },
    {
      title: "4. Security of Data",
      content: "The security of your data is important to us, but remember that no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security. All payments are processed through secure SSL encrypted connections. Your credit card information is never stored on our servers."
    },
    {
      title: "5. Third-Party Services",
      subsections: [
        {
          subtitle: "5.1 Payment Processing",
          content: "Payment processing is handled by Stripe, a PCI-DSS compliant third party. We do not store your complete payment card details."
        },
        {
          subtitle: "5.2 Analytics",
          content: "We use third-party analytics services to understand how users interact with our platform. These services may collect and analyze usage data."
        },
        {
          subtitle: "5.3 Third-Party Links",
          content: "Our Service may contain links to other sites that are not operated by us. This Privacy Policy applies only to our Service. We strongly advise you to review the privacy policy of every site you visit."
        }
      ]
    },
    {
      title: "6. Children's Privacy",
      content: "Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under 13. If we become aware that we have collected personal data from children under 13, we take steps to remove such information immediately."
    },
    {
      title: "7. Your Rights",
      subsections: [
        {
          subtitle: "7.1 Right to Access",
          content: "You have the right to request access to the personal data we hold about you."
        },
        {
          subtitle: "7.2 Right to Correction",
          content: "You have the right to request that we correct any inaccurate or incomplete personal data."
        },
        {
          subtitle: "7.3 Right to Deletion",
          content: "You have the right to request deletion of your personal data, subject to legal retention requirements."
        },
        {
          subtitle: "7.4 Right to Data Portability",
          content: "You have the right to request a copy of your personal data in a portable format."
        }
      ]
    },
    {
      title: "8. Changes to This Privacy Policy",
      content: "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'effective date' at the top of this Privacy Policy. Your continued use of the Service following the posting of revised Privacy Policy means that you accept and agree to the changes."
    },
    {
      title: "9. Contact Us",
      content: "If you have any questions about this Privacy Policy, please contact us at: privacy@shophub.com or call our support team at 1800-123-4567. We typically respond to privacy inquiries within 30 days."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      <section className="bg-gradient-to-r from-primary/20 via-accent/10 to-primary/10 py-8 md:py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center gap-2 mb-4 text-muted-foreground text-sm">
            <Link href="/">
              <span className="hover:text-foreground cursor-pointer">Home</span>
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="font-semibold text-foreground">Privacy Policy</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-4">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">Last updated: November 2025</p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="space-y-8">
            {sections.map((section, idx) => (
              <Card key={idx} className="border-0 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow" data-testid={`policy-section-${idx}`}>
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                    <span className="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full" />
                    {section.title}
                  </h2>
                  
                  {section.content && (
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line mb-4">
                      {section.content}
                    </p>
                  )}
                  
                  {section.subsections && (
                    <div className="space-y-4 ml-4">
                      {section.subsections.map((sub, subIdx) => (
                        <div key={subIdx}>
                          <h3 className="font-semibold text-foreground mb-2 text-lg">
                            {sub.subtitle}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                            {sub.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 mt-8">
            <CardContent className="p-6 md:p-8 text-center">
              <h3 className="text-xl font-bold mb-2">Have Questions About Your Privacy?</h3>
              <p className="text-muted-foreground mb-4">
                Our Data Protection Officer is here to help. Contact us anytime.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="mailto:privacy@shophub.com" className="text-primary font-semibold hover:underline">
                  privacy@shophub.com
                </a>
                <span className="hidden sm:block text-muted-foreground">•</span>
                <span className="font-semibold">1800-123-4567</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
