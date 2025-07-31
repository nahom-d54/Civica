"use server";

import { and, desc, eq, gte, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { proposals } from "@/lib/db/schema";

export const getPropsals = async (userData: any) => {
	const proposalData = await db.query.proposals.findMany({
		where: and(
			eq(proposals.isActive, true),
			eq(proposals.isDeleted, false),
			gte(proposals.endsAt, new Date()),
			or(
				eq(proposals.scope, "national"),
				and(
					eq(proposals.scope, "regional"),
					eq(proposals.target, userData?.fayda?.region as string),
				),
				and(
					eq(proposals.scope, "zoneOrSubcity"),
					eq(proposals.target, userData?.fayda?.zoneOrSubcity as string),
				),
				and(
					eq(proposals.scope, "woreda"),
					eq(proposals.target, userData?.fayda?.woreda as string),
				),
			),
		),
		orderBy: [desc(proposals.createdAt)],
		with: {
			creator: true,
		},
	});

	return proposalData;
};
