import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Roast from '@/models/Roast';
import { z } from 'zod';

const n8nWebhookSchema = z.object({
  roastId: z.string(),
  result: z.string(),
  status: z.enum(['completed', 'failed']).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roastId, result, status } = n8nWebhookSchema.parse(body);

    await dbConnect();

    const roast = await Roast.findById(roastId);

    if (!roast) {
      return NextResponse.json({ error: 'Roast not found' }, { status: 404 });
    }

    roast.result = result;
    roast.status = status || 'completed';
    roast.completedAt = new Date();
    await roast.save();

    return NextResponse.json({ message: 'Roast updated successfully' }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error('N8N webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
