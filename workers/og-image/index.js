export default {
  async fetch(request) {
    const url = new URL(request.url);
    const title = url.searchParams.get('title') || '技術ブログ';
    const subtitle = url.searchParams.get('subtitle') || 'Hugo + PaperMod + Cloudflare Pages';

    // タイトルを折り返し処理（長い場合）
    const maxLength = 30;
    let displayTitle = title;
    if (title.length > maxLength) {
      displayTitle = title.substring(0, maxLength) + '...';
    }

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#16213e;stop-opacity:1" />
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bgGradient)"/>

  <!-- 装飾的な要素 -->
  <circle cx="100" cy="100" r="150" fill="#0f3460" opacity="0.3"/>
  <circle cx="1100" cy="530" r="200" fill="#0f3460" opacity="0.3"/>

  <!-- タイトル -->
  <text x="600" y="280" font-family="Arial, sans-serif" font-size="64" fill="#ffffff" text-anchor="middle" font-weight="bold">
    ${escapeXml(displayTitle)}
  </text>

  <!-- サブタイトル -->
  <text x="600" y="350" font-family="Arial, sans-serif" font-size="28" fill="#e94560" text-anchor="middle">
    ${escapeXml(subtitle)}
  </text>

  <!-- ボトムライン -->
  <line x1="300" y1="450" x2="900" y2="450" stroke="#e94560" stroke-width="3"/>
</svg>`;

    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  },
};

function escapeXml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
