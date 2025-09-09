import { cookies } from "next/headers";

export async function GET() {
  try {
    // Await cookies() in Next.js 15
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("auth_user");

    if (!userCookie) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    let user;
    try {
      user = JSON.parse(userCookie.value);
    } catch {
      return Response.json({ error: "Invalid user cookie" }, { status: 400 });
    }

    const roles = user["https://rosehub.com/roles"] || user.roles || [];

    // 🔒 Admin-only check
    if (!Array.isArray(roles) || !roles.includes("admin")) {
      return Response.json(
        {
          error: "Access denied",
          message: "Admin role required",
          userRoles: roles,
        },
        { status: 403 }
      );
    }

    return Response.json({
      message: "Admin access granted",
      userRoles: roles,
      user: {
        email: user.email ?? null,
        name: user.name ?? null,
      },
    });
  } catch (error) {
    console.error("Admin check error:", error);
    return Response.json({ error: "Admin check failed" }, { status: 500 });
  }
}
