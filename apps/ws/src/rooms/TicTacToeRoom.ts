import { Room, Client, type RoomOptions } from "@colyseus/core";
import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";

// ── State schemas ──────────────────────────────────────────────────────────

class PlayerState extends Schema {
  @type("string") sessionId: string = "";
  @type("string") username: string = "Anonymous";
  @type("string") symbol: string = ""; // "X" or "O"
  @type("boolean") ready: boolean = false;
}

class TicTacToeState extends Schema {
  @type({ map: PlayerState }) players = new MapSchema<PlayerState>();
  @type(["string"]) board = new ArraySchema<string>(...Array(9).fill("") as string[]);
  @type("string") currentTurn: string = ""; // sessionId of current player
  @type("string") winner: string = ""; // sessionId, "draw", or ""
  @type("string") phase: string = "waiting"; // waiting | playing | finished
}

// ── Room options (Colyseus 0.17 generic pattern) ───────────────────────────

interface TicTacToeRoomOptions extends RoomOptions {
  state: TicTacToeState;
}

// ── Room ───────────────────────────────────────────────────────────────────

export class TicTacToeRoom extends Room<TicTacToeRoomOptions> {
  maxClients = 2;

  onCreate() {
    this.setState(new TicTacToeState());

    this.onMessage<{ cell: number }>("move", (client, message) => {
      this.handleMove(client, message.cell);
    });

    this.onMessage("ready", (client) => {
      const player = this.state.players.get(client.sessionId);
      if (!player) return;
      player.ready = true;
      this.tryStartGame();
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
      const xPlayer = players.find((p) => p.symbol === "X");
      this.state.currentTurn = xPlayer?.sessionId ?? "";
      this.broadcast("game_start", { currentTurn: this.state.currentTurn });
    }
  }

  private handleMove(client: Client, cell: number) {
    if (this.state.phase !== "playing") return;
    if (this.state.currentTurn !== client.sessionId) return;
    if (cell < 0 || cell > 8) return;
    if (this.state.board.at(cell) !== "") return;

    const player = this.state.players.get(client.sessionId);
    if (!player) return;

    this.state.board[cell] = player.symbol;

    const result = this.checkWinner();
    if (result) {
      this.state.phase = "finished";
      this.state.winner =
        result === "draw" ? "draw" : (this.findSessionBySymbol(result) ?? "");
      this.broadcast("game_over", {
        winner: this.state.winner,
        winSymbol: result,
        board: [...this.state.board],
      });
      return;
    }

    // Switch turns
    const otherSessionId = Array.from(this.state.players.keys()).find(
      (id) => id !== client.sessionId
    );
    this.state.currentTurn = otherSessionId ?? "";
  }

  private checkWinner(): string | null {
    const b = this.state.board;
    const lines: [number, number, number][] = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
      [0, 4, 8], [2, 4, 6],             // diagonals
    ];

    for (const [a, b2, c] of lines) {
      const va = b.at(a);
      const vb = b.at(b2);
      const vc = b.at(c);
      if (va && va === vb && va === vc) return va;
    }

    if ([...b].every((cell) => cell !== "")) return "draw";
    return null;
  }

  private findSessionBySymbol(symbol: string): string | undefined {
    for (const [sessionId, player] of this.state.players) {
      if (player.symbol === symbol) return sessionId;
    }
    return undefined;
  }
}
