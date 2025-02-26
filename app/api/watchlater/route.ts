import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userId, videoId } = await req.json();

        if (!userId || !videoId) {
            return NextResponse.json({ message: "userId and videoId both should present" }, { status: 401 })
        }

        const isExist = await prisma.watchLaterVideos.findFirst({
            where: {
                userId,
                videoId
            }
        })

        if (isExist) {
            return NextResponse.json({ message: "Already Added to Watchlater" }, { status: 201 })
        }

        const video = await prisma.watchLaterVideos.create({
            data: {
                userId,
                videoId
            }
        })

        return NextResponse.json({ message: "Added to Watchlater", video }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error }, { status: 401 })
    }
}