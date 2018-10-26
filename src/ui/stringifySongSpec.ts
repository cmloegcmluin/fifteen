import { SongSpec } from '../song'
import { StringifiedSongSpec } from '../state'

const displayedSongSpecDefaults: StringifiedSongSpec = {
}

const stringifySongSpec: (songSpec: SongSpec) => StringifiedSongSpec =
    (songSpec: SongSpec): StringifiedSongSpec =>
        Object
            .entries(songSpec)
            .reduce(
                (stringifiedSongSpec: StringifiedSongSpec, [ key, val ]: [string, string]): StringifiedSongSpec =>
                    ({ ...stringifiedSongSpec, [key]: JSON.stringify(val) }),
                displayedSongSpecDefaults,
            )

export {
    stringifySongSpec,
}
