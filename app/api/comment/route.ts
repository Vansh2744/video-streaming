import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { comment, userId, videoId } = await req.json();

        if (!comment || !userId || !videoId) {
            return NextResponse.json({ message: "Comment, videoId and userId is required" }, { status: 401 })
        }

        const res = await prisma.comment.create({
            data: {
                userId,
                videoId,
                description: comment
            }
        })

        return NextResponse.json({ res }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error }, { status: 401 })
    }
}