import { defaultSongCompile } from '../../src/compile/defaultSongCompile'
import { Song, SongName } from '../../src/songTypes'
import * as to from '../../src/utilities/to'

const mockSong: Song = {
    compile: defaultSongCompile,
    config: {
        baseFrequency: to.Frequency(0),
        durationScalar: to.Scalar(1),
    },
    description: '',
    entityConfigs: [],
    formattedName: '',
    name: SongName._EMPTY_SONG,
    scales: [],
}

export {
    mockSong,
}
