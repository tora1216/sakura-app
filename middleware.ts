import { NextRequest, NextResponse } from 'next/server'

export default function middleware(request: NextRequest) {
  const authHeader = request.headers.get('authorization')

  if (!authHeader?.startsWith('Basic ')) {
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Admin"' },
    })
  }

  const base64 = authHeader.slice(6)
  const decoded = atob(base64)
  const colonIndex = decoded.indexOf(':')
  const username = decoded.slice(0, colonIndex)
  const password = decoded.slice(colonIndex + 1)

  const adminUser = process.env.ADMIN_USER ?? 'admin'
  const adminPass = process.env.ADMIN_PASS ?? 'admin1234'

  if (username !== adminUser || password !== adminPass) {
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Admin"' },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
