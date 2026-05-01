import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  company: z.string().min(2).max(160),
  contactName: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(6).max(40),
  category: z.enum(['raw-materials', 'equipment', 'services', 'other']),
  description: z.string().min(20).max(4000),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    console.info('[supplier] new application', { company: data.company, category: data.category });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ ok: false, errors: err.flatten() }, { status: 400 });
    }
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
