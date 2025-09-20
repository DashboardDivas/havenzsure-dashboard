import { http, HttpResponse } from 'msw';
import { listShops, getShop, createShop, updateShop } from './db';
import { ShopCreate, ShopUpdate } from '@/types/shop';

const BASE = '/api/shops';

async function readJson<T>(request: Request): Promise<T> {
  const body = await request.json();
  if (body === undefined || body === null) {
    throw Object.assign(new Error('Empty request body'), {
      status: 400,
      data: { message: 'Validation failed', errors: [{ field: 'code', code: 'empty_body' }] },
    });
  }
  return body as T;
}

export const handlers = [
  // List
  http.get(BASE, async ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get('status') as 'active' | 'inactive';
    const q = url.searchParams.get('q') || undefined;
    const data = await listShops({ status: status ?? undefined, q });
    return HttpResponse.json(data, { status: 200, headers: { 'X-Total-Count': String(data.length) } });
  }),

  // Detail
  http.get(`${BASE}/:id`, async ({ params }) => {
    try {
      const data = await getShop(Number(params.id));
      return HttpResponse.json(data, { status: 200 });
    } catch (e: any) {
      return HttpResponse.json({ message: e.message }, { status: e.status ?? 500 });
    }
  }),

  // Create
  http.post(BASE, async ({ request }) => {
    try {
      const body = await readJson<ShopCreate>(request);
      const created = await createShop(body);
      return HttpResponse.json(created, { status: 201 });
    } catch (e: any) {
      return HttpResponse.json(e.data ?? { message: e.message }, { status: e.status ?? 500 });
    }
  }),

  http.put(`${BASE}/:id`, async ({ params, request }) => {
    try {
      const body = await readJson<ShopUpdate>(request);
      const updated = await updateShop(Number(params.id), body);
      return HttpResponse.json(updated, { status: 200 });
    } catch (e: any) {
      return HttpResponse.json(e.data ?? { message: e.message }, { status: e.status ?? 500 });
    }
  }),
];
