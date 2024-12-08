import { cookies } from "next/headers";

export async function GET(req){
  try {
    const userId = (await cookies()).get('authUserId').value;
  if(!userId){
    return new Response(JSON.stringify({ error: 'authUserId cookie not found' }), { status: 404 });
  }
  const headers = new Headers();
    headers.append(
      "Set-Cookie",
      `authToken=; HttpOnly; Path=/; Max-Age=0; Secure; SameSite=Strict`
    );

    return new Response(
      JSON.stringify({ message: "Logged out successfully" }),
      {
        status: 200,
        headers: headers,
      }
    );
  } catch (error) {

    return new Response(JSON.stringify({ message: "Error while logging out" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}