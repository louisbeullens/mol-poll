import { ActionReducerMapBuilder, EntityAdapter, EntityId, EntityState, createAsyncThunk } from "@reduxjs/toolkit";
import { ICreateEntityDTO } from "../common/types";
import { uuid } from "../common/util";

export class EntityApi<T extends {}, I extends keyof T, IT extends EntityId = string> {
    constructor(public idName: I) { }

    async addOne(dto: ICreateEntityDTO<T, I>): Promise<T> {
        return {
            ...dto,
            [this.idName]: uuid()
        } as T
    }

    async addMany(dtos: ICreateEntityDTO<T, I>[]): Promise<T[]> {
        return Promise.all(dtos.map(dto => this.addOne(dto)))
    }

    async upsertOne(dto: ICreateEntityDTO<T, I>): Promise<T> {
        return {
            ...dto,
            [this.idName]: dto[this.idName] ?? uuid()
        } as T
    }

    async upsertMany(dtos: ICreateEntityDTO<T, I>[]): Promise<T[]> {
        return Promise.all(dtos.map(dto => this.upsertOne(dto)))
    }

    async updateOne(entity: T): Promise<T> {
        return entity
    }

    async updateMany(dtos: T[]): Promise<T[]> {
        return Promise.all(dtos.map(dto => this.updateOne(dto)))
    }

    async removeOne(id: IT): Promise<void> {
        throw new Error("Method not implemented.")
    }

    async removeMany(ids: IT[]): Promise<void> {
        await Promise.all(ids.map(id => this.removeOne(id)))
    }

    async removeAll(): Promise<void> {
        throw new Error("Method not implemented.")
    }

    async fetchById(id: IT): Promise<T> {
        throw new Error("Method not implemented.")
    }

    async fetchByIds(ids: IT[]): Promise<T[]> {
        return Promise.all(ids.map(id => this.fetchById(id)))
    }

    async fetchAll(): Promise<T[]> {
        throw new Error("Method not implemented.")
    }
}

export const createExtraEntityReducers = <T extends { id: EntityId }, I extends keyof T = "id", IT extends EntityId = EntityId>(sliceName: string, entityApi: EntityApi<T, I, IT>) => {
    const createOne = createAsyncThunk(`${sliceName}/addOneAsync`, async (dto: ICreateEntityDTO<T, I>) => {
        return entityApi.addOne(dto)
    })

    const createMany = createAsyncThunk(`${sliceName}/addManyAsync`, async (dtos: ICreateEntityDTO<T, I>[]) => {
        return entityApi.addMany(dtos)
    })

    const upsertOne = createAsyncThunk(`${sliceName}/upsertOneAsync`, async (dto: ICreateEntityDTO<T, I>) => {
        return entityApi.upsertOne(dto)
    })

    const upsertMany = createAsyncThunk(`${sliceName}/upsertManyAsync`, async (dtos: ICreateEntityDTO<T, I>[]) => {
        return entityApi.upsertMany(dtos)
    })

    const updateOne = createAsyncThunk(`${sliceName}/updateOneAsync`, async (entity: T) => {
        return entityApi.updateOne(entity)
    })

    const updateMany = createAsyncThunk(`${sliceName}/updateManyAsync`, async (entities: T[]) => {
        return entityApi.updateMany(entities)
    })

    const removeOne = createAsyncThunk(`${sliceName}/removeOneAsync`, async (id: IT) => {
        await entityApi.removeOne(id)
        return id
    })

    const removeMany = createAsyncThunk(`${sliceName}/removeManyAsync`, async (ids: IT[]) => {
        await entityApi.removeMany(ids)
        return ids
    })

    const removeAll = createAsyncThunk(`${sliceName}/removeAllAsync`, async () => {
        await entityApi.removeAll()
    })

    const fetchById = createAsyncThunk(`${sliceName}/fetchByIdAsync`, async (id: IT) => {
        return entityApi.fetchById(id)
    })

    const fetchByIds = createAsyncThunk(`${sliceName}/fetchByIdsAsync`, async (ids: IT[]) => {
        return entityApi.fetchByIds(ids)
    })

    const fetchAll = createAsyncThunk(`${sliceName}/fetchAllAsync`, async () => {
        return entityApi.fetchAll()
    })

    return [{ createOne, createMany, upsertOne, upsertMany, updateOne, updateMany, removeOne, removeMany, removeAll, fetchById, fetchByIds, fetchAll }, (entityAdapter: EntityAdapter<T, IT>, builder: ActionReducerMapBuilder<EntityState<T, IT>>) => {
        builder.addCase(createOne.fulfilled, (state, { payload }) => {
            entityAdapter.addOne(state, payload)
        })
        builder.addCase(createMany.fulfilled, (state, { payload }) => {
            entityAdapter.addMany(state, payload)
        })
        builder.addCase(upsertOne.fulfilled, (state, { payload }) => {
            entityAdapter.upsertOne(state, payload)
        })
        builder.addCase(upsertMany.fulfilled, (state, { payload }) => {
            entityAdapter.upsertMany(state, payload)
        })
        builder.addCase(updateOne.fulfilled, (state, { payload }) => {
            entityAdapter.setOne(state, payload)
        })
        builder.addCase(updateMany.fulfilled, (state, { payload }) => {
            entityAdapter.setMany(state, payload)
        })
        builder.addCase(removeOne.fulfilled, (state, { payload }) => {
            entityAdapter.removeOne(state, payload)
        })
        builder.addCase(removeMany.fulfilled, (state, { payload }) => {
            entityAdapter.removeMany(state, payload)
        })
        builder.addCase(removeAll.fulfilled, (state) => {
            entityAdapter.removeAll(state)
        })
        builder.addCase(fetchById.fulfilled, (state, { payload }) => {
            entityAdapter.upsertOne(state, payload)
        })
        builder.addCase(fetchByIds.fulfilled, (state, { payload }) => {
            entityAdapter.upsertMany(state, payload)
        })
        builder.addCase(fetchAll.fulfilled, (state, { payload }) => {
            entityAdapter.upsertMany(state, payload)
        })
    }] as const
}