import { NextResponse } from "next/server";

type ValidationError = { field: string; message: string };

function fail(errors: ValidationError[]) {
  return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 });
}

// --- Primitives ---

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNonEmptyString(value: unknown): value is string {
  return isString(value) && value.trim().length > 0;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isOptionalUrl(value: unknown): boolean {
  if (value === undefined || value === null || value === "") return true;
  return isString(value) && isValidUrl(value);
}

function isOptionalString(value: unknown): boolean {
  return value === undefined || value === null || isString(value);
}

function isOptionalBoolean(value: unknown): boolean {
  return value === undefined || value === null || typeof value === "boolean";
}

function isOptionalNumber(value: unknown): boolean {
  return value === undefined || value === null || typeof value === "number";
}

const VALID_ARTICLE_TYPES = ["guide", "advertorial", "comparative", "listicle", "review"];
const VALID_ARTICLE_STATUSES = ["draft", "published", "archived"];

// --- Route validators ---

export function validateLogin(body: Record<string, unknown>) {
  const errors: ValidationError[] = [];

  if (!isNonEmptyString(body.email)) {
    errors.push({ field: "email", message: "Email is required" });
  } else if (!isValidEmail(body.email)) {
    errors.push({ field: "email", message: "Invalid email format" });
  }

  if (!isNonEmptyString(body.password)) {
    errors.push({ field: "password", message: "Password is required" });
  }

  return errors.length > 0 ? fail(errors) : null;
}

export function validateArticleCreate(body: Record<string, unknown>) {
  const errors: ValidationError[] = [];

  if (!isNonEmptyString(body.title)) {
    errors.push({ field: "title", message: "Title is required" });
  } else if ((body.title as string).length > 200) {
    errors.push({ field: "title", message: "Title must be 200 characters or less" });
  }

  if (!isNonEmptyString(body.excerpt)) {
    errors.push({ field: "excerpt", message: "Excerpt is required" });
  } else if ((body.excerpt as string).length > 500) {
    errors.push({ field: "excerpt", message: "Excerpt must be 500 characters or less" });
  }

  if (body.content === undefined || body.content === null || body.content === "") {
    errors.push({ field: "content", message: "Content is required" });
  }

  if (!isNonEmptyString(body.categoryId)) {
    errors.push({ field: "categoryId", message: "Category is required" });
  }

  if (!isNonEmptyString(body.authorId)) {
    errors.push({ field: "authorId", message: "Author is required" });
  }

  if (body.type !== undefined && !VALID_ARTICLE_TYPES.includes(body.type as string)) {
    errors.push({ field: "type", message: `Type must be one of: ${VALID_ARTICLE_TYPES.join(", ")}` });
  }

  if (body.status !== undefined && !VALID_ARTICLE_STATUSES.includes(body.status as string)) {
    errors.push({ field: "status", message: `Status must be one of: ${VALID_ARTICLE_STATUSES.join(", ")}` });
  }

  if (!isOptionalUrl(body.coverImage)) errors.push({ field: "coverImage", message: "Invalid URL" });
  if (!isOptionalUrl(body.ogImage)) errors.push({ field: "ogImage", message: "Invalid URL" });
  if (!isOptionalUrl(body.sponsorUrl)) errors.push({ field: "sponsorUrl", message: "Invalid URL" });
  if (!isOptionalUrl(body.sponsorLogo)) errors.push({ field: "sponsorLogo", message: "Invalid URL" });
  if (!isOptionalUrl(body.ctaUrl)) errors.push({ field: "ctaUrl", message: "Invalid URL" });
  if (!isOptionalString(body.seoTitle)) errors.push({ field: "seoTitle", message: "Must be a string" });
  if (!isOptionalString(body.seoDesc)) errors.push({ field: "seoDesc", message: "Must be a string" });
  if (!isOptionalString(body.sponsorName)) errors.push({ field: "sponsorName", message: "Must be a string" });
  if (!isOptionalString(body.ctaLabel)) errors.push({ field: "ctaLabel", message: "Must be a string" });
  if (!isOptionalBoolean(body.featured)) errors.push({ field: "featured", message: "Must be a boolean" });

  return errors.length > 0 ? fail(errors) : null;
}

export function validateArticleUpdate(body: Record<string, unknown>) {
  const errors: ValidationError[] = [];

  if (body.title !== undefined) {
    if (!isNonEmptyString(body.title)) {
      errors.push({ field: "title", message: "Title cannot be empty" });
    } else if ((body.title as string).length > 200) {
      errors.push({ field: "title", message: "Title must be 200 characters or less" });
    }
  }

  if (body.excerpt !== undefined && !isNonEmptyString(body.excerpt)) {
    errors.push({ field: "excerpt", message: "Excerpt cannot be empty" });
  }

  if (body.type !== undefined && !VALID_ARTICLE_TYPES.includes(body.type as string)) {
    errors.push({ field: "type", message: `Type must be one of: ${VALID_ARTICLE_TYPES.join(", ")}` });
  }

  if (body.status !== undefined && !VALID_ARTICLE_STATUSES.includes(body.status as string)) {
    errors.push({ field: "status", message: `Status must be one of: ${VALID_ARTICLE_STATUSES.join(", ")}` });
  }

  if (!isOptionalUrl(body.coverImage)) errors.push({ field: "coverImage", message: "Invalid URL" });
  if (!isOptionalUrl(body.ogImage)) errors.push({ field: "ogImage", message: "Invalid URL" });
  if (!isOptionalUrl(body.sponsorUrl)) errors.push({ field: "sponsorUrl", message: "Invalid URL" });
  if (!isOptionalUrl(body.sponsorLogo)) errors.push({ field: "sponsorLogo", message: "Invalid URL" });
  if (!isOptionalUrl(body.ctaUrl)) errors.push({ field: "ctaUrl", message: "Invalid URL" });
  if (!isOptionalBoolean(body.featured)) errors.push({ field: "featured", message: "Must be a boolean" });

  return errors.length > 0 ? fail(errors) : null;
}

export function validateCategoryCreate(body: Record<string, unknown>) {
  const errors: ValidationError[] = [];

  if (!isNonEmptyString(body.name)) {
    errors.push({ field: "name", message: "Name is required" });
  } else if ((body.name as string).length > 100) {
    errors.push({ field: "name", message: "Name must be 100 characters or less" });
  }

  if (!isOptionalString(body.description)) errors.push({ field: "description", message: "Must be a string" });
  if (!isOptionalString(body.icon)) errors.push({ field: "icon", message: "Must be a string" });
  if (!isOptionalString(body.color)) errors.push({ field: "color", message: "Must be a string" });
  if (!isOptionalNumber(body.order)) errors.push({ field: "order", message: "Must be a number" });

  return errors.length > 0 ? fail(errors) : null;
}

export function validateCategoryUpdate(body: Record<string, unknown>) {
  const errors: ValidationError[] = [];

  if (body.name !== undefined) {
    if (!isNonEmptyString(body.name)) {
      errors.push({ field: "name", message: "Name cannot be empty" });
    } else if ((body.name as string).length > 100) {
      errors.push({ field: "name", message: "Name must be 100 characters or less" });
    }
  }

  if (!isOptionalString(body.description)) errors.push({ field: "description", message: "Must be a string" });
  if (!isOptionalString(body.icon)) errors.push({ field: "icon", message: "Must be a string" });
  if (!isOptionalString(body.color)) errors.push({ field: "color", message: "Must be a string" });
  if (!isOptionalNumber(body.order)) errors.push({ field: "order", message: "Must be a number" });

  return errors.length > 0 ? fail(errors) : null;
}
