import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken"

export async function POST(req: Request) {
    try {
        const { video, thumbnail, title, description } = await req.json();

        if (!video || !title || !description) {
            return NextResponse.json({ message: "Except Thumbnail sll fields are required" }, { status: 401 })
        }

        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ message: "Unauthorized User" }, { status: 401 })
        }

        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET!);

        const uploaded = await prisma.video.create({
            data: {
                title,
                description,
                url: video,
                thumbnail,
                user: {
                    connect: {
                        id: (decodedToken as JwtPayload).id
                    }
                }

            },
        })

        return NextResponse.json({ message: "Video Uploaded", uploaded }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: "Unable to upload video", error }, { status: 401 })
    }
}