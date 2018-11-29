// tslint:disable:variable-name no-any

import { Index } from '@musical-patterns/utilities'
import { Block } from './types'

const Block: (block: Array<Index | number> | Index[]) => number[] =
    (block: Array<Index | number> | Index[]): number[] => block as any

export {
    Block,
}
