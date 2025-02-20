import { NextResponse } from 'next/server';
import connect from '../../db';
import PostModel from '../../../../models/PostModel';

export const POST = async (request) => {
  const { shortPath, passcode } = await request.json();

  try {
    await connect();
    const post = await PostModel.findOne({ shortPath });

    if (!post) {
      return NextResponse.json({ error: 'Invalid link' }, { status: 404 });
    }

    // Verify passcode
    if (post.checkedPasscode && post.passcode !== passcode) {
      return NextResponse.json({ error: 'Invalid passcode' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      originalUrl: post.originalUrl,
    });
  } catch (error) {
    return new NextResponse('Database Error: ' + error.message, {
      status: 500,
    });
  }
};
