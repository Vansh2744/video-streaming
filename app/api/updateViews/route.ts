import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { updatedViews, id } = await req.json();

        if (!updatedViews) {
            return NextResponse.json({ message: "Views are required" }, { status: 401 })
        }

        const video = await prisma.video.update({
            where: { id },
            data: { views: updatedViews }
        });
        return NextResponse.json({ video }, { status: 200 });


    } catch (error) {
        return NextResponse.json({ error }, { status: 401 })
    }
}