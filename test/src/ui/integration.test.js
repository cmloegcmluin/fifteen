import {clickElement, closeBrowser, fillInElement, findElement, openChrome, openTab} from 'puppet-strings'

let browser, tab, page

beforeAll(async () => {
    browser = await openChrome()
    tab = await openTab(browser, 'http://localhost:8080')
    page = tab.puppeteer.page
})

afterAll(async () => {
    await closeBrowser(browser)
})

const selectAnExamplePattern = async () => {
    const exampleSong = await findElement(tab, 'li#STEPWISE')
    await clickElement(exampleSong)
}

const elementExists = selector => page.evaluate(selector => !!document.querySelector(selector), selector)

const elementValue = selector => page.evaluate(selector => document.querySelector(selector).value, selector)

const elementInnerText = selector => page.evaluate(selector => document.querySelector(selector).innerText, selector)

describe('ui integration', () => {
    beforeEach(async () => {
        await selectAnExamplePattern()
    })

    it('shows a header for the pattern after you select it', async done => {
        await findElement(tab, 'h3', 'pattern spec')
        done()
    })

    it('does not immediately submit when you type into a pattern spec input', async done => {
        const input = await findElement(tab, 'input#patternPitchScalar')
        await fillInElement(input, '2')

        expect(await elementInnerText('.secret-submitted#patternPitchScalar'))
            .toBe('4186')

        done()
    })

    describe('submitting pattern spec changes', () => {
        it('submits a pattern spec input when you press enter', async done => {
            const input = await findElement(tab, 'input#patternPitchScalar')
            await fillInElement(input, '2')

            await clickElement(input)
            await page.keyboard.press('Enter')

            expect(await elementInnerText('.secret-submitted#patternPitchScalar'))
                .toBe('41862')

            done()
        })

        it('submits a pattern spec input when you press the submit button', async done => {
            const input = await findElement(tab, 'input#patternPitchScalar')
            await fillInElement(input, '2')

            const button = await findElement(tab, 'button#patternPitchScalar')
            await clickElement(button)

            expect(await elementInnerText('.secret-submitted#patternPitchScalar'))
                .toBe('41862')

            done()
        })

        it('does not submit all the pattern spec inputs when you press enter (only the one you are focused on)', async done => {
            const input = await findElement(tab, 'input#patternPitchScalar')
            await fillInElement(input, '2')

            const otherInput = await findElement(tab, 'input#patternDurationScalar')
            await fillInElement(otherInput, '2')

            await clickElement(input)
            await page.keyboard.press('Enter')

            expect(await elementInnerText('.secret-submitted#patternPitchScalar'))
                .toBe('41862')
            expect(await elementInnerText('.secret-submitted#patternDurationScalar'))
                .toBe('1')

            done()
        })

        it('does not submit all the pattern spec inputs when you press a submit button (only the one the button is for)', async done => {
            const input = await findElement(tab, 'input#patternPitchScalar')
            await fillInElement(input, '2')

            const otherInput = await findElement(tab, 'input#patternDurationScalar')
            await fillInElement(otherInput, '2')

            const button = await findElement(tab, 'button#patternPitchScalar')
            await clickElement(button)

            expect(await elementInnerText('.secret-submitted#patternPitchScalar'))
                .toBe('41862')
            expect(await elementInnerText('.secret-submitted#patternDurationScalar'))
                .toBe('1')

            done()
        })

        it('preserves earlier pattern spec changes you have made when you submit a second pattern spec input', async done => {
            const input = await findElement(tab, 'input#patternPitchScalar')
            await fillInElement(input, '2')
            await clickElement(input)
            await page.keyboard.press('Enter')

            const otherInput = await findElement(tab, 'input#patternDurationScalar')
            await fillInElement(otherInput, '2')
            await clickElement(otherInput)
            await page.keyboard.press('Enter')

            expect(await elementInnerText('.secret-submitted#patternPitchScalar'))
                .toBe('41862')
            expect(await elementInnerText('.secret-submitted#patternDurationScalar'))
                .toBe('12')

            done()
        })
    })

    describe('invalid inputs', () => {
        it('does not mark a pattern spec input as invalid if you only type invalid data but do not submit it', async done => {
            const input = await findElement(tab, 'input#patternPitchScalar')
            await fillInElement(input, 'sdiojg')

            await findElement(tab, 'input#patternPitchScalar.unsubmitted')

            done()
        })

        it('marks a pattern spec input as invalid when you submit invalid data, and it does not crash or recompile', async done => {
            const input = await findElement(tab, 'input#patternPitchScalar')
            await fillInElement(input, 'sdiojg')

            const button = await findElement(tab, 'button#patternPitchScalar')
            await clickElement(button)

            await findElement(tab, 'input#patternPitchScalar.invalid')

            expect(await elementInnerText('.secret-submitted#patternPitchScalar'))
                .toBe('4186')

            done()
        })

        it('resets the pattern spec input to valid state after typing anything into it', async done => {
            const input = await findElement(tab, 'input#patternPitchScalar')
            await fillInElement(input, 'sdiojg')

            const button = await findElement(tab, 'button#patternPitchScalar')
            await clickElement(button)

            await findElement(tab, 'input#patternPitchScalar.invalid')

            await fillInElement(input, 'jhjk')

            await findElement(tab, 'input#patternPitchScalar.unsubmitted')

            done()
        })
    })

    describe('unsubmitted inputs', () => {
        it('marks pattern spec inputs as unsubmitted when you alter their contents but then leave focus without submitting', async done => {
            const input = await findElement(tab, 'input#patternPitchScalar')
            await fillInElement(input, '3464')

            await findElement(tab, 'input#patternPitchScalar.unsubmitted')

            done()
        })

        it('does not mark a pattern spec input as unsubmitted if you fiddle with it but leave it the same as what you have already submitted', async done => {
            const input = await findElement(tab, 'input#patternPitchScalar')
            await fillInElement(input, '3464')

            await clickElement(input)
            for (let i = 0; i < 4; i++) {
                await page.keyboard.press('Backspace')
            }

            const otherInput = await findElement(tab, 'input#patternDurationScalar')
            await clickElement(otherInput)

            await findElement(tab, 'input#patternPitchScalar.submitted')

            done()
        })
    })

    it('keeps the pattern spec inputs in the same order after submitting a change', async done => {
        let inputIds = await page.evaluate(() =>
            Array.from(document.querySelectorAll('#pattern-spec-inputs input')).map(element => element.id),
        )
        expect(inputIds)
            .toEqual(['patternDurationScalar', 'patternPitchScalar'])

        const input = await findElement(tab, 'input#patternPitchScalar')
        await fillInElement(input, '3464')

        inputIds = await page.evaluate(() =>
            Array.from(document.querySelectorAll('#pattern-spec-inputs input')).map(element => element.id),
        )
        expect(inputIds)
            .toEqual(['patternDurationScalar', 'patternPitchScalar'])

        done()
    })

    describe('submit button', () => {
        it('enables the submit button for a pattern spec input after you type anything', async done => {
            expect(await elementExists('button#patternPitchScalar:disabled'))
                .toBeTruthy()

            const input = await findElement(tab, 'input#patternPitchScalar')
            await fillInElement(input, '3464')

            expect(await elementExists('button#patternPitchScalar:enabled'))
                .toBeTruthy()

            done()
        })

        it('resets the submit button to disabled when you click it', async done => {
            expect(await elementExists('button#patternPitchScalar:disabled'))
                .toBeTruthy()

            const input = await findElement(tab, 'input#patternPitchScalar')
            await fillInElement(input, '3464')

            expect(await elementExists('button#patternPitchScalar:enabled'))
                .toBeTruthy()

            const button = await findElement(tab, 'button#patternPitchScalar')
            await clickElement(button)

            expect(await elementExists('button#patternPitchScalar:disabled'))
                .toBeTruthy()

            done()
        })

        it('resets the submit button to disabled when you submit its pattern spec input via the keyboard', async done => {
            expect(await elementExists('button#patternPitchScalar:disabled'))
                .toBeTruthy()

            const input = await findElement(tab, 'input#patternPitchScalar')
            await fillInElement(input, '3464')

            expect(await elementExists('button#patternPitchScalar:enabled'))
                .toBeTruthy()

            await clickElement(input)
            await page.keyboard.press('Enter')

            expect(await elementExists('button#patternPitchScalar:disabled'))
                .toBeTruthy()

            done()
        })

        it('resets the submit button to disabled when you return its pattern spec input back to what you have already submitted', async done => {
            expect(await elementExists('button#patternPitchScalar:disabled'))
                .toBeTruthy()

            const input = await findElement(tab, 'input#patternPitchScalar')
            await fillInElement(input, '3464')

            expect(await elementExists('button#patternPitchScalar:enabled'))
                .toBeTruthy()

            await clickElement(input)
            for (let i = 0; i < 4; i++) {
                await page.keyboard.press('Backspace')
            }

            expect(await elementExists('button#patternPitchScalar:disabled'))
                .toBeTruthy()

            done()
        })
    })

    describe('submitting pattern changes', () => {
        it('resets all submitted pattern spec changes you have made when you select a pattern', async done => {
            const input = await findElement(tab, 'input#patternPitchScalar')
            await fillInElement(input, '2')
            await clickElement(input)
            await page.keyboard.press('Enter')

            const otherInput = await findElement(tab, 'input#patternDurationScalar')
            await fillInElement(otherInput, '2')
            await clickElement(otherInput)
            await page.keyboard.press('Enter')

            await selectAnExamplePattern()

            expect(await elementValue('input#patternPitchScalar'))
                .toBe('4186')
            expect(await elementValue('input#patternDurationScalar'))
                .toBe('1')

            done()
        })
    })
})
