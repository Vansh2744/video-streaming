import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export async function middleware(request: NextRequest) {

    const cookieStore = await cookies()
    const token = cookieStore.get('token')

    const urls = ['/watchlater', '/likedVideosPage', '/trendingPage', '/watchlater', '/userProfile', '/video', '/upload', '/profile']

    if ((request.nextUrl.pathname === '/') && token) {
        return NextResponse.next();
    }

    if ((request.nextUrl.pathname === '/sign-up') && token) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    if ((request.nextUrl.pathname === '/sign-in') && token) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    if ((request.nextUrl.pathname === '/sign-up') && !token) {
        return NextResponse.next();
    }

    if (urls.includes(request.nextUrl.pathname) && !token) {
        return NextResponse.redirect(new URL('/sign-up', request.url))
    }

    if ((request.nextUrl.pathname === '/sign-in') && !token) {
        return NextResponse.next();
    }

    if ((request.nextUrl.pathname === '/') && !token) {
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }
}

export const config = {
    matcher: ['/', '/sign-up', '/sign-in', '/watchlater', '/likedVideosPage', '/trendingPage', '/watchlater', '/userProfile', '/video', '/upload', '/profile'],
}