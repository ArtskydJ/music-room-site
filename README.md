# music-room-site

### chatroom

- [x] auto-post a message in the chat when a song starts
- [x] use socket.io
- [x] in chat.js, abstract away the message format. (can't pass the user's name on construct?)

### session/auth

- [x] require authentication to access a room
- [ ] if user logs out in a different tab, they should be kicked from the room
- [x] each person gets their own id
- [ ] when a person connects to a room, disconnect \'em from the other rooms!
- [x] session management

### song files

- [ ] drag audio files to page
- [ ] reorder songs via gui
	- http://ractivejs.github.io/Ractive-decorators-sortable/
	- https://github.com/Nijikokun/ractive.drag.drop.js
	- https://github.com/Nijikokun/ractive.sortable.js
- [ ] server should order the upcoming songs.
- [ ] cap each user\'s queue to 20 or so
- [x] round robin lib gets users, and under each user has (array?) file ids, possibly metadata too.
	- state: user set, and each user\'s queue
	- see [playlist-combinator](https://github.com/ArtskyJ/playlist-combinator)
- [ ] download songs when needed, not all at once
- [ ] people who join late should start downloading stuff

### convert-and-seed-audio

- See [`ArtskydJ/convert-and-seed-audio`](https://github.com/ArtskydJ/convert-and-seed-audio).
- [ ] use the server as a peer
- [x] instead of uploading entire torrent to server, just emit the hash.
- [x] When a client receives the hash, it must start downloading it. `client.download(infoHash)`
	- See `convert-and-seed-audio, lib/client.js:20`
- [x] get metadata with https://www.npmjs.org/package/musicmetadata
- [x] Find out what happens when you torrent.download('123abc') after you torrent.seed('123abc').
	- This throws an error after about 45 seconds. See `ArtskydJ/JS_Source, webtorrent-seed-download-test.js`.
	- The person who originally uploaded might attempt to do this; do a try/catch.
- [x] given an infoHash and a song id, it ensures it has an mp3 and ogg, and seeds both.
	- then if given a song id, gives back `{ mp3infohash:'abcd ogginfohash:'1234' }`
- [x] on `'upload' (ih1)` emit `'uploaded' (ih2, ih3)`

### mock server

- [x] pings all users and say 'hey new song!', and gives them the song id
- [x] and it provides 3 songs and album art pics

### other

- [x] add tests for sox-stream, add good docs
- [x] shorten test files, preferably find non-copyrighted material
- [ ] https://www.npmjs.com/package/album-cover
- [x] create the overview rooms page
- [ ] create a landing page that explains what music-room is
- [ ] get a name other than 'music-room'
