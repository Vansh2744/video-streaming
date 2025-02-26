import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);

        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ message: "userId is not present" }, { status: 401 })
        }

        const user = await prisma.user.findFirst({
            where: { id: userId },
            include: {
                videos: true
            }
        })

        return NextResponse.json({ user }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error }, { status: 401 })
    }
}