import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
    try {
        const { username, email, password } = await req.json();

        if (!username || !email || !password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const userWithEmail = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (userWithEmail) {
            return NextResponse.json({ error: "User with this email already exist" }, { status: 409 });
        }

        const userWithUsername = await prisma.user.findUnique({ where: { username } });

        if (userWithUsername) {
            return NextResponse.json({ error: "User with this username already exist" }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });

        if (!user) {
            return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
        }

        const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET!, { expiresIn: '7d' });

        const cookieStore = await cookies();

        cookieStore.set({
            name: "token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 2592000
        })

        return NextResponse.json({ message: "User SignedUp successfully" }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}