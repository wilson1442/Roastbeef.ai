import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Roast from '@/models/Roast';
import { useToken } from '@/lib/tokens';
import { triggerN8NWebhook } from '@/lib/n8n';
import { z } from 'zod';

const submitRoastSchema = z.object({
  url: z.string().url('Invalid URL format'),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!session.user.emailVerified) {
      return NextResponse.json({ error: 'Email verification required' }, { status: 403 });
    }

    const body = await request.json();
    const { url } = submitRoastSchema.parse(body);

    await dbConnect();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check token balance
    if (user.tokens < 1) {
      return NextResponse.json({ error: 'Insufficient tokens' }, { status: 400 });
    }

    // Create roast record
    const roast = await Roast.create({
      userId: user._id,
      url,
      status: 'pending',
    });

    // Deduct token
    const tokenUsed = await useToken(user._id.toString());
    if (!tokenUsed) {
      await Roast.findByIdAndUpdate(roast._id, { status: 'failed' });
      return NextResponse.json({ error: 'Failed to deduct token' }, { status: 500 });
    }

    // Trigger N8N webhook
    try {
      await triggerN8NWebhook(url, roast._id.toString());
      await Roast.findByIdAndUpdate(roast._id, { status: 'processing' });
    } catch (error) {
      console.error('N8N webhook error:', error);
      // Don't fail the request, but mark as processing
      await Roast.findByIdAndUpdate(roast._id, { status: 'processing' });
    }

    return NextResponse.json(
      {
        id: roast._id.toString(),
        status: 'processing',
        message: 'Roast submitted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error('Submit roast error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
