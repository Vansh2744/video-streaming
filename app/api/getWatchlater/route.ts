import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken"

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = jwt.verify(token, process.env.TOKEN_SECRET!) as JwtPayload;

        const watchLaterVideos = await prisma.watchLaterVideos.findMany({
            where: {
                userId: id
            },
            include: {
                video: true,
                user: true
            }
        });

        if (watchLaterVideos.length === 0) {
            return NextResponse.json({ message: "No videos in watch later" }, { status: 404 });
        }

        const videos = watchLaterVideos.map(entry => entry.video);

        return NextResponse.json({ videos }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error }, { status: 401 })
    }
}