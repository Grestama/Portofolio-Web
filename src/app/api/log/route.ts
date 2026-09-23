import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const logPath = path.join(process.cwd(), 'client_errors.log');
    const logEntry = `[${new Date().toISOString()}] ${data.type}: ${data.message}\n${data.stack || ''}\n\n`;
    fs.appendFileSync(logPath, logEntry);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
