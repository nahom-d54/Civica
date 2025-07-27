"use client"

import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Vote, Shield, BarChart3, MessageSquare, Globe, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { LanguageSwitcher } from "@/components/language-switcher"

interface LandingPageProps {
  locale: string
}

export default function LandingPage({ locale }: LandingPageProps) {
  const t = useTranslations()
  const router = useRouter()

  const features = [
    {
      icon: <Vote className="h-8 w-8 text-green-600" />,
      title: t("landing.features.voting.title"),
      description: t("landing.features.voting.description"),
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-blue-600" />,
      title: t("landing.features.feedback.title"),
      description: t("landing.features.feedback.description"),
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-purple-600" />,
      title: t("landing.features.transparency.title"),
      description: t("landing.features.transparency.description"),
    },
    {
      icon: <Shield className="h-8 w-8 text-orange-600" />,
      title: t("landing.features.security.title"),
      description: t("landing.features.security.description"),
    },
  ]

  const steps = [
    {
      number: "01",
      title: t("landing.howItWorks.step1.title"),
      description: t("landing.howItWorks.step1.description"),
    },
    {
      number: "02",
      title: t("landing.howItWorks.step2.title"),
      description: t("landing.howItWorks.step2.description"),
    },
    {
      number: "03",
      title: t("landing.howItWorks.step3.title"),
      description: t("landing.howItWorks.step3.description"),
    },
    {
      number: "04",
      title: t("landing.howItWorks.step4.title"),
      description: t("landing.howItWorks.step4.description"),
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <Vote className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{t("dashboard.title")}</h1>
                <p className="text-sm text-gray-500">{t("dashboard.subtitle")}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <Button variant="outline" onClick={() => router.push(`/${locale}/sign-in`)}>
                {t("auth.signIn")}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4 bg-green-100 text-green-800">
            <Globe className="h-4 w-4 mr-2" />
            {t("landing.hero.badge")}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">{t("landing.hero.title")}</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">{t("landing.hero.subtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
              onClick={() => router.push(`/${locale}/sign-in`)}
            >
              <Shield className="mr-2 h-5 w-5" />
              {t("landing.hero.cta")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-3 bg-transparent">
              {t("landing.hero.learnMore")}
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t("landing.features.title")}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t("landing.features.subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t("landing.howItWorks.title")}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t("landing.howItWorks.subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">50,000+</div>
              <div className="text-green-100">{t("landing.stats.citizens")}</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1,200+</div>
              <div className="text-green-100">{t("landing.stats.proposals")}</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">85%</div>
              <div className="text-green-100">{t("landing.stats.participation")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t("landing.cta.title")}</h2>
          <p className="text-xl text-gray-600 mb-8">{t("landing.cta.subtitle")}</p>
          <Button
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            onClick={() => router.push(`/${locale}/sign-in`)}
          >
            <Shield className="mr-2 h-5 w-5" />
            {t("landing.cta.button")}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-green-600 p-2 rounded-lg">
                  <Vote className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{t("dashboard.title")}</h3>
                  <p className="text-gray-400">{t("dashboard.subtitle")}</p>
                </div>
              </div>
              <p className="text-gray-400 mb-4">{t("landing.footer.description")}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t("landing.footer.links")}</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    {t("landing.footer.about")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    {t("landing.footer.privacy")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    {t("landing.footer.terms")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    {t("landing.footer.support")}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t("landing.footer.contact")}</h4>
              <ul className="space-y-2 text-gray-400">
                <li>info@civica.gov.et</li>
                <li>+251 11 123 4567</li>
                <li>Addis Ababa, Ethiopia</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; 2024 {t("dashboard.title")}. {t("landing.footer.rights")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
