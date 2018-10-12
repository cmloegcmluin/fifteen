import * as React from 'react'
import { ConfigOptionProps } from './types'

const ConfigOption: (configOptionProps: ConfigOptionProps) => JSX.Element =
    (configOptionProps: ConfigOptionProps): JSX.Element => {
        const { configEntry, configSelectorProps, invalid } = configOptionProps
        const [ configKey, configValue ] = configEntry
        const {
            song,
            entities,
            actualCurrentConfig,
            interfaceConfig,
            handleConfigChangeEvent,
            handleConfigSubmitEvent,
        } = configSelectorProps
        const onChange: (event: React.SyntheticEvent<HTMLInputElement>) => void =
            (event: React.SyntheticEvent<HTMLInputElement>): void => {
                handleConfigChangeEvent({ configKey, event, interfaceConfig })
            }
        const onKeyPress: (event: React.KeyboardEvent) => void =
            (event: React.KeyboardEvent): void => {
                handleConfigSubmitEvent({ configKey, entities, event, actualCurrentConfig, song })
            }
        const className: string = invalid ? 'invalid' : ''

        return (
            <div>
                {configKey}
                <input {...{ onChange, onKeyPress, value: configValue, className }}/>
            </div>
        )
    }

export default ConfigOption
