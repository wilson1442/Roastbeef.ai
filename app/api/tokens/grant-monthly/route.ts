import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { checkMonthlyTokenGrant } from '@/lib/tokens';

// This endpoint should be called by a cron job (e.g., Vercel Cron)
export async function POST(request: NextRequest) {
  try {
    // Optional: Add a secret header to protect this endpoint
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const users = await User.find({});

    let grantedCount = 0;

    for (const user of users) {
      const granted = await checkMonthlyTokenGrant(user._id.toString());
      if (granted) {
        grantedCount++;
      }
    }

    return NextResponse.json(
      { message: `Monthly tokens granted to ${grantedCount} users` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Monthly token grant error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
