import { configureStore } from "@reduxjs/toolkit"
import multipleChoiceListReducer from "./features/multipleChoiceList/multipleChoiceListSlice"
import playerReducer from "./features/player/playerSlice"
import gameReducer from "./features/game/gameSlice"
import { useDispatch, useSelector } from "react-redux"

export const store = configureStore({
  reducer: {
    multipleChoiceList: multipleChoiceListReducer,
    player: playerReducer,
    game: gameReducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()