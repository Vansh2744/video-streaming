import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ message: "id is not available" }, { status: 401 })
        }

        const video = await prisma.video.findFirst({
            where: { id },
            include: {
                user: true,
            },
        })

        if (!video) {
            return NextResponse.json({ message: "No video available" }, { status: 401 })
        }

        return NextResponse.json({ video }, { status: 201 })

    } catch (error) {
        return NextResponse.json({ error }, { status: 401 })
    }
}