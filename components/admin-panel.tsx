// "use client"
// import { useState } from "react"
// import { useTranslations } from "next-intl"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Plus, Settings, Users, BarChart3, MessageSquare, Calendar, MapPin } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"
// import { proposalSchema, proposalSchemaType} from "@/lib/validations/proposal"
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// interface AdminPanelProps {
//   adminRole: any
// }

// export default function AdminPanel({ adminRole }: AdminPanelProps) {
//   const t = useTranslations()
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const { toast } = useToast()

//   const form = useForm<proposalSchemaType>({
//     resolver: zodResolver(proposalSchema),
//     defaultValues: {
//       title: "",
//       description: "",
//       category: undefined,
//       regionScope: undefined,
//       targetRegion: "",
//       duration: "30",
//     },
//   })

//   const onSubmit = async (data: proposalSchemaType) => {
//     setIsSubmitting(true)

//     try {
//       const response = await fetch("/api/admin/proposals", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           ...data,
//           startsAt: new Date().toISOString(),
//           endsAt: new Date(Date.now() + Number.parseInt(data.duration) * 24 * 60 * 60 * 1000).toISOString(),
//         }),
//       })

//       if (response.ok) {
//         toast({
//           title: t("admin.proposalCreated"),
//           description: t("admin.proposalCreatedDesc"),
//         })

//         // Reset form
//         form.reset()
//       } else {
//         throw new Error("Failed to create proposal")
//       }
//     } catch (error) {
//       toast({
//         title: t("errors.serverError"),
//         description: t("errors.networkError"),
//         variant: "destructive",
//       })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   // Mock data for admin dashboard
//   const adminStats = {
//     totalProposals: 12,
//     activeVotes: 1247,
//     pendingFeedback: 23,
//     completedProjects: 8,
//   }

//   const recentFeedback = [
//     {
//       id: "1",
//       title: "Street Light Issue",
//       category: "complaint",
//       priority: "high",
//       status: "pending",
//       submittedAt: "2024-01-15T10:30:00Z",
//       region: "Addis Ababa",
//       woreda: "Bole",
//     },
//     {
//       id: "2",
//       title: "Public Transport Improvement",
//       category: "suggestion",
//       priority: "medium",
//       status: "reviewed",
//       submittedAt: "2024-01-14T14:20:00Z",
//       region: "Addis Ababa",
//       woreda: "Kirkos",
//     },
//   ]

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900">{t("admin.title")}</h2>
//           <p className="text-gray-600">{t("admin.subtitle")}</p>
//         </div>
//         <Badge variant="secondary" className="bg-blue-100 text-blue-800">
//           {adminRole.role} {t("admin.role")} • {adminRole.assignedRegion}
//         </Badge>
//       </div>

//       {/* Admin Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">{t("admin.totalProposals")}</p>
//                 <p className="text-2xl font-bold text-gray-900">{adminStats.totalProposals}</p>
//               </div>
//               <Settings className="h-8 w-8 text-blue-600" />
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">{t("admin.activeVotes")}</p>
//                 <p className="text-2xl font-bold text-gray-900">{adminStats.activeVotes}</p>
//               </div>
//               <BarChart3 className="h-8 w-8 text-green-600" />
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">{t("admin.pendingFeedback")}</p>
//                 <p className="text-2xl font-bold text-gray-900">{adminStats.pendingFeedback}</p>
//               </div>
//               <MessageSquare className="h-8 w-8 text-orange-600" />
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">{t("admin.completedProjects")}</p>
//                 <p className="text-2xl font-bold text-gray-900">{adminStats.completedProjects}</p>
//               </div>
//               <Users className="h-8 w-8 text-purple-600" />
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <Tabs defaultValue="create" className="space-y-6">
//         <TabsList className="grid w-full grid-cols-3">
//           <TabsTrigger value="create">{t("admin.createProposal")}</TabsTrigger>
//           <TabsTrigger value="feedback">{t("admin.manageFeedback")}</TabsTrigger>
//           <TabsTrigger value="analytics">{t("admin.analytics")}</TabsTrigger>
//         </TabsList>

//         <TabsContent value="create">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center space-x-2">
//                 <Plus className="h-5 w-5 text-green-600" />
//                 <span>{t("admin.createNewProposal")}</span>
//               </CardTitle>
//               <CardDescription>{t("admin.createProposalDesc")}</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Form {...form}>
//                 <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//                   <FormField
//                     control={form.control}
//                     name="title"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>{t("admin.proposalTitle")}</FormLabel>
//                         <FormControl>
//                           <Input placeholder={t("admin.proposalTitlePlaceholder")} {...field} />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="description"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>{t("admin.description")}</FormLabel>
//                         <FormControl>
//                           <Textarea placeholder={t("admin.descriptionPlaceholder")} rows={4} {...field} />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <FormField
//                       control={form.control}
//                       name="category"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>{t("admin.category")}</FormLabel>
//                           <Select onValueChange={field.onChange} defaultValue={field.value}>
//                             <FormControl>
//                               <SelectTrigger>
//                                 <SelectValue placeholder={t("admin.category")} />
//                               </SelectTrigger>
//                             </FormControl>
//                             <SelectContent>
//                               <SelectItem value="infrastructure">{t("voting.categories.infrastructure")}</SelectItem>
//                               <SelectItem value="budget">{t("voting.categories.budget")}</SelectItem>
//                               <SelectItem value="policy">{t("voting.categories.policy")}</SelectItem>
//                               <SelectItem value="development">{t("voting.categories.development")}</SelectItem>
//                               <SelectItem value="other">{t("voting.categories.other")}</SelectItem>
//                             </SelectContent>
//                           </Select>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name="regionScope"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>{t("admin.scope")}</FormLabel>
//                           <Select onValueChange={field.onChange} defaultValue={field.value}>
//                             <FormControl>
//                               <SelectTrigger>
//                                 <SelectValue placeholder={t("admin.scope")} />
//                               </SelectTrigger>
//                             </FormControl>
//                             <SelectContent>
//                               <SelectItem value="kebele">{t("voting.scopes.kebele")}</SelectItem>
//                               <SelectItem value="woreda">{t("voting.scopes.woreda")}</SelectItem>
//                               <SelectItem value="regional">{t("voting.scopes.regional")}</SelectItem>
//                               <SelectItem value="national">{t("voting.scopes.national")}</SelectItem>
//                             </SelectContent>
//                           </Select>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name="targetRegion"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>{t("admin.targetRegion")}</FormLabel>
//                           <FormControl>
//                             <Input placeholder={t("admin.targetRegionPlaceholder")} {...field} />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>

//                   <FormField
//                     control={form.control}
//                     name="duration"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>{t("admin.votingDuration")}</FormLabel>
//                         <Select onValueChange={field.onChange} defaultValue={field.value}>
//                           <FormControl>
//                             <SelectTrigger>
//                               <SelectValue />
//                             </SelectTrigger>
//                           </FormControl>
//                           <SelectContent>
//                             <SelectItem value="7">{t("admin.durations.7")}</SelectItem>
//                             <SelectItem value="14">{t("admin.durations.14")}</SelectItem>
//                             <SelectItem value="30">{t("admin.durations.30")}</SelectItem>
//                             <SelectItem value="45">{t("admin.durations.45")}</SelectItem>
//                             <SelectItem value="60">{t("admin.durations.60")}</SelectItem>
//                           </SelectContent>
//                         </Select>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <Button type="submit" className="w-full" disabled={isSubmitting}>
//                     {isSubmitting ? t("admin.creating") : t("admin.createProposal")}
//                   </Button>
//                 </form>
//               </Form>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="feedback">
//           <Card>
//             <CardHeader>
//               <CardTitle>{t("admin.manageCommunityFeedback")}</CardTitle>
//               <CardDescription>{t("admin.reviewAndRespond")}</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {recentFeedback.map((feedback) => (
//                   <div key={feedback.id} className="border rounded-lg p-4 space-y-3">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <h4 className="font-medium text-gray-900">{feedback.title}</h4>
//                         <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
//                           <MapPin className="h-3 w-3" />
//                           <span>
//                             {feedback.region}, {feedback.woreda}
//                           </span>
//                           <span>•</span>
//                           <Calendar className="h-3 w-3" />
//                           <span>{new Date(feedback.submittedAt).toLocaleDateString()}</span>
//                         </div>
//                       </div>
//                       <div className="flex space-x-2">
//                         <Badge variant="outline" className="capitalize">
//                           {t(`feedback.categories.${feedback.category}`)}
//                         </Badge>
//                         <Badge
//                           className={
//                             feedback.priority === "high"
//                               ? "bg-red-100 text-red-800"
//                               : feedback.priority === "medium"
//                                 ? "bg-yellow-100 text-yellow-800"
//                                 : "bg-gray-100 text-gray-800"
//                           }
//                         >
//                           {t(`feedback.priorities.${feedback.priority}`)}
//                         </Badge>
//                         <Badge
//                           className={
//                             feedback.status === "pending"
//                               ? "bg-yellow-100 text-yellow-800"
//                               : feedback.status === "reviewed"
//                                 ? "bg-blue-100 text-blue-800"
//                                 : "bg-green-100 text-green-800"
//                           }
//                         >
//                           {t(`feedback.statuses.${feedback.status}`)}
//                         </Badge>
//                       </div>
//                     </div>
//                     <div className="flex space-x-2">
//                       <Button size="sm" variant="outline">
//                         {t("admin.review")}
//                       </Button>
//                       <Button size="sm" variant="outline">
//                         {t("admin.assign")}
//                       </Button>
//                       <Button size="sm" variant="outline">
//                         {t("admin.respond")}
//                       </Button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="analytics">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>{t("admin.votingParticipation")}</CardTitle>
//                 <CardDescription>{t("admin.participationRates")}</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm font-medium">Addis Ababa</span>
//                     <span className="text-sm">78%</span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm font-medium">Oromia</span>
//                     <span className="text-sm">65%</span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm font-medium">Amhara</span>
//                     <span className="text-sm">72%</span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>{t("admin.feedbackCategories")}</CardTitle>
//                 <CardDescription>{t("admin.feedbackDistribution")}</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm font-medium">{t("admin.complaints")}</span>
//                     <span className="text-sm">45%</span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm font-medium">{t("admin.suggestions")}</span>
//                     <span className="text-sm">30%</span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm font-medium">{t("admin.reports")}</span>
//                     <span className="text-sm">25%</span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }
