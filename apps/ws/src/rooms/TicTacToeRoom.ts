import { Room, Client } from "colyseus";
import { Schema, type, MapSchema } from "@colyseus/schema";
// @colyseus/schema v4 — decorators API unchanged, types refined

// ── State ─────────────────────────────────────────────────────────────────

class PlayerState extends Schema {
  @type("string") sessionId: string = "";
  @type("string") username: string = "Anonymous";
  @type("string") symbol: string = ""; // "X" or "O"
  @type("boolean") ready: boolean = false;
}

class TicTacToeState extends Schema {
  @type({ map: PlayerState }) players = new MapSchema<PlayerState>();
  @type(["string"]) board: string[] = Array(9).fill(""); // 9 cells
  @type("string") currentTurn: string = ""; // sessionId of current player
  @type("string") winner: string = ""; // sessionId, "draw", or ""
  @type("string") phase: string = "waiting"; // waiting | playing | finished
}

// ── Room ──────────────────────────────────────────────────────────────────

export class TicTacToeRoom extends Room<TicTacToeState> {
  maxClients = 2;

  onCreate() {
    this.setState(new TicTacToeState());

    this.onMessage("ready", (client) => {
      const player = this.state.players.get(client.sessionId);
      if (!player) return;
      player.ready = true;
      this.tryStartGame();
    });

    this.onMessage("move", (client, message: { cell: number }) => {
      this.handleMove(client, message.cell);
    });
  }

  onJoin(client: Client, options: { username?: string }) {
    const player = new PlayerState();
    player.sessionId = client.sessionId;
    player.username = options.username ?? "Anonymous";
    player.symbol = this.state.players.size === 0 ? "X" : "O";
    this.state.players.set(client.sessionId, player);

    client.send("joined", {
      symbol: player.symbol,
      message: `You are playing as ${player.symbol}`,
    });
  }

  onLeave(client: Client) {
    this.state.players.delete(client.sessionId);
    if (this.state.phase === "playing") {
      this.state.phase = "finished";
      this.state.winner = "abandoned";
      this.broadcast("game_abandoned", { reason: "Opponent disconnected" });
    }
  }

  private tryStartGame() {
    const players = Array.from(this.state.players.values());
    if (players.length === 2 && players.every((p) => p.ready)) {
      this.state.phase = "playing";
      // X always goes first
      const xPlayer = players.find((p) => p.symbol === "X")!;
      this.state.currentTurn = xPlayer.sessionId;
      this.broadcast("game_start", {
        currentTurn: this.state.currentTurn,
      });
    }
  }

  private handleMove(client: Client, cell: number) {
    if (this.state.phase !== "playing") return;
    if (this.state.currentTurn !== client.sessionId) return;
    if (cell < 0 || cell > 8) return;
    if (this.state.board[cell] !== "") return;

    const player = this.state.players.get(client.sessionId);
    if (!player) return;

    // Apply move
    this.state.board[cell] = player.symbol;

    // Check winner
    const winner = this.checkWinner();
    if (winner) {
      this.state.phase = "finished";
      this.state.winner =
        winner === "draw" ? "draw" : this.findSessionBySymbol(winner) ?? "";
      this.broadcast("game_over", {
        winner: this.state.winner,
        winSymbol: winner,
        board: this.state.board,
      });
      return;
    }

    // Switch turns
    const players = Array.from(this.state.players.keys());
    this.state.currentTurn =
      players.find((id) => id !== client.sessionId) ?? "";
  }

  private checkWinner(): string | null {
    const b = this.state.board;
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
      [0, 4, 8], [2, 4, 6],             // diagonals
    ];

    for (const [a, b2, c] of lines) {
      if (b[a] && b[a] === b[b2] && b[a] === b[c]) {
        return b[a] as string;
      }
    }

    if (b.every((cell) => cell !== "")) return "draw";
    return null;
  }

  private findSessionBySymbol(symbol: string): string | undefined {
    for (const [sessionId, player] of this.state.players) {
      if (player.symbol === symbol) return sessionId;
    }
    return undefined;
  }
}
