import React from "react"

type TCallback<P extends any[] = any[], R = void> = (...args: P) => R

interface ICanvasInfo {
    canvas?: HTMLCanvasElement
    width?: number
    height?: number
    context?: CanvasRenderingContext2D
}

type TInitReturnValue = {
    animationLoop?: TCallback<[number, TCallback]>
} | void

export type TCanvasInitCallback = TCallback<[Required<ICanvasInfo>], TInitReturnValue >

export const useCanvas = (init: TCanvasInitCallback) => {
    const canvasInfoRef = React.useRef<ICanvasInfo>({})
    const intervalIdRef = React.useRef<number | undefined>()

    React.useEffect(() => {
        if (!canvasInfoRef.current.canvas) {
            return
        }
        const info = canvasInfoRef.current as Required<ICanvasInfo>
        const result = init(info)
        if (!result) {
            return
        }
        const { animationLoop } = result
        if (animationLoop) {
            let tick = 1
            const handler = () => {
                const next = () => {
                    intervalIdRef.current = window.requestAnimationFrame(handler)
                }
                animationLoop(tick++, next)
            }
            intervalIdRef.current = window.requestAnimationFrame(handler)
        }
        return () => {
            if (!intervalIdRef.current) {
                return
            }
            window.cancelAnimationFrame(intervalIdRef.current)
        }
    }, [init])

    const cb: React.LegacyRef<HTMLCanvasElement> = React.useCallback((node: HTMLCanvasElement | null) => {
        const canvasInfo = canvasInfoRef.current
        if (node === null) {
            canvasInfo.canvas = undefined
            canvasInfo.width = undefined
            canvasInfo.height = undefined
            canvasInfo.context = undefined
            if (!intervalIdRef.current) {
                return
            }
            window.cancelAnimationFrame(intervalIdRef.current)
            return
        }
        canvasInfo.canvas = node;
        canvasInfo.width = node.width;
        canvasInfo.height = node.height;
        canvasInfo.context = node.getContext("2d")!
    }, [])

    return cb;
}