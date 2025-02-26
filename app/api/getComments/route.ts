import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);

        const videoId = searchParams.get("videoId")

        if (!videoId) {
            return NextResponse.json({ message: "videoId is required" }, { status: 401 })
        }

        const comments = await prisma.comment.findMany(
            {
                include: {
                    user: true
                }
            }
        );

        if (!comments) {
            return NextResponse.json({ message: "Unable to get comments" }, { status: 401 })
        }

        return NextResponse.json({ comments }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error }, { status: 401 })
    }
}