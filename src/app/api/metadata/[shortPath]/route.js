import { NextResponse } from 'next/server';
import connect from '../../../db';
import PostModel from '../../../../../models/PostModel';

export const GET = async (request, { params }) => {
  const { shortPath } = params;

  try {
    await connect();
    const post = await PostModel.findOne({ shortPath });

    if (!post) {
      return new NextResponse(JSON.stringify({ error: 'Link not found' }), {
        status: 404,
      });
    }

    // Check expiration first
    if (post.checkedExpiry && post.expireTime) {
      const now = new Date();
      const expireDate = new Date(post.expireTime);
      if (now > expireDate) {
        return NextResponse.json({
          isExpired: true,
          message: 'This link has expired',
        });
      }
    }

    // Return security requirements
    return NextResponse.json({
      requiresPasscode: post.checkedPasscode,
      originalUrl: post.originalUrl,
    });
  } catch (error) {
    return new NextResponse('Database Error: ' + error.message, {
      status: 500,
    });
  }
};
