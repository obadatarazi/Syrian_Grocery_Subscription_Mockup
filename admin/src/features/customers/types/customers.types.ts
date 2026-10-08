export type CrmTag = "vip" | "care_plan" | "prescription" | "high_value" | "inactive";

export type CrmSegment = "new_buyers" | "repeat_buyers" | "care_plan" | "inactive" | "big_spenders";

export type CrmCustomerStatus = "active" | "inactive";

export type CrmLoyaltyTier = "Gold" | "Silver" | "Bronze";

export type CrmCarePlanStatus = "ACTIVE" | "PAUSED" | "CANCELLED";

export type CrmCarePlanFrequency = "WEEKLY" | "BIWEEKLY" | "MONTHLY";

export type CrmNoteType = "general" | "call" | "complaint" | "delivery";

export type CrmTimelineType =
  | "registered"
  | "order"
  | "payment"
  | "care_plan"
  | "loyalty"
  | "prescription"
  | "note"
  | "notification"
  | "coupon"
  | "review"
  | "profile";

export type CrmOrderStatus = "delivered" | "shipped" | "processing" | "pending" | "cancelled";

export type CrmAddress = {
  id: number;
  titleEn: string;
  titleAr: string;
  lineEn: string;
  lineAr: string;
  phone: string;
  isDefault: boolean;
};

export type CrmOrder = {
  id: string;
  placedAt: string;
  total: number;
  status: CrmOrderStatus;
  paymentEn: string;
  paymentAr: string;
  items: number;
};

export type CrmPaymentStatus = "success" | "failed" | "refunded" | "pending";

export type CrmPayment = {
  id: string;
  orderId: string;
  amount: number;
  methodEn: string;
  methodAr: string;
  status: CrmPaymentStatus;
  paidAt: string;
};

export type CrmCarePlan = {
  id: string;
  status: CrmCarePlanStatus;
  frequency: CrmCarePlanFrequency;
  nextDeliveryAt: string;
  itemsEn: string;
  itemsAr: string;
};

export type CrmLoyalty = {
  points: number;
  lifetimeEarned: number;
  lifetimeRedeemed: number;
  tier: CrmLoyaltyTier;
};

export type CrmPrescription = {
  id: string;
  productEn: string;
  productAr: string;
  status: "pending" | "approved" | "rejected";
  uploadedAt: string;
};

export type CrmReviewStatus = "pending" | "approved" | "rejected";

export type CrmProductReview = {
  id: string;
  productEn: string;
  productAr: string;
  rating: number;
  bodyEn: string;
  bodyAr: string;
  status: CrmReviewStatus;
  createdAt: string;
};

export type CrmCouponStatus = "used" | "unused" | "expired";

export type CrmCoupon = {
  code: string;
  titleEn: string;
  titleAr: string;
  valueLabel: string;
  status: CrmCouponStatus;
  orderId: string | null;
  usedAt: string | null;
  assignedAt: string;
};

export type CrmNote = {
  id: number;
  body: string;
  author: string;
  type: CrmNoteType;
  createdAt: string;
};

export type CrmTimelineEvent = {
  id: number;
  type: CrmTimelineType;
  titleEn: string;
  titleAr: string;
  at: string;
};

export type CrmCustomer = {
  id: number;
  nameEn: string;
  nameAr: string;
  email: string;
  phone: string;
  avatar: string;
  status: CrmCustomerStatus;
  joinedAt: string;
  lastOrderAt: string | null;
  ordersCount: number;
  spent: number;
  tags: CrmTag[];
  loyalty: CrmLoyalty;
  carePlan: CrmCarePlan | null;
  addresses: CrmAddress[];
  orders: CrmOrder[];
  payments: CrmPayment[];
  reviews: CrmProductReview[];
  coupons: CrmCoupon[];
  prescriptions: CrmPrescription[];
  notes: CrmNote[];
  timeline: CrmTimelineEvent[];
};

export type CrmCustomerListParams = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  direction?: "asc" | "desc";
  segment?: CrmSegment;
  tag?: CrmTag;
  status?: CrmCustomerStatus;
  carePlan?: "yes" | "no";
};

export type CrmKpi = {
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  count: number;
};

export type CrmStats = {
  totalCustomers: CrmKpi;
  newCustomers: CrmKpi;
  carePlanSubscribers: CrmKpi;
  inactiveCustomers: CrmKpi;
  bigSpenders: CrmKpi;
  retentionRate: CrmKpi;
};

export type CrmGrowthPoint = {
  month: string;
  monthAr: string;
  newCustomers: number;
  returning: number;
};

export type CrmNamedSlice = {
  id: string;
  nameEn: string;
  nameAr: string;
  value: number;
  color: string;
};

export type CrmReport = {
  stats: CrmStats;
  growth: CrmGrowthPoint[];
  retention: CrmNamedSlice[];
  segments: CrmNamedSlice[];
  carePlanMix: CrmNamedSlice[];
};

export type CrmNoteInput = {
  body: string;
  type: CrmNoteType;
};

export type CrmProfileInput = {
  nameEn: string;
  nameAr: string;
  email: string;
  phone: string;
  status: CrmCustomerStatus;
};
