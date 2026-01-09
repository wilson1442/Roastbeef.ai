import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Roast from '@/models/Roast';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const roasts = await Roast.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const roastsData = roasts.map((roast) => ({
      id: roast._id.toString(),
      url: roast.url,
      status: roast.status,
      result: roast.result,
      createdAt: roast.createdAt,
      completedAt: roast.completedAt,
    }));

    return NextResponse.json({ roasts: roastsData }, { status: 200 });
  } catch (error) {
    console.error('Get roast history error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
