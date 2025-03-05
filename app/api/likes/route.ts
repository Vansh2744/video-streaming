import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userId, videoId } = await req.json();

        if (!userId || !videoId) {
            return NextResponse.json({ message: "All fields are required" }, { status: 401 })
        }

        const currVideo = await prisma.video.findFirst({
            where: { id: videoId }
        })

        if (!currVideo || currVideo.likes === undefined) {
            return NextResponse.json({ message: "Video not found or likes are undefined" }, { status: 404 });
        }

        const alreadyLiked = await prisma.likedVideos.findFirst({
            where: { videoId, userId }
        })

        if (alreadyLiked) {
            await prisma.likedVideos.delete({
                where: {
                    userId_videoId: {
                        userId,
                        videoId
                    }
                }
            })

            const video = await prisma.video.update({
                where: { id: videoId },
                data: { likes: (currVideo.likes - 1) }
            })

            return NextResponse.json({ video, isLiked: false }, { status: 201 })
        }

        await prisma.likedVideos.create({
            data: { userId, videoId }
        })

        const video = await prisma.video.update({
            where: {
                id: videoId
            },
            data: { likes: (currVideo.likes + 1) }
        })

        return NextResponse.json({ video, isLiked: true }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error }, { status: 401 })
    }
}