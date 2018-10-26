import { Count, from, Index, Offset, to } from '../nominal'
import { applyOffset } from './applyOffset'
import { wrapWithin } from './wrapWithin'

const rotateCycle: <T>(array: T[], rotationOffset: Offset) => T[] =
    <T>(array: T[], rotationOffset: Offset): T[] => {
        const output: T[] = []
        const cellCount: Count = to.Count(array.length)

        for (let i: Index = to.Index(0); i < to.Index(from.Count(cellCount)); i = applyOffset(i, to.Offset(1))) {
            let index: Index = applyOffset(i, rotationOffset)
            index = to.Index(wrapWithin(from.Index(index), from.Count(cellCount)))
            output.push(array[from.Index(index)])
        }

        return output
    }

export {
    rotateCycle,
}
