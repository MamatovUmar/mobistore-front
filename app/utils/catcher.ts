export function catcher<T>(cb: (...args: any) => (T), error?: (err: Error) => void ) {
    return async (...args: any) => {
        try {
            await cb(...args)
        } catch (e) {
            console.error(e)
            error?.(e as Error)
        }
    }
}