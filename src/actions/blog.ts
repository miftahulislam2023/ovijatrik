"use server";

import {prisma} from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdminAction } from "@/lib/authorization";

export async function getBlogPosts() {
  return prisma.blogPost.findMany({
    where: { deletedAt: null, published: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getBlogPostBySlug(slug: string) {
  return prisma.blogPost.findUnique({
    where: { slug },
  });
}

export async function getBlogPostById(id: string) {
  return prisma.blogPost.findUnique({
    where: { id },
  });
}

export async function createBlogPost(data: {
  titleBn: string;
  titleEn?: string;
  slug: string;
  markdownBn: string;
  markdownEn?: string;
  coverImage?: string;
  published?: boolean;
  featured?: boolean;
  readingTime?: number;
  metaTitle?: string;
  metaDescription?: string;
}) {
  await requireAdminAction();

  const post = await prisma.blogPost.create({
    data: {
      titleBn: data.titleBn,
      titleEn: data.titleEn,
      slug: data.slug,
      markdownBn: data.markdownBn,
      markdownEn: data.markdownEn,
      coverImage: data.coverImage,
      published: data.published ?? false,
      featured: data.featured ?? false,
      readingTime: data.readingTime,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
    },
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return post;
}

export async function updateBlogPost(
  id: string,
  data: Partial<{
    titleBn: string;
    titleEn?: string;
    slug: string;
    markdownBn: string;
    markdownEn?: string;
    coverImage?: string;
    published?: boolean;
    featured?: boolean;
    readingTime?: number;
    metaTitle?: string;
    metaDescription?: string;
  }>
) {
  await requireAdminAction();

  const post = await prisma.blogPost.update({
    where: { id },
    data,
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  if (data.slug) revalidatePath(`/blog/${data.slug}`);
  return post;
}

export async function softDeleteBlogPost(id: string) {
  await requireAdminAction();

  const post = await prisma.blogPost.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return post;
}

export async function duplicateBlogPost(id: string) {
  await requireAdminAction();

  const original = await prisma.blogPost.findUnique({ where: { id } });
  if (!original) return null;

  const copy = await prisma.blogPost.create({
    data: {
      titleBn: original.titleBn + " (কপি)",
      titleEn: original.titleEn ? original.titleEn + " (Copy)" : null,
      slug: original.slug + "-copy-" + Date.now().toString().slice(-4),
      markdownBn: original.markdownBn,
      markdownEn: original.markdownEn,
      coverImage: original.coverImage,
      published: false,
      featured: false,
      readingTime: original.readingTime,
      metaTitle: original.metaTitle,
      metaDescription: original.metaDescription,
    },
  });

  revalidatePath("/admin/blog");
  return copy;
}
