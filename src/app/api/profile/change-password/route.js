import dbConnect from '@/lib/db';
import User from '@/models/User';
import { comparePassword, hashPassword } from '@/utils/hashPassword';
import { cookies } from 'next/headers';



export const PUT = async (req) => {
  await dbConnect();
  const userId = (await cookies()).get("authUserId")?.value; 
  const {  currentPassword, newPassword,confirmPassword } = await req.json();

  try {
    if (newPassword !== confirmPassword) {
      return new Response(JSON.stringify({ error: 'Passwords do not match' }), {
        status: 400,
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
      });
    }

    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
      return new Response(JSON.stringify({ error: 'Incorrect current password' }), {
        status: 400,
      });
    }

    
    user.password = await hashPassword(newPassword);
    await user.save();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (error) {
 
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
};
