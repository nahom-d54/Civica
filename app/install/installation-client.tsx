"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Vote,
  Shield,
  Database,
  Users,
  Settings,
  CheckCircle,
  AlertCircle,
  Loader2,
  Server,
  Globe,
  Lock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  installationSchema,
  type installationSchemaType,
} from "@/lib/validations/installation";

const INSTALLATION_STEPS = [
  {
    id: "welcome",
    title: "Welcome to Civica",
    description: "Digital Voting & Community Feedback Platform",
    icon: <Vote className="h-8 w-8 text-green-600" />,
  },
  {
    id: "system",
    title: "System Configuration",
    description: "Configure basic system settings",
    icon: <Settings className="h-8 w-8 text-blue-600" />,
  },
  //   {
  //     id: "database",
  //     title: "Database Setup",
  //     description: "Initialize database and create tables",
  //     icon: <Database className="h-8 w-8 text-purple-600" />,
  //   },
  {
    id: "admin",
    title: "Admin Account",
    description: "Create the first administrator account",
    icon: <Users className="h-8 w-8 text-orange-600" />,
  },
  {
    id: "complete",
    title: "Installation Complete",
    description: "Your Civica platform is ready to use",
    icon: <CheckCircle className="h-8 w-8 text-green-600" />,
  },
];

export default function InstallationClient() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isInstalling, setIsInstalling] = useState(false);
  const [installationProgress, setInstallationProgress] = useState(0);
  const [systemChecks, setSystemChecks] = useState({
    database: false,
    environment: false,
    permissions: false,
  });

  const form = useForm<installationSchemaType>({
    resolver: zodResolver(installationSchema),
    defaultValues: {
      siteName: "Civica",
      siteDescription: "Digital Voting & Community Feedback Platform",
      defaultLanguage: "en-us",
      name: "",
      email: "",
      faydaId: "",
      contactInfo: "",
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data: installationSchemaType) => {
    setIsInstalling(true);
    setInstallationProgress(0);

    try {
      // Step 1: System checks
      setInstallationProgress(25);
      await performSystemChecks();

      // Step 2: Database initialization
      //   setInstallationProgress(40);
      //   await initializeDatabase();

      // Step 3: Create admin user
      setInstallationProgress(50);

      // Step 4: Configure system settings
      setInstallationProgress(75);
      await configureSystem(data);

      // Step 5: Complete installation
      setInstallationProgress(100);
      setCurrentStep(4);

      toast({
        title: "Installation Complete!",
        description: "Civica has been successfully installed and configured.",
      });

      // Redirect to sign-in page after a delay
      setTimeout(() => {
        router.push("/en-us/sign-in");
      }, 3000);
    } catch (error) {
      console.error("Installation error:", error);
      toast({
        title: "Installation Failed",
        description:
          "There was an error during installation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsInstalling(false);
    }
  };

  const performSystemChecks = async () => {
    // Simulate system checks
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSystemChecks({
      database: true,
      environment: true,
      permissions: true,
    });
  };

  const configureSystem = async (data: installationSchemaType) => {
    const response = await fetch("/api/install", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("System configuration failed");
    }
  };

  const nextStep = () => {
    if (currentStep < INSTALLATION_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (isInstalling) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <div className="mb-6">
              <div className="bg-green-600 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-white animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Installing Civica
              </h2>
              <p className="text-gray-600">
                Please wait while we set up your platform...
              </p>
            </div>
            <div className="space-y-4">
              <Progress value={installationProgress} className="h-3" />
              <p className="text-sm text-gray-500">
                {installationProgress}% Complete
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <Vote className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Civica Installation
                </h1>
                <p className="text-sm text-gray-500">
                  Setup your digital civic engagement platform
                </p>
              </div>
            </div>
            <Badge variant="outline" className="bg-blue-100 text-blue-800">
              Step {currentStep + 1} of {INSTALLATION_STEPS.length}
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {INSTALLATION_STEPS.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                    index <= currentStep
                      ? "bg-green-600 text-white"
                      : index === currentStep + 1
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <div className="text-sm font-bold">{index + 1}</div>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium text-gray-900">
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500 hidden sm:block">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Progress
              value={(currentStep / (INSTALLATION_STEPS.length - 1)) * 100}
              className="h-2"
            />
          </div>
        </div>

        {/* Step Content */}
        <FormProvider {...form}>
          <Card className="mb-8">
            {currentStep === 0 && <WelcomeStep onNext={nextStep} />}
            {currentStep === 1 && (
              <SystemStep onNext={nextStep} onPrev={prevStep} />
            )}
            {currentStep === 2 && (
              <DatabaseStep
                onNext={nextStep}
                onPrev={prevStep}
                systemChecks={systemChecks}
              />
            )}
            {currentStep === 3 && (
              <AdminStep
                onSubmit={form.handleSubmit(onSubmit)}
                onPrev={prevStep}
              />
            )}
            {currentStep === 4 && <CompleteStep />}
          </Card>
        </FormProvider>
      </div>
    </div>
  );
}

function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <CardContent className="text-center py-12">
      <div className="mb-8">
        <div className="bg-green-600 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <Vote className="h-12 w-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to Civica
        </h2>
        <p className="text-xl text-gray-600 mb-6">
          Ethiopia's Digital Voting & Community Feedback Platform
        </p>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Civica empowers Ethiopian citizens to participate in democratic
          processes through secure digital voting and community feedback. Built
          with Fayda ID integration for verified, transparent civic engagement.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="text-center">
          <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <h3 className="font-semibold mb-1">Secure & Verified</h3>
          <p className="text-sm text-gray-600">
            Fayda ID integration ensures one person, one vote
          </p>
        </div>
        <div className="text-center">
          <Globe className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <h3 className="font-semibold mb-1">Multi-Language</h3>
          <p className="text-sm text-gray-600">
            Support for Amharic, English, Oromo, and Tigrinya
          </p>
        </div>
        <div className="text-center">
          <Server className="h-8 w-8 text-purple-600 mx-auto mb-2" />
          <h3 className="font-semibold mb-1">Transparent</h3>
          <p className="text-sm text-gray-600">
            Real-time results and implementation tracking
          </p>
        </div>
      </div>

      <Button
        onClick={onNext}
        size="lg"
        className="bg-green-600 hover:bg-green-700"
      >
        Start Installation
      </Button>
    </CardContent>
  );
}

function SystemStep({
  onNext,
  onPrev,
}: {
  onNext: () => void;
  onPrev: () => void;
}) {
  const form = useFormContext<installationSchemaType>();
  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-6 w-6 text-blue-600" />
          <span>System Configuration</span>
        </CardTitle>
        <CardDescription>
          Configure basic settings for your Civica installation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="siteName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Site Name</FormLabel>
                <FormControl>
                  <Input placeholder="Civica" {...field} />
                </FormControl>
                <FormDescription>
                  The name of your civic engagement platform
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="defaultLanguage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Default Language</FormLabel>
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
                    <SelectItem value="am-et">🇪🇹 አማርኛ (Amharic)</SelectItem>
                    <SelectItem value="en-us">🇺🇸 English</SelectItem>
                    <SelectItem value="or-et">🇪🇹 Afaan Oromoo</SelectItem>
                    <SelectItem value="ti-et">🇪🇹 ትግርኛ (Tigrinya)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="siteDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Site Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="Digital Voting & Community Feedback Platform"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A brief description of your platform's purpose
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <div className="space-y-4">
          <h4 className="font-medium">Platform Features</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="enableRegistration"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>User Registration</FormLabel>
                    <FormDescription>
                      Allow new users to register
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="enableFeedback"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Community Feedback</FormLabel>
                    <FormDescription>
                      Enable feedback submission
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="enableTransparency"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Transparency Dashboard</FormLabel>
                    <FormDescription>
                      Show public voting results
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div> */}

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrev}>
            Previous
          </Button>
          <Button onClick={onNext}>Next</Button>
        </div>
      </CardContent>
    </>
  );
}

function DatabaseStep({
  onNext,
  onPrev,
  systemChecks,
}: {
  onNext: () => void;
  onPrev: () => void;
  systemChecks: any;
}) {
  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="h-6 w-6 text-purple-600" />
          <span>Database Setup</span>
        </CardTitle>
        <CardDescription>
          Verify system requirements and initialize the database
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-medium">System Requirements Check</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Database className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium">Database Connection</p>
                  <p className="text-sm text-gray-600">
                    PostgreSQL database connectivity
                  </p>
                </div>
              </div>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Server className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Environment Variables</p>
                  <p className="text-sm text-gray-600">
                    Required environment configuration
                  </p>
                </div>
              </div>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Lock className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-medium">File Permissions</p>
                  <p className="text-sm text-gray-600">
                    Write access to required directories
                  </p>
                </div>
              </div>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            The database will be initialized with the required tables for users,
            proposals, votes, feedback, and administrative data. This process
            may take a few moments.
          </AlertDescription>
        </Alert>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrev}>
            Previous
          </Button>
          <Button onClick={onNext}>Initialize Database</Button>
        </div>
      </CardContent>
    </>
  );
}

function AdminStep({
  onSubmit,
  onPrev,
}: {
  onSubmit: () => void;
  onPrev: () => void;
}) {
  const form = useFormContext<installationSchemaType>();
  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-6 w-6 text-orange-600" />
          <span>Administrator Account</span>
        </CardTitle>
        <CardDescription>
          Create the first administrator account for your Civica platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Administrator Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="admin@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="faydaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fayda ID *</FormLabel>
                  <FormControl>
                    <Input placeholder="FYD001234567" {...field} />
                  </FormControl>
                  <FormDescription>
                    The administrator's verified Fayda ID
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="adminRegion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Region *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Addis Ababa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="adminWoreda"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Woreda *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Bole" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="adminRole"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin Level *</FormLabel>
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
                        <SelectItem value="kebele">Kebele Admin</SelectItem>
                        <SelectItem value="woreda">Woreda Admin</SelectItem>
                        <SelectItem value="regional">Regional Admin</SelectItem>
                        <SelectItem value="national">National Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div> */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="*********"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="*********"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="agreeToTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I agree to the Terms of Service and Privacy Policy, and
                      confirm that I have the authority to set up this civic
                      engagement platform.
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={onPrev}>
                Previous
              </Button>
              <Button type="submit">Complete Installation</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </>
  );
}

function CompleteStep() {
  return (
    <CardContent className="text-center py-12">
      <div className="mb-8">
        <div className="bg-green-600 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <CheckCircle className="h-12 w-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Installation Complete!
        </h2>
        <p className="text-xl text-gray-600 mb-6">
          Your Civica platform has been successfully installed and configured.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="text-center p-4 border rounded-lg">
          <Vote className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <h3 className="font-semibold mb-1">Ready for Voting</h3>
          <p className="text-sm text-gray-600">
            Citizens can now participate in democratic processes
          </p>
        </div>
        <div className="text-center p-4 border rounded-lg">
          <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <h3 className="font-semibold mb-1">Admin Access</h3>
          <p className="text-sm text-gray-600">
            Administrator account created and ready
          </p>
        </div>
        <div className="text-center p-4 border rounded-lg">
          <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
          <h3 className="font-semibold mb-1">Secure Platform</h3>
          <p className="text-sm text-gray-600">
            Fayda ID integration configured
          </p>
        </div>
      </div>

      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          You will be redirected to the sign-in page shortly. Use your Fayda ID
          to access the administrator panel and start creating proposals for
          your community.
        </AlertDescription>
      </Alert>

      <div className="text-sm text-gray-600">
        <p>Redirecting to sign-in page in a few seconds...</p>
      </div>
    </CardContent>
  );
}
