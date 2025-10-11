import 'server-only';

export type Tile = 'correct'|'present'|'absent';
export type Row = { guess: string; result: Tile[] };

export type Meta = {
    puzzleId: string;
    len: number;
    periodLabel: string;
    expiresAt: number;
    maxGuesses: number;
    periodDays: number;
    pow: { bits: number; prefix: string; sig: string };
};
export type GuessRequest = {
    puzzleId: string;
    guess: string;
    pow: { bits: number; prefix: string; nonce: string; sig: string };
};
export type GuessResponse = {
    ok: boolean;
    result?: ('correct'|'present'|'absent')[];
    win?: boolean;
    remaining?: number;
    error?: string;
};
