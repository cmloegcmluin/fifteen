import { Cents, centsToShiftFromOneFrequencyToAnother, pitchToCents, to } from '../../../src/indexForTest'

describe('cents', () => {
    describe('#pitchToCents', () => {
        it('gives the cents value of the pitch', () => {
            const actual: Cents = pitchToCents(to.Scalar(3 / 2))

            expect(actual)
                .toEqual(to.Cents(701.9550008653874))
        })
    })

    describe('#centsToShiftFromOneFrequencyToAnother', () => {
        it('gives the number of cents required to shift by to change from the first frequency to the second', () => {
            const actual: Cents = centsToShiftFromOneFrequencyToAnother(to.Frequency(523.25), to.Frequency(4186))

            expect(actual)
                .toEqual(to.Cents(3600))
        })
    })
})
