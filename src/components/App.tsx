import * as React from 'react'
import { connect } from 'react-redux'
import { Pattern, PatternId, PatternMetadata, patterns } from '../../patterns'
import { ImmutableRootState, RootStateKeys } from '../state'
import PatternList from './PatternList'
import PatternListener from './PatternListener'
import PatternSpecInputs from './PatternSpecInputs'
import ThreadsChangeListener from './ThreadsChangeListener'
import TimeControls from './TimeControls'
import { AppProps } from './types'

const mapStateToProps: (state: ImmutableRootState) => AppProps =
    (state: ImmutableRootState): AppProps => ({
        patternId: state.get(RootStateKeys.PATTERN_ID),
    })

const patternDescription: (patternId: PatternId) => string =
    (patternId: PatternId): string => {
        const pattern: Pattern = patterns[ patternId ]
        const patternMetadata: PatternMetadata = pattern.metadata

        return `${patternMetadata.formattedName}: ${patternMetadata.description}`
    }

const App: (appProps: AppProps) => JSX.Element =
    ({ patternId }: AppProps): JSX.Element => (
        <div>
            <h1>Musical Patterns</h1>
            <PatternList/>

            {patternId && <div>
                <div>{patternDescription(patternId)}</div>
                <PatternSpecInputs/>

                <TimeControls/>

                <PatternListener {...{ patternId }}/>
                <ThreadsChangeListener/>
            </div>}
        </div>
    )

export default connect(mapStateToProps)(App)
