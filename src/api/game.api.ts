import { IGame } from "../common/types"
import { gameActions } from "../redux/features/game/gameSlice"
import { store } from "../redux/store"
import { IndexedDBApi } from "./db"

class GameApi extends IndexedDBApi<IGame> {
    setCurrentGameId(id: string) {
        window.localStorage.setItem("currentGameId", id)
        store.dispatch(gameActions.setCurrentGameId(id))
    }
    startFetchCurrentGame() {
        const id = store.getState().game.currentGameId
        if (!id) {
            return
        }
        store.dispatch(gameActions.fetchById(id))
    }
}

export const gameApi = new GameApi("game", "id")