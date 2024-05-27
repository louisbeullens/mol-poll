import { ICreateEntityDTO, IMultipleChoice, IMultipleChoiceList, IMultipleChoiceListSubmission } from "../common/types"
import { IndexedDBApi } from "./db"

const sanitizeDTO = (dto: ICreateEntityDTO<IMultipleChoiceList, "id">) => ({
    ...dto,
    multipleChoice: dto.multipleChoice.map(({ checked, ...el }: IMultipleChoice<{ checked?: string }>) => ({
        ...el
    }))
})

class MultipleChoiceListApi extends IndexedDBApi<IMultipleChoiceList> {
    async addOne(dto: ICreateEntityDTO<IMultipleChoiceList, "id">, transaction?: IDBTransaction): Promise<IMultipleChoiceList> {
        dto = sanitizeDTO(dto)
        return super.addOne(dto, transaction)
    }

    async upsertOne(dto: ICreateEntityDTO<IMultipleChoiceList, "id">, transaction?: IDBTransaction): Promise<IMultipleChoiceList> {
        dto = sanitizeDTO(dto)
        return super.upsertOne(dto, transaction)
    }

    async submitAnswer(multipleChoiceListId: string, answer: Partial<IMultipleChoiceListSubmission>, transaction?: IDBTransaction) {
        const {playerId, startDate, ...rest} = answer
        if (!playerId || !startDate) {
            throw new Error("missing fields")
        }
        const multipleChoiceList = await this.fetchById(multipleChoiceListId, transaction) as IMultipleChoiceList
        multipleChoiceList.answers[playerId] = {
            ...(multipleChoiceList.answers[playerId] ?? {}),
            playerId,
            ...rest
        }
        if (!multipleChoiceList.answers[playerId].startDate) {
            multipleChoiceList.answers[playerId].startDate = startDate
        }
        this.updateOne(multipleChoiceList, transaction)
        return multipleChoiceList
    }
}

export const multipleChoiceListApi = new MultipleChoiceListApi("multipleChoiceList", "id")