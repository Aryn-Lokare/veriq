import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { htmlContent, query } = await req.json();

    const fullHtml = `<!DOCTYPE html>
<html lang="en" data-theme="dark" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${query ? String(query).replace(/"/g, '&quot;') : 'Veriq Verified Research Report'}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    html, body { background-color: #09090b !important; color: #ffffff !important; max-width: 100% !important; overflow-x: hidden !important; margin: 0; padding: 24px; font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; }
    body * { max-width: 100%; box-sizing: border-box; }
    p, span, li, h1, h2, h3, h4 { overflow-wrap: break-word; word-break: break-word; }
  </style>
</head>
<body class="dark bg-[#09090b] text-white">
  <div class="space-y-6 font-sans">
    ${htmlContent || ''}
  </div>
</body>
</html>`;

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(fullHtml, { waitUntil: 'networkidle0' as any });

    // Await font loading & Tailwind CDN engine generation
    await page.evaluate(() => document.fonts.ready);
    await new Promise((resolve) => setTimeout(resolve, 400));

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '15mm', bottom: '15mm', left: '15mm', right: '15mm' },
    });

    await browser.close();

    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="veriq-report.pdf"',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'PDF Generation failed' },
      { status: 500 }
    );
  }
}
