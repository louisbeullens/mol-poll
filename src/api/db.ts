import { ICreateEntityDTO } from "../common/types"
import { EntityApi } from "./entity-api"

let db: IDBDatabase
let dbOpenRequest: IDBOpenDBRequest

export const initDb = () => {
    dbOpenRequest = window.indexedDB.open("demol", 3)
    dbOpenRequest.addEventListener("success", () => {
        db = dbOpenRequest.result
    }, { once: true })
    dbOpenRequest.addEventListener("upgradeneeded", (e: IDBVersionChangeEvent) => {
        db = dbOpenRequest.result
        for (const name of ["game", "multipleChoice", "multipleChoiceList", "player"]) {
            if (db.objectStoreNames.contains(name)) {
                continue
            }
            db.createObjectStore(name, {
                keyPath: "id"
            })
        }
    }, { once: true })
}

export const getDb = () => {
    if (db) {
        return Promise.resolve(db)
    }
    return Promise.race([
        new Promise<IDBDatabase>((resolve, reject) => {
            dbOpenRequest.addEventListener("success", () => {
                db = dbOpenRequest.result
                resolve(db)
            }, { once: true })
            dbOpenRequest.addEventListener("error", () => {
                db = dbOpenRequest.result
                reject(dbOpenRequest.error)
            }, { once: true })
        }),
        new Promise<never>((resolve, reject) => {
            window.setTimeout(reject, 2000, new Error("DBOpen Timeout Error"))
        })
    ])
}

type KeyOfType<T, U> = { [P in keyof T]: T[P] extends U ? P : never }[keyof T]

export class IndexedDBApi<T extends { id: string }, I extends keyof T = "id"> extends EntityApi<T, I> {
    constructor(public objectStoreName: string, idName: I) {
        super(idName)
    }

    protected async transact<M extends KeyOfType<IDBObjectStore, (...args: any[]) => any>, P extends Parameters<IDBObjectStore[M]>>(transaction: IDBTransaction | undefined, method: M, ...args: P) {
        const db = await getDb()
        return new Promise<any>((resolve, reject) => {
            transaction = transaction ?? db.transaction(this.objectStoreName, "readwrite")
            const req = (transaction.objectStore(this.objectStoreName)[method] as any)(...args) as IDBRequest<any>
            req.addEventListener("success", () => {
                resolve(req.result)
            }, { once: true })
            req.addEventListener("error", () => {
                reject(req.error)
            }, { once: true })
        })
    }

    async addOne(dto: ICreateEntityDTO<T, I>, transaction?: IDBTransaction): Promise<T> {
        const entity = await super.addOne(dto)
        await this.transact(transaction, "add", entity)
        return entity
    }

    async upsertOne(dto: ICreateEntityDTO<T, I>, transaction?: IDBTransaction): Promise<T> {
        if (!dto[this.idName]) {
            const entity = await super.addOne(dto)
            await this.transact(transaction, "add", entity)
            return entity
        }
        const entity = await super.upsertOne(dto)
        await this.transact(transaction, "put", entity)
        return entity
    }

    async updateOne(entity: T, transaction?: IDBTransaction): Promise<T> {
        await this.transact(transaction, "put", entity)
        return entity
    }

    async removeOne(id: string, transaction?: IDBTransaction): Promise<void> {
        await this.transact(transaction, "delete", id as string)
    }

    async removeAll(transaction?: IDBTransaction): Promise<void> {
        await this.transact(transaction, "clear")
    }

    async fetchById(id: string, transaction?: IDBTransaction): Promise<T> {
        return this.transact(transaction, "get", id)
    }

    async fetchAll(transaction?: IDBTransaction): Promise<T[]> {
        return this.transact(transaction, "getAll")
    }
}