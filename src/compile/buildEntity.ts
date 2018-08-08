import { Entity, Timbre, Voice, VoiceType } from '../types'
import * as to from '../utilities/to'
import buildOscillatorVoice from './buildOscillatorVoice'
import buildSampleVoice from './buildSampleVoice'
import { EntityConfig } from './types'

const buildEntity: (entityConfig: EntityConfig) => Entity =
    ({
         nextOffset = to.Time(0),
         nextOnset = to.Time(0),
         noteIndex = to.Index(0),
         notes,
         pitches,
         voiceConfig: {voiceType, timbre},
         voiceGain = to.Scalar(1),
     }: EntityConfig): Entity => {
        const voice: Voice = voiceType === VoiceType.SAMPLE ?
            buildSampleVoice(timbre as Timbre) :
            buildOscillatorVoice(timbre as OscillatorType)

        return {
            nextOffset,
            nextOnset,
            noteIndex,
            notes,
            pitches,
            voice,
            voiceGain,
        }
    }

export default buildEntity
