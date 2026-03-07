import { LobbyRoom as ColyseusLobbyRoom } from "colyseus";

/**
 * Built-in Colyseus LobbyRoom — re-exported for registration.
 * Automatically lists all rooms that call `.enableRealtimeListing()`.
 * Clients use this to discover available game rooms before joining.
 */
export { ColyseusLobbyRoom as LobbyRoom };
