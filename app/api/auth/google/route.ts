// app/api/auth/google/route.ts
import { redirect } from "next/navigation";

export async function GET() {
  const backendUrl = process.env.BACKEND_URL;

  redirect(`${backendUrl}/api/auth/google`);
}
