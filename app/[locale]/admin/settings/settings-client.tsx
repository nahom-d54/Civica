"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Settings, Shield, Database, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { defaultLocale, locales } from "@/lib/constants";

const systemSettingsSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  siteDescription: z.string().min(1, "Site description is required"),
  maintenanceMode: z.boolean(),
  registrationEnabled: z.boolean(),
  votingEnabled: z.boolean(),
  feedbackEnabled: z.boolean(),
  defaultLanguage: z.string(),
  supportedLanguages: z.array(z.literal(locales)),
  maxProposalsPerUser: z.number().min(1),
  votingDuration: z.number().min(1),
  requireEmailVerification: z.boolean(),
  enableNotifications: z.boolean(),
});

const securitySettingsSchema = z.object({
  sessionTimeout: z.number().min(15),
  maxLoginAttempts: z.number().min(3),
  passwordMinLength: z.number().min(6),
  requireTwoFactor: z.boolean(),
  allowedDomains: z.string().optional(),
  ipWhitelist: z.string().optional(),
});

const emailSettingsSchema = z.object({
  smtpHost: z.string().min(1, "SMTP host is required"),
  smtpPort: z.number().min(1),
  smtpUsername: z.string().min(1, "SMTP username is required"),
  smtpPassword: z.string().min(1, "SMTP password is required"),
  fromEmail: z.string().email("Valid email is required"),
  fromName: z.string().min(1, "From name is required"),
  enableEmailNotifications: z.boolean(),
});

interface SettingsClientProps {
  locale: string;
  adminRole: any;
}

export default function SettingsClient({
  locale,
  adminRole,
}: SettingsClientProps) {
  const t = useTranslations();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const systemForm = useForm<z.infer<typeof systemSettingsSchema>>({
    resolver: zodResolver(systemSettingsSchema),
    defaultValues: {
      siteName: "Civica",
      siteDescription: "Digital voting and community feedback platform",
      maintenanceMode: false,
      registrationEnabled: true,
      votingEnabled: true,
      feedbackEnabled: true,
      defaultLanguage: defaultLocale,
      supportedLanguages: [...locales],
      maxProposalsPerUser: 5,
      votingDuration: 30,
      requireEmailVerification: true,
      enableNotifications: true,
    },
  });

  const securityForm = useForm<z.infer<typeof securitySettingsSchema>>({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: {
      sessionTimeout: 60,
      maxLoginAttempts: 5,
      passwordMinLength: 8,
      requireTwoFactor: false,
      allowedDomains: "",
      ipWhitelist: "",
    },
  });

  const emailForm = useForm<z.infer<typeof emailSettingsSchema>>({
    resolver: zodResolver(emailSettingsSchema),
    defaultValues: {
      smtpHost: "",
      smtpPort: 587,
      smtpUsername: "",
      smtpPassword: "",
      fromEmail: "",
      fromName: "Civica Platform",
      enableEmailNotifications: true,
    },
  });

  //   useEffect(() => {
  //     fetchSettings();
  //   }, []);

  //   const fetchSettings = async () => {
  //     try {
  //       const response = await fetch("/api/admin/settings");
  //       if (response.ok) {
  //         const data = await response.json();
  //         systemForm.reset(data.system);
  //         securityForm.reset(data.security);
  //         emailForm.reset(data.email);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching settings:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  const onSystemSubmit = async (
    values: z.infer<typeof systemSettingsSchema>
  ) => {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/settings/system", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        toast({
          title: t("admin.settings.systemSettingsUpdated"),
          description: t("admin.settings.systemSettingsUpdatedDescription"),
        });
      } else {
        throw new Error("Failed to update system settings");
      }
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("admin.settings.updateError"),
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const onSecuritySubmit = async (
    values: z.infer<typeof securitySettingsSchema>
  ) => {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/settings/security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        toast({
          title: t("admin.settings.securitySettingsUpdated"),
          description: t("admin.settings.securitySettingsUpdatedDescription"),
        });
      } else {
        throw new Error("Failed to update security settings");
      }
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("admin.settings.updateError"),
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const onEmailSubmit = async (values: z.infer<typeof emailSettingsSchema>) => {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/settings/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        toast({
          title: t("admin.settings.emailSettingsUpdated"),
          description: t("admin.settings.emailSettingsUpdatedDescription"),
        });
      } else {
        throw new Error("Failed to update email settings");
      }
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("admin.settings.updateError"),
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const testEmailConnection = async () => {
    try {
      const response = await fetch("/api/admin/settings/test-email", {
        method: "POST",
      });

      if (response.ok) {
        toast({
          title: t("admin.settings.emailTestSuccess"),
          description: t("admin.settings.emailTestSuccessDescription"),
        });
      } else {
        throw new Error("Email test failed");
      }
    } catch (error) {
      toast({
        title: t("admin.settings.emailTestFailed"),
        description: t("admin.settings.emailTestFailedDescription"),
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">{t("common.loading")}</div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="system" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="system" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>{t("admin.settings.system")}</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>{t("admin.settings.security")}</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center space-x-2">
            <Mail className="h-4 w-4" />
            <span>{t("admin.settings.email")}</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span>{t("admin.settings.advanced")}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                {t("admin.settings.systemConfiguration")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...systemForm}>
                <form
                  onSubmit={systemForm.handleSubmit(onSystemSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={systemForm.control}
                      name="siteName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("admin.settings.siteName")}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={systemForm.control}
                      name="defaultLanguage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t("admin.settings.defaultLanguage")}
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="am">አማርኛ (Amharic)</SelectItem>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="or">Oromiffa</SelectItem>
                              <SelectItem value="ti">
                                ትግርኛ (Tigrinya)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={systemForm.control}
                    name="siteDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("admin.settings.siteDescription")}
                        </FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={systemForm.control}
                      name="maxProposalsPerUser"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t("admin.settings.maxProposalsPerUser")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number.parseInt(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={systemForm.control}
                      name="votingDuration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t("admin.settings.votingDuration")} (days)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number.parseInt(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      {t("admin.settings.featureToggles")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={systemForm.control}
                        name="maintenanceMode"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                {t("admin.settings.maintenanceMode")}
                              </FormLabel>
                              <FormDescription>
                                {t("admin.settings.maintenanceModeDescription")}
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={systemForm.control}
                        name="registrationEnabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                {t("admin.settings.registrationEnabled")}
                              </FormLabel>
                              <FormDescription>
                                {t(
                                  "admin.settings.registrationEnabledDescription"
                                )}
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={systemForm.control}
                        name="votingEnabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                {t("admin.settings.votingEnabled")}
                              </FormLabel>
                              <FormDescription>
                                {t("admin.settings.votingEnabledDescription")}
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={systemForm.control}
                        name="feedbackEnabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                {t("admin.settings.feedbackEnabled")}
                              </FormLabel>
                              <FormDescription>
                                {t("admin.settings.feedbackEnabledDescription")}
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={saving}>
                    {saving
                      ? t("common.saving")
                      : t("admin.settings.saveSystemSettings")}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                {t("admin.settings.securityConfiguration")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...securityForm}>
                <form
                  onSubmit={securityForm.handleSubmit(onSecuritySubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={securityForm.control}
                      name="sessionTimeout"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t("admin.settings.sessionTimeout")} (minutes)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number.parseInt(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={securityForm.control}
                      name="maxLoginAttempts"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t("admin.settings.maxLoginAttempts")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number.parseInt(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={securityForm.control}
                    name="passwordMinLength"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("admin.settings.passwordMinLength")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number.parseInt(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={securityForm.control}
                    name="allowedDomains"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("admin.settings.allowedDomains")}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="example.com, company.org"
                            rows={3}
                          />
                        </FormControl>
                        <FormDescription>
                          {t("admin.settings.allowedDomainsDescription")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={securityForm.control}
                    name="ipWhitelist"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("admin.settings.ipWhitelist")}</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="192.168.1.0/24, 10.0.0.1"
                            rows={3}
                          />
                        </FormControl>
                        <FormDescription>
                          {t("admin.settings.ipWhitelistDescription")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={securityForm.control}
                    name="requireTwoFactor"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            {t("admin.settings.requireTwoFactor")}
                          </FormLabel>
                          <FormDescription>
                            {t("admin.settings.requireTwoFactorDescription")}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={saving}>
                    {saving
                      ? t("common.saving")
                      : t("admin.settings.saveSecuritySettings")}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                {t("admin.settings.emailConfiguration")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...emailForm}>
                <form
                  onSubmit={emailForm.handleSubmit(onEmailSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={emailForm.control}
                      name="smtpHost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("admin.settings.smtpHost")}</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="smtp.gmail.com" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={emailForm.control}
                      name="smtpPort"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("admin.settings.smtpPort")}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number.parseInt(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={emailForm.control}
                      name="smtpUsername"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t("admin.settings.smtpUsername")}
                          </FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={emailForm.control}
                      name="smtpPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t("admin.settings.smtpPassword")}
                          </FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={emailForm.control}
                      name="fromEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("admin.settings.fromEmail")}</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              {...field}
                              placeholder="noreply@civica.gov.et"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={emailForm.control}
                      name="fromName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("admin.settings.fromName")}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={emailForm.control}
                    name="enableEmailNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            {t("admin.settings.enableEmailNotifications")}
                          </FormLabel>
                          <FormDescription>
                            {t(
                              "admin.settings.enableEmailNotificationsDescription"
                            )}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="flex space-x-4">
                    <Button type="submit" disabled={saving}>
                      {saving
                        ? t("common.saving")
                        : t("admin.settings.saveEmailSettings")}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={testEmailConnection}
                    >
                      {t("admin.settings.testEmailConnection")}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                {t("admin.settings.advancedConfiguration")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {t("admin.settings.databaseMaintenance")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                      >
                        {t("admin.settings.optimizeDatabase")}
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                      >
                        {t("admin.settings.backupDatabase")}
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                      >
                        {t("admin.settings.cleanupLogs")}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {t("admin.settings.systemMaintenance")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                      >
                        {t("admin.settings.clearCache")}
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                      >
                        {t("admin.settings.regenerateKeys")}
                      </Button>
                      <Button variant="destructive" className="w-full">
                        {t("admin.settings.resetSystem")}
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {t("admin.settings.systemInformation")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>{t("admin.settings.version")}:</strong> 1.0.0
                      </div>
                      <div>
                        <strong>{t("admin.settings.environment")}:</strong>{" "}
                        Production
                      </div>
                      <div>
                        <strong>{t("admin.settings.database")}:</strong>{" "}
                        PostgreSQL 15.0
                      </div>
                      <div>
                        <strong>{t("admin.settings.uptime")}:</strong> 15 days,
                        4 hours
                      </div>
                      <div>
                        <strong>{t("admin.settings.diskUsage")}:</strong> 2.3 GB
                        / 100 GB
                      </div>
                      <div>
                        <strong>{t("admin.settings.memoryUsage")}:</strong> 1.2
                        GB / 4 GB
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
