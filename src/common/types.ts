export type IMultipleChoice<T extends {} = {}> = {
    question: string
    labels: string[]
} & T

export interface IMultipleChoiceListSubmission {
    playerId: string
    startDate: string
    finishDate: string
    choices: Array<number | null>
}

export type IMultipleChoiceList<T extends {} = {}> = {
    id: string
    name: string
    multipleChoice: IMultipleChoice<T>[],
    answers: Record<string, IMultipleChoiceListSubmission>
}

export interface IPlayer {
    id: string
    name: string
}

export interface IGamePlayerSubscription {
    role: "player" | "admin"
}

export interface IGame {
    id: string
    name: string
    players: Record<string, IGamePlayerSubscription>
}

export type ICreateEntityDTO<T extends {}, K extends keyof T> = Omit<T,K> & Partial<Pick<T,K>>

export type ICreatePlayerDTO = ICreateEntityDTO<IPlayer, "id">
