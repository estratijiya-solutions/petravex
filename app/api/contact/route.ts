import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(6).max(40).optional(),
  message: z.string().min(10).max(4000),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    // V1 stub: log only. Replace with email send / CRM webhook before launch.
    console.info('[contact] new submission', { name: data.name, email: data.email });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ ok: false, errors: err.flatten() }, { status: 400 });
    }
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
