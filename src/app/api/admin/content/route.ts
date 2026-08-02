import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

// GET /api/admin/content
export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const [testimonials, faqs, brands, differentiators, stats, coverage, hours, config] = await Promise.all([
    db.testimonial.findMany({ orderBy: { sortOrder: "asc" } }),
    db.faq.findMany({ orderBy: { sortOrder: "asc" } }),
    db.brandEcosystemEntry.findMany({ orderBy: { sortOrder: "asc" } }),
    db.differentiator.findMany({ orderBy: { sortOrder: "asc" } }),
    db.stat.findMany({ orderBy: { sortOrder: "asc" } }),
    db.coverageZone.findMany({ orderBy: { sortOrder: "asc" } }),
    db.businessHour.findMany({ orderBy: { sortOrder: "asc" } }),
    db.siteConfig.findUnique({ where: { id: "singleton" } }),
  ]);

  return NextResponse.json({
    testimonials,
    faqs,
    brands,
    differentiators,
    stats,
    coverage,
    hours,
    config,
  });
}
