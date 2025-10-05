import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const cookie = req.headers.get('cookie') ?? '';

  const response = await fetch(`http://localhost:3000/shops`, {
    headers: {
      'Content-Type': 'application/json',
      cookie,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    return NextResponse.json({ message: errorData.message || 'Failed to fetch shops' }, { status: response.status });
  }

  const data = await response.json();
  return NextResponse.json(data, { status: 200 });
}
