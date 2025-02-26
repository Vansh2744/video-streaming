import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const videos = await prisma.video.findMany({
            include: {
                user: true
            }
        });

        if (!videos) {
            return NextResponse.json({ message: "Video not found" }, { status: 400 })
        }

        return NextResponse.json({ videos }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ error }, { status: 401 })
    }
}