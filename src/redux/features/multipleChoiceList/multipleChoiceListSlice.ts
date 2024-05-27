import { createAsyncThunk, createDraftSafeSelector, createEntityAdapter, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../../store"
import { IMultipleChoiceList, IMultipleChoiceListSubmission } from "../../../common/types"
import { createExtraEntityReducers } from "../../../api/entity-api"
import { multipleChoiceListApi } from "../../../api/multiple-choice-list.api"

type EntityKey = string

const entityAdapter = createEntityAdapter({
    selectId: (entity: IMultipleChoiceList) => entity.id,
    sortComparer: (a, b) => a.name.localeCompare(b.name),
})

const [extraActions, buildExtraReducers] = createExtraEntityReducers<IMultipleChoiceList, "id", EntityKey>("multipleChoiceList", multipleChoiceListApi)

interface ISubmitAnswerPayload {
    multipleChoiceListId: EntityKey,
    answer: Partial<IMultipleChoiceListSubmission>
}

const submitAnswer = createAsyncThunk("multipleChoiceList/submitAnswer", ({ multipleChoiceListId, answer }: ISubmitAnswerPayload) => {
    return multipleChoiceListApi.submitAnswer(multipleChoiceListId, answer)
})

export const entitySlice = createSlice({
    name: "multipleChoiceList",
    initialState: entityAdapter.getInitialState(),
    reducers: {},
    extraReducers: (builder) => {
        buildExtraReducers(entityAdapter, builder)
        builder.addCase(submitAnswer.fulfilled, (state, { payload }) => {
            entityAdapter.setOne(state, payload)
        })
    },
})

export const multipleChoiceListSelectors = {
    ...entityAdapter.getSelectors((state: RootState) => state.multipleChoiceList),
    selectByName: (state: RootState, name: string) => Object.values(state.multipleChoiceList.entities).find(el => el.name === name)
}

export const multipleChoiceListActions = {
    ...entitySlice.actions,
    ...extraActions,
    submitAnswer: (multipleChoiceListId: EntityKey, answer: IMultipleChoiceListSubmission) => submitAnswer({ multipleChoiceListId, answer })
}

export default entitySlice.reducer