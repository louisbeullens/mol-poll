import { PayloadAction, createEntityAdapter, createSlice } from "@reduxjs/toolkit"
import { RootState, store, useAppSelector } from "../../store"
import { IGame } from "../../../common/types"
import { createExtraEntityReducers } from "../../../api/entity-api"
import { gameApi } from "../../../api/game.api"

const entityAdapter = createEntityAdapter({
    selectId: (game: IGame) => game.id,
    sortComparer: (a, b) => a.name.localeCompare(b.name),
})

const [extraActions, buildExtraReducers] = createExtraEntityReducers<IGame, "id", string>("game", gameApi)

export const entitySlice = createSlice({
    name: "game",
    initialState: entityAdapter.getInitialState({
        currentGameId: window.localStorage.getItem("currentGameId") ?? ""
    }),
    reducers: {
        setCurrentGameId: (state, { payload }: PayloadAction<string>) => {
            state.currentGameId = payload
        }
    },
    extraReducers: (builder) => {
        buildExtraReducers(entityAdapter, builder)
    },
})

export const gameSelectors = {
    ...entityAdapter.getSelectors((state: RootState) => state.game)
}

export const gameActions = { ...entitySlice.actions, ...extraActions }

export const useCurrentGame = () => useAppSelector(state => gameSelectors.selectById(state, state.game.currentGameId))

export default entitySlice.reducer