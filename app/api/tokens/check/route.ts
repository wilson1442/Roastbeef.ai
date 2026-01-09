import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getUserTokenBalance } from '@/lib/tokens';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const balance = await getUserTokenBalance(session.user.id);

    return NextResponse.json({ tokens: balance }, { status: 200 });
  } catch (error) {
    console.error('Token check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
