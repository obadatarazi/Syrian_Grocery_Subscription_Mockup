import { createCrmCustomerSeed } from "@/features/customers/mocks/customers.seed";
import type { CustomersService } from "@/features/customers/services/customers.service.types";
import type {
  CrmCustomer,
  CrmCustomerListParams,
  CrmNote,
  CrmNoteInput,
  CrmProfileInput,
  CrmTag,
  CrmTimelineEvent,
} from "@/features/customers/types/customers.types";
import { customerHasTag, customerMatchesSegment } from "@/features/customers/utils/crm-segments";
import { buildCrmReport, buildCrmStats } from "@/features/customers/utils/crm-stats";
import { ServiceError } from "@/shared/errors";
import { mockDelay } from "@/shared/lib/mock";

const DELAY_MS = 50;

let store: CrmCustomer[] = createCrmCustomerSeed();
let nextNoteId = Math.max(0, ...store.flatMap((c) => c.notes.map((n) => n.id))) + 1;
let nextEventId = Math.max(0, ...store.flatMap((c) => c.timeline.map((e) => e.id))) + 1;

function clone(customer: CrmCustomer): CrmCustomer {
  return structuredClone(customer);
}

function findOrThrow(id: number): CrmCustomer {
  const found = store.find((row) => row.id === id);
  if (!found) throw new ServiceError("not_found");
  return found;
}

function replace(updated: CrmCustomer): CrmCustomer {
  store = store.map((row) => (row.id === updated.id ? updated : row));
  return clone(updated);
}

function appendTimeline(customer: CrmCustomer, event: Omit<CrmTimelineEvent, "id">): CrmCustomer {
  const entry: CrmTimelineEvent = { ...event, id: nextEventId++ };
  return { ...customer, timeline: [entry, ...customer.timeline] };
}

function sortRows(rows: CrmCustomer[], sort?: string, direction?: "asc" | "desc"): CrmCustomer[] {
  const dir = direction === "asc" ? 1 : -1;
  const key = sort ?? "spent";

  return [...rows].sort((a, b) => {
    switch (key) {
      case "name":
        return a.nameEn.localeCompare(b.nameEn) * dir;
      case "orders":
      case "ordersCount":
        return (a.ordersCount - b.ordersCount) * dir;
      case "joined":
      case "joinedAt":
        return (new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime()) * dir;
      case "last_order":
      case "lastOrderAt":
        return (a.lastOrderAt ?? "").localeCompare(b.lastOrderAt ?? "") * dir;
      case "id":
        return (a.id - b.id) * dir;
      case "spent":
      default:
        return (a.spent - b.spent) * dir;
    }
  });
}

function createMockCustomersService(): CustomersService {
  return {
    async list(params: CrmCustomerListParams = {}) {
      await mockDelay(DELAY_MS);

      const page = params.page ?? 1;
      const pageSize = params.limit ?? 10;
      const search = params.search?.trim().toLowerCase() ?? "";

      let rows = store.filter((row) => {
        if (params.status && row.status !== params.status) return false;
        if (params.segment && !customerMatchesSegment(row, params.segment)) return false;
        if (params.tag && !customerHasTag(row, params.tag)) return false;
        if (params.carePlan === "yes" && row.carePlan?.status !== "ACTIVE") return false;
        if (params.carePlan === "no" && row.carePlan?.status === "ACTIVE") return false;
        if (!search) return true;
        const hay = `${row.nameEn} ${row.nameAr} ${row.email} ${row.phone}`.toLowerCase();
        return hay.includes(search);
      });

      rows = sortRows(rows, params.sort, params.direction);

      const total = rows.length;
      const start = (page - 1) * pageSize;
      const data = rows.slice(start, start + pageSize).map(clone);

      return { data, total, page, pageSize };
    },

    async getById(id: number) {
      await mockDelay(DELAY_MS);
      return clone(findOrThrow(id));
    },

    async getStats() {
      await mockDelay(DELAY_MS);
      return buildCrmStats(store);
    },

    async getReport() {
      await mockDelay(DELAY_MS);
      return buildCrmReport(store);
    },

    async addNote(id: number, input: CrmNoteInput) {
      await mockDelay(DELAY_MS);
      const current = findOrThrow(id);
      const created: CrmNote = {
        id: nextNoteId++,
        body: input.body.trim(),
        author: "You",
        type: input.type,
        createdAt: new Date().toISOString(),
      };
      const withNote = { ...current, notes: [created, ...current.notes] };
      return replace(
        appendTimeline(withNote, {
          type: "note",
          titleEn: "Staff note added",
          titleAr: "أُضيفت ملاحظة داخلية",
          at: created.createdAt,
        }),
      );
    },

    async toggleCarePlan(id: number) {
      await mockDelay(DELAY_MS);
      const current = findOrThrow(id);
      if (!current.carePlan) throw new ServiceError("not_found");
      const nextStatus = current.carePlan.status === "ACTIVE" ? "PAUSED" : "ACTIVE";
      const updated: CrmCustomer = {
        ...current,
        carePlan: { ...current.carePlan, status: nextStatus },
      };
      const paused = nextStatus === "PAUSED";
      return replace(
        appendTimeline(updated, {
          type: "care_plan",
          titleEn: paused ? "Care Plan paused" : "Care Plan resumed",
          titleAr: paused ? "أُوقفت خطة العناية" : "استُؤنفت خطة العناية",
          at: new Date().toISOString(),
        }),
      );
    },

    async toggleTag(id: number, tag: Extract<CrmTag, "vip">) {
      await mockDelay(DELAY_MS);
      const current = findOrThrow(id);
      const has = current.tags.includes(tag);
      const tags = has ? current.tags.filter((item) => item !== tag) : [...current.tags, tag];
      return replace({ ...current, tags });
    },

    async sendNotification(id: number) {
      await mockDelay(DELAY_MS);
      const current = findOrThrow(id);
      return replace(
        appendTimeline(current, {
          type: "notification",
          titleEn: "In-app notification sent",
          titleAr: "أُرسل إشعار داخل التطبيق",
          at: new Date().toISOString(),
        }),
      );
    },

    async assignCoupon(id: number) {
      await mockDelay(DELAY_MS);
      const current = findOrThrow(id);
      const assignedAt = new Date().toISOString();
      const withCoupon: CrmCustomer = {
        ...current,
        coupons: [
          {
            code: "CRM10",
            titleEn: "Staff assigned 10%",
            titleAr: "خصم ١٠٪ من الإدارة",
            valueLabel: "10%",
            status: "unused",
            orderId: null,
            usedAt: null,
            assignedAt,
          },
          ...current.coupons,
        ],
      };
      return replace(
        appendTimeline(withCoupon, {
          type: "coupon",
          titleEn: "Assigned coupon CRM10",
          titleAr: "تم تعيين الكوبون CRM10",
          at: assignedAt,
        }),
      );
    },

    async updateProfile(id: number, input: CrmProfileInput) {
      await mockDelay(DELAY_MS);
      const current = findOrThrow(id);
      const nameEn = input.nameEn.trim();
      const nameAr = input.nameAr.trim();
      const email = input.email.trim();
      const phone = input.phone.trim();
      if (!nameEn || !nameAr || !email || !phone) throw new ServiceError("unknown");

      const duplicate = store.some(
        (row) => row.id !== id && row.email.toLowerCase() === email.toLowerCase(),
      );
      if (duplicate) throw new ServiceError("invalid_email");

      const tags: CrmTag[] =
        input.status === "inactive"
          ? current.tags.includes("inactive")
            ? current.tags
            : [...current.tags, "inactive"]
          : current.tags.filter((tag) => tag !== "inactive");

      const updated: CrmCustomer = {
        ...current,
        nameEn,
        nameAr,
        email,
        phone,
        status: input.status,
        tags,
        avatar: nameEn.charAt(0).toUpperCase() || current.avatar,
      };

      return replace(
        appendTimeline(updated, {
          type: "profile",
          titleEn: "Profile updated",
          titleAr: "تم تحديث الملف الشخصي",
          at: new Date().toISOString(),
        }),
      );
    },
  };
}

/** Prototype always uses the in-memory CRM mock — no API client. */
export const customersService: CustomersService = createMockCustomersService();
