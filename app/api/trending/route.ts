import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const videos = await prisma.video.findMany({
            orderBy: {
                likes: "desc"
            },
            include: {
                user: true
            }
        })
        return NextResponse.json({ videos }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error }, { status: 401 })
    }
}