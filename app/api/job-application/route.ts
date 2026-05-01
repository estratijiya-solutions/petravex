import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(6).max(40),
  role: z.string().min(2).max(160),
  coverLetter: z.string().max(4000).optional(),
  resumeUrl: z.string().url().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    console.info('[careers] new application', { fullName: data.fullName, role: data.role });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ ok: false, errors: err.flatten() }, { status: 400 });
    }
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
