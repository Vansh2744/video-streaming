import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();
        const oneMonthInSeconds = 30 * 24 * 60 * 60;

        if (!email || !password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            return NextResponse.json({ error: "Invalid password" }, { status: 401 });
        }

        const cookieStore = await cookies();
        const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET!, { expiresIn: '30d' });

        cookieStore.set({
            name: "token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: oneMonthInSeconds
        })

        return NextResponse.json({ message: "User SignedIn successfully" }, { status: 201 });


    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });

    }
}