import { PayloadAction, createEntityAdapter, createSlice } from "@reduxjs/toolkit"
import { RootState, useAppSelector } from "../../store"
import { IPlayer } from "../../../common/types"
import { playerApi } from "../../../api/player.api"
import { createExtraEntityReducers } from "../../../api/entity-api"

const entityAdapter = createEntityAdapter({
    selectId: (player: IPlayer) => player.id,
    sortComparer: (a, b) => a.name.localeCompare(b.name),
})

const [extraActions, buildExtraReducers] = createExtraEntityReducers<IPlayer, "id", string>("player", playerApi)

export const entitySlice = createSlice({
    name: "player",
    initialState: entityAdapter.getInitialState({
        currentPlayerId: window.localStorage.getItem("currentPlayerId") ?? ""
    }),
    reducers: {
        setCurrentPlayerId: (state, { payload }: PayloadAction<string>) => {
            state.currentPlayerId = payload
        }
    },
    extraReducers: (builder) => {
        buildExtraReducers(entityAdapter, builder)
    },
})

export const playerSelectors = {
    ...entityAdapter.getSelectors((state: RootState) => state.player)
}

export const playerActions = { ...entitySlice.actions, ...extraActions }

export const useCurrentPlayer = () => useAppSelector(state => playerSelectors.selectById(state, state.player.currentPlayerId))

export default entitySlice.reducer