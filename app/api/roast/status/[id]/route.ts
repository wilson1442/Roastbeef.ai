import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Roast from '@/models/Roast';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const roast = await Roast.findOne({
      _id: params.id,
      userId: session.user.id,
    });

    if (!roast) {
      return NextResponse.json({ error: 'Roast not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        id: roast._id.toString(),
        url: roast.url,
        status: roast.status,
        result: roast.result,
        createdAt: roast.createdAt,
        completedAt: roast.completedAt,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get roast status error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
