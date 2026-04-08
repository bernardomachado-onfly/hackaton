import { Router, type Request, type Response } from 'express';
import { bookingStore } from '../services/session.js';

const router = Router();

// Rota de teste — remove antes de produção
router.get('/pass/test', (_req: Request, res: Response) => {
  const code = 'BK-DEMO001';
  bookingStore.set(code, {
    bookingCode: code,
    origin: 'GRU', originCity: 'São Paulo',
    destination: 'BSB', destCity: 'Brasília',
    flightNumber: 'G3 1278', date: '10/04', time: '11:15',
    gate: 'B12', seat: '14A', passenger: 'Bernardo Machado', bookingClass: 'Economy',
  });
  res.redirect(`/api/pass/${code}`);
});

function generateBarcodeSvg(code: string): string {
  const bars: string[] = [];
  for (let i = 0; i < 80; i++) {
    const x = i * 2.4;
    const height = 30 + (code.charCodeAt(i % code.length) % 30);
    const width = i % 3 === 0 ? 2 : 1;
    bars.push(`<rect x="${x}" y="${(60 - height) / 2}" width="${width}" height="${height}" fill="#1a1a1a"/>`);
  }
  return bars.join('');
}

router.get('/pass/:bookingCode', (req: Request, res: Response) => {
  const { bookingCode } = req.params;
  const booking = bookingStore.get(bookingCode);

  if (!booking) {
    res.status(404).send('<h2>Pass não encontrado</h2>');
    return;
  }

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
  <title>Boarding Pass · ${booking.flightNumber}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:#1c1c1e;display:flex;flex-direction:column;justify-content:center;align-items:center;min-height:100vh;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display',sans-serif;padding:24px}
    .pass{width:100%;max-width:360px;background:linear-gradient(160deg,#1d4e9f 0%,#0a3272 100%);border-radius:24px;overflow:hidden;color:#fff;box-shadow:0 24px 80px rgba(0,0,0,.6)}
    .header{padding:20px 20px 16px;display:flex;justify-content:space-between;align-items:flex-start}
    .brand{display:flex;align-items:center;gap:8px}
    .brand-logo{font-size:24px}
    .brand-name{font-size:17px;font-weight:700;letter-spacing:-.3px}
    .pass-type{font-size:10px;opacity:.6;text-transform:uppercase;letter-spacing:1.5px;margin-top:2px}
    .seat-box{text-align:right}
    .seat-label{font-size:10px;opacity:.6;text-transform:uppercase;letter-spacing:1px}
    .seat-value{font-size:26px;font-weight:300;letter-spacing:-1px}
    .divider{height:1px;background:rgba(255,255,255,.12);margin:0 20px}
    .route{padding:20px;display:flex;align-items:center;justify-content:space-between}
    .city-code{font-size:52px;font-weight:200;letter-spacing:-2px;line-height:1}
    .city-name{font-size:11px;opacity:.6;margin-top:4px}
    .flight-center{text-align:center;flex:1}
    .flight-arrow{font-size:20px;opacity:.8}
    .flight-num{font-size:12px;opacity:.6;margin-top:4px;letter-spacing:.5px}
    .details{padding:0 20px 20px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px}
    .detail{display:flex;flex-direction:column;gap:3px}
    .detail-label{font-size:9px;opacity:.55;text-transform:uppercase;letter-spacing:1px}
    .detail-value{font-size:14px;font-weight:600;letter-spacing:-.2px}
    .detail-wide{grid-column:span 3}
    .detail-two{grid-column:span 2}
    .status-ok{color:#34d399}
    .tear{height:1px;border:none;border-top:2px dashed rgba(255,255,255,.2);margin:0 20px 20px}
    .barcode-section{background:rgba(255,255,255,.97);margin:0 20px 20px;border-radius:14px;padding:16px 12px 10px}
    .barcode-svg{width:100%;display:block}
    .barcode-code{text-align:center;font-size:11px;color:#333;margin-top:8px;letter-spacing:3px;font-weight:500}
    .wallet-btn{display:flex;align-items:center;justify-content:center;gap:8px;margin:0 20px 20px;background:#000;color:#fff;border-radius:12px;padding:14px;font-size:15px;font-weight:600;text-decoration:none;cursor:pointer;border:none;width:calc(100% - 40px)}
    .wallet-btn:active{opacity:.8}
    .powered{text-align:center;font-size:11px;color:rgba(255,255,255,.3);padding-bottom:20px}
  </style>
</head>
<body>
<div class="pass">
  <div class="header">
    <div class="brand">
      <div class="brand-logo">✈</div>
      <div>
        <div class="brand-name">Onfly</div>
        <div class="pass-type">Boarding Pass</div>
      </div>
    </div>
    <div class="seat-box">
      <div class="seat-label">Seat</div>
      <div class="seat-value">${booking.seat}</div>
    </div>
  </div>
  <div class="divider"></div>
  <div class="route">
    <div>
      <div class="city-code">${booking.origin}</div>
      <div class="city-name">${booking.originCity}</div>
    </div>
    <div class="flight-center">
      <div class="flight-arrow">✈</div>
      <div class="flight-num">${booking.flightNumber}</div>
    </div>
    <div style="text-align:right">
      <div class="city-code">${booking.destination}</div>
      <div class="city-name">${booking.destCity}</div>
    </div>
  </div>
  <div class="details">
    <div class="detail"><div class="detail-label">Date</div><div class="detail-value">${booking.date}</div></div>
    <div class="detail"><div class="detail-label">Departs</div><div class="detail-value">${booking.time}</div></div>
    <div class="detail"><div class="detail-label">Gate</div><div class="detail-value">${booking.gate}</div></div>
    <div class="detail detail-wide"><div class="detail-label">Passenger</div><div class="detail-value">${booking.passenger}</div></div>
    <div class="detail"><div class="detail-label">Booking</div><div class="detail-value">${bookingCode}</div></div>
    <div class="detail"><div class="detail-label">Class</div><div class="detail-value">${booking.bookingClass}</div></div>
    <div class="detail"><div class="detail-label">Status</div><div class="detail-value status-ok">Confirmed ✓</div></div>
  </div>
  <hr class="tear"/>
  <div class="barcode-section">
    <svg class="barcode-svg" viewBox="0 0 192 60" xmlns="http://www.w3.org/2000/svg">
      ${generateBarcodeSvg(bookingCode)}
    </svg>
    <div class="barcode-code">${bookingCode}</div>
  </div>
  <button class="wallet-btn" onclick="alert('Certificado Apple necessário para adicionar à Carteira em produção.')">
    🍎 Adicionar à Carteira
  </button>
  <div class="powered">Powered by Onfly Copilot · Claude API</div>
</div>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

export default router;
