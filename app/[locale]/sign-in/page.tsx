"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Shield, Vote } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { signInSchema, type SignInFormData } from "@/lib/validations/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LanguageSwitcher } from "@/components/language-switcher";

export default function SignInPage() {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { locale } = useParams();

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      faydaId: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);
    setError("");

    try {
      // In a real implementation, this would authenticate with Fayda ID
      // For demo purposes, we'll use email/password with mock Fayda IDs
      const mockEmail = `${data.faydaId}@fayda.gov.et`;

      await authClient.signIn.email({
        email: mockEmail,
        password: data.password || "demo123",
      });

      router.push(`/${locale}/dashboard`);
    } catch (err) {
      setError(t("auth.invalidCredentials"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-end">
          <LanguageSwitcher />
        </div>

        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <div className="bg-green-600 p-2 rounded-lg">
              <Vote className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t("dashboard.title")}
            </h1>
          </div>
          <p className="text-gray-600">{t("dashboard.subtitle")}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span>{t("auth.signInWithFayda")}</span>
            </CardTitle>
            <CardDescription>{t("dashboard.welcome")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="faydaId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("auth.faydaId")}</FormLabel>
                      <FormControl>
                        <Input placeholder="FYD001234567" {...field} />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-gray-500">
                        {t("auth.demoIds")}: FYD001234567, FYD001234568,
                        FYD001234569, FYD001234572 (admin)
                      </p>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("auth.pin")}</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder={t("auth.enterPin")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-gray-500">
                        {t("auth.demoPassword")}
                      </p>
                    </FormItem>
                  )}
                />

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("auth.authenticating")}
                    </>
                  ) : (
                    t("auth.signInWithFayda")
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">
                {t("auth.whyFayda")}
              </h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>{t("auth.faydaBenefits.onePersonOneVote")}</li>
                <li>{t("auth.faydaBenefits.biometricVerification")}</li>
                <li>{t("auth.faydaBenefits.preventsFakeAccounts")}</li>
                <li>{t("auth.faydaBenefits.buildsTrust")}</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
