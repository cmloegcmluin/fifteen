import { Count, from } from '../nominal'

const repeat: <T>(array: T[], count: Count) => T[] =
    <T>(array: T[], count: Count): T[] => {
        let output: T[] = []
        for (let i: number = 0; i < from.Count(count); i++) {
            output = output.concat(array)
        }

        return output
    }

export {
    repeat,
}
