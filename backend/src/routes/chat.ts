import { Router, type Request, type Response } from 'express';
import { sessionStore } from '../services/session.js';
import { chat, type PassengerSummaryData } from '../services/agent.js';
import { getOnflyToken } from '../services/onfly-auth.js';
import type { FlightOption, HotelOption } from '../services/session.js';

const router = Router();

router.post('/chat', async (req: Request, res: Response) => {
  const { message, sessionId, timezone, onflyToken } = req.body;

  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'Campo "message" é obrigatório' });
    return;
  }

  const session = sessionStore.getOrCreate(sessionId);

  // Set Onfly token: widget-provided or server-side auth
  if (onflyToken) {
    session.onflyToken = onflyToken;
  } else if (!session.onflyToken) {
    try {
      session.onflyToken = await getOnflyToken();
    } catch (err) {
      console.log('⚠️ [Chat] Falha ao obter token Onfly:', (err as Error).message);
    }
  }

  // SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.setHeader('X-Session-Id', session.id);
  res.flushHeaders();

  // Send session info
  res.write(`data: ${JSON.stringify({ type: 'session', sessionId: session.id })}\n\n`);

  await chat(session, message, timezone || 'America/Sao_Paulo', {
    onText(text) {
      res.write(`data: ${JSON.stringify({ type: 'text', content: text })}\n\n`);
    },
    onToolUse(toolName) {
      res.write(`data: ${JSON.stringify({ type: 'tool_start', tool: toolName })}\n\n`);
    },
    onToolResult(toolName) {
      res.write(`data: ${JSON.stringify({ type: 'tool_end', tool: toolName })}\n\n`);
    },
    onFlightOptions(flights: FlightOption[]) {
      res.write(`data: ${JSON.stringify({ type: 'flight_options', flights })}\n\n`);
    },
    onHotelOptions(hotels: HotelOption[]) {
      res.write(`data: ${JSON.stringify({ type: 'hotel_options', hotels })}\n\n`);
    },
    onPassengerSummary(data: PassengerSummaryData) {
      res.write(`data: ${JSON.stringify({ type: 'passenger_summary', data })}\n\n`);
    },
    onBookingConfirmed(booking) {
      res.write(`data: ${JSON.stringify({ type: 'booking_confirmed', booking })}\n\n`);
    },
    onEnd() {
      if (session.trip?.bookingCode) {
        res.write(`data: ${JSON.stringify({ type: 'pass_link', url: `/api/pass/${session.trip.bookingCode}` })}\n\n`);
      }
      res.write(`data: ${JSON.stringify({ type: 'done', trip: session.trip })}\n\n`);
      res.end();
    },
    onError(error) {
      res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
      res.end();
    },
  });
});

// Get session state
router.get('/session/:id', (req: Request, res: Response) => {
  const session = sessionStore.get(req.params.id as string);
  if (!session) {
    res.status(404).json({ error: 'Sessão não encontrada' });
    return;
  }
  res.json({
    id: session.id,
    trip: session.trip,
    messageCount: session.messages.length,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
  });
});

export default router;
