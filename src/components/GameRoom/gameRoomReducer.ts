export enum PlayerActionKind {
    JOIN = "JOIN",
    LEAVE = "LEAVE",
    UPDATE_BET = "UPDATE_BET",
}

export enum PresenterActionKind {
    SWITCH_IS_PLAYED = "SWITCH_IS_PLAYED",
}

export interface Player {
    id: string;
    name: string;
    bet: {
        currentBet: number;
        previousBet: number;
    };
    seatNumber: number;
}

export interface PlayerActions {
    type: PlayerActionKind;
    payload: Player;
}

export interface PresenterActions {
    type: PresenterActionKind.SWITCH_IS_PLAYED;
}

export interface GameRoomState {
    playersSeats: ("empty" | Player)[];
    isGameStarted: boolean;
}

export const initialRoomState: GameRoomState = {
    playersSeats: ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
    isGameStarted: false,
};

export function gameRoomReducer(state: GameRoomState, action: PlayerActions | PresenterActions): GameRoomState {
    const { type } = action;
    switch (type) {
        case PlayerActionKind.JOIN:
        {
            const { payload } = action;
            if (payload.seatNumber < 0 || payload.seatNumber > 6 || state.playersSeats.at(payload.seatNumber) !== "empty") {
                return state;
            }

            return {
                ...state,
                playersSeats: [
                    ...state.playersSeats.slice(0, payload.seatNumber),
                    payload,
                    ...state.playersSeats.slice(payload.seatNumber + 1)],
            };
        }
        case PlayerActionKind.LEAVE:
        {
            const { payload } = action;
            const searchedSeat = state.playersSeats.at(payload.seatNumber);
            if (searchedSeat !== "empty" && searchedSeat?.id === payload.id) {
                return {
                    ...state,
                    playersSeats: [
                        ...state.playersSeats.slice(0, payload.seatNumber),
                        "empty",
                        ...state.playersSeats.slice(payload.seatNumber + 1),
                    ],
                };
            }
            return state;
        }
        case PlayerActionKind.UPDATE_BET:
        {
            const { payload } = action;
            const searchedSeat = state.playersSeats.at(payload.seatNumber);
            if (searchedSeat !== "empty" && searchedSeat?.id === payload.id) {
                return {
                    ...state,
                    playersSeats: [
                        ...state.playersSeats.slice(0, payload.seatNumber),
                        payload,
                        ...state.playersSeats.slice(payload.seatNumber + 1),
                    ],
                };
            }
            return state;
        }
        case PresenterActionKind.SWITCH_IS_PLAYED:
            return {
                ...state,
                playersSeats: state.isGameStarted ? [...state.playersSeats.map((seat) => {
                    if (seat === "empty") { return seat; }
                    return {
                        ...seat,
                        bet: {
                            currentBet: 0,
                            previousBet: seat.bet.currentBet,
                        },
                    };
                })] : state.playersSeats,
                isGameStarted: !state.isGameStarted,
            };
    }
}
