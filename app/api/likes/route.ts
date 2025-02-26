import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { likes, userId, videoId } = await req.json();

        if (!likes || !userId || !videoId) {
            return NextResponse.json({ message: "All fields are required" }, { status: 401 })
        }

        const video = await prisma.video.findFirst({
            where: { id: videoId }
        })

        if (!video) {
            return NextResponse.json({ message: "Video is not available" }, { status: 401 })
        }

        const alreadyLiked = await prisma.likedVideos.findFirst({
            where: {
                userId,
                videoId
            }
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

            await prisma.video.update({
                where: { id: videoId },
                data: { likes: likes - 1 }
            })

            return NextResponse.json({ message: "Disliked Video" }, { status: 201 })
        }

        await prisma.likedVideos.create({
            data: {
                userId,
                videoId
            }
        })

        const updatedVideo = await prisma.video.update({
            where: { id: videoId },
            data: { likes }
        });

        return NextResponse.json({ updatedVideo }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error }, { status: 401 })
    }
}