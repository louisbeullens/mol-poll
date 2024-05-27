import { IMultipleChoice, IMultipleChoiceList, IPlayer } from "./types";
import { uuid } from "./util";

export const createMultipleChoice = (question: string = "", labels: string[] = [], correct: number = -1) => ({
    question,
    labels,
    correct: correct < 0 ? "" : correct.toString(),
} as IMultipleChoice)

export const createMultipleChoiceList = (multipleChoice: IMultipleChoice[] = [], name = "DRAFT") => ({
    id: uuid(),
    name,
    multipleChoice,
    answers: {}
} as IMultipleChoiceList)

export const extractChoicesFromMultipleChoiceList = (list: IMultipleChoiceList, playerId: IPlayer["id"]) => {
    return Array.from({ length: list.multipleChoice.length }, (el, i) => list.answers[playerId]?.choices[i] ?? null)
        .map(el => el === null ? null : el.toString()) as unknown as string[]
}