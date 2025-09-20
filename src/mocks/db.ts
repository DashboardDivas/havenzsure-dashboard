
import type { Shop, ShopCreate, ShopUpdate, Province, ShopStatus } from '@/types/shop';

let _id = 3;

const PROVINCES: Province[] = ['AB','BC','MB','NB','NL','NT','NS','NU','ON','PE','QC','SK','YT'];

const RX_POSTAL = /^[A-Z][0-9][A-Z] ?[0-9][A-Z][0-9]$/i;
const RX_PHONE  = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
const RX_EMAIL  = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

function nowISO() { return new Date().toISOString(); }
function normalizePostal(pc: string) {
  const s = pc.toUpperCase().replace(/\s+/g, '');
  return s.length === 6 ? `${s.slice(0,3)} ${s.slice(3)}` : pc.toUpperCase();
}

function validate(input: Partial<ShopCreate>) {
  const errors: { field: keyof ShopCreate; code: string; hint?: string }[] = [];

  if (input.code != null && (input.code.length < 1 || input.code.length > 10)) {
    errors.push({ field: 'code', code: 'length', hint: '1–10 chars' });
  }
  if (input.status != null && !['active','inactive'].includes(input.status)) {
    errors.push({ field: 'status', code: 'invalid_value' });
  }
  if (input.province != null && !PROVINCES.includes(input.province)) {
    errors.push({ field: 'province', code: 'invalid_value', hint: PROVINCES.join(',') });
  }
  if (input.postalCode != null && !RX_POSTAL.test(input.postalCode)) {
    errors.push({ field: 'postalCode', code: 'invalid_format', hint: 'Use A1A 1A1' });
  }
  if (input.phone != null && !RX_PHONE.test(input.phone)) {
    errors.push({ field: 'phone', code: 'invalid_format', hint: 'NNN-NNN-NNNN' });
  }
  if (input.email != null && !RX_EMAIL.test(input.email)) {
    errors.push({ field: 'email', code: 'invalid_format' });
  }

  return errors;
}

// ---- 初始数据（符合真实约束）----
let shops: Shop[] = [
  {
    id: 1,
    code: 'S001',
    shopName: 'Alpha Auto',
    status: 'active',
    address: '123 Main St',
    city: 'Calgary',
    province: 'AB',
    postalCode: 'T2P 2B5',
    contactName: 'Jane Smith',
    phone: '403-555-1234',
    email: 'jane@alphaauto.ca',
    createdAt: nowISO(),
    updatedAt: nowISO(),
  },
  {
    id: 2,
    code: 'S002',
    shopName: 'Pacific Bodyworks',
    status: 'inactive',
    address: '88 W 4th Ave',
    city: 'Vancouver',
    province: 'BC',
    postalCode: 'V5Y 1G3',
    contactName: 'Ken Lee',
    phone: '604-555-9876',
    email: 'ken@pacificbw.ca',
    createdAt: nowISO(),
    updatedAt: nowISO(),
  },
];

// ---- CRUD in-memory 实现 ----
export async function listShops(params?: { status?: ShopStatus; q?: string }) {
  let data = [...shops];
  if (params?.status) data = data.filter(s => s.status === params.status);
  if (params?.q) {
    const q = params.q.toLowerCase();
    data = data.filter(s =>
      s.code.toLowerCase().includes(q) ||
      s.shopName.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q) ||
      s.postalCode.toLowerCase().includes(q)
    );
  }
  // 默认按 updatedAt desc
  data.sort((a,b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  return data;
}

export async function getShop(id: number) {
  const found = shops.find(s => s.id === id);
  if (!found) throw Object.assign(new Error('shop not found'), { status: 404 });
  return found;
}

export async function createShop(payload: ShopCreate) {
  // 规范化 + 校验
  const normalized: ShopCreate = {
    ...payload,
    postalCode: normalizePostal(payload.postalCode),
  };
  const errors = validate(normalized);
  if (errors.length) {
    const err: any = new Error('Validation failed');
    err.status = 400;
    err.data = { message: 'Validation failed', errors };
    throw err;
  }
  if (shops.some(s => s.code.toLowerCase() === payload.code.toLowerCase())) {
    const err: any = new Error('code already exists');
    err.status = 409;
    err.data = { message: 'code already exists' };
    throw err;
  }

  const now = nowISO();
  const next: Shop = {
    id: ++_id,
    ...normalized,
    createdAt: now,
    updatedAt: now,
  };
  shops.push(next);
  return next;
}

export async function updateShop(id: number, patch: ShopUpdate) {
  const idx = shops.findIndex(s => s.id === id);
  if (idx === -1) throw Object.assign(new Error('shop not found'), { status: 404 });

  const draft: Shop = { ...shops[idx], ...patch };
  if (patch.postalCode) draft.postalCode = normalizePostal(patch.postalCode);

  const errors = validate(draft as ShopCreate);
  if (errors.length) {
    const err: any = new Error('Validation failed');
    err.status = 400;
    err.data = { message: 'Validation failed', errors };
    throw err;
  }
  // 处理 code 冲突
  if (patch.code) {
    const dup = shops.find(s => s.code.toLowerCase() === patch.code!.toLowerCase() && s.id !== id);
    if (dup) {
      const err: any = new Error('code already exists');
      err.status = 409;
      err.data = { message: 'code already exists' };
      throw err;
    }
  }

  draft.updatedAt = nowISO();
  shops[idx] = draft;
  return draft;
}
