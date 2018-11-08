const doAfterThisRender: (fn: () => void) => void =
    (fn: () => void): void => {
        setTimeout(fn, 0)
    }

export {
    doAfterThisRender,
}
