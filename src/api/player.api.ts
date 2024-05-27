import { IPlayer } from "../common/types"
import { playerActions } from "../redux/features/player/playerSlice"
import { store } from "../redux/store"
import { IndexedDBApi } from "./db"

class PlayerApi extends IndexedDBApi<IPlayer> {
    setCurrentPlayerId(id: string) {
        window.localStorage.setItem("currentPlayerId", id)
        store.dispatch(playerActions.setCurrentPlayerId(id))
    }
    startFetchCurrentPlayer() {
        const id = store.getState().player.currentPlayerId
        if (!id) {
            return
        }
        store.dispatch(playerActions.fetchById(id))
    }
}

export const playerApi = new PlayerApi("player", "id")