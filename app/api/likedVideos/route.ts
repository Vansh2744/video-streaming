import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        let decodedToken: JwtPayload;

        try {
            decodedToken = jwt.verify(token, process.env.TOKEN_SECRET!) as JwtPayload;
        } catch (err) {
            return NextResponse.json({ error: "Invalid or expired token", err }, { status: 401 });
        }

        const videos = await prisma.likedVideos.findMany({
            where: {
                userId: decodedToken.id
            },
            include: {
                user: true,
                video:true
            }
        })

        return NextResponse.json({ videos }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error }, { status: 401 })
    }
}