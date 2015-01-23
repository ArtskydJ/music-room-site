# music-room-site
The site for the room of the musicz

#goals

###chatroom

- [ ] auto-post a message in the chat when a song starts
- [x] use socket.io

###session/auth

- [ ] require authentication
- [ ] room names should be a random id
- [ ] each person gets their own id
- [ ] when a person connects to a room, disconnect \'em from the other rooms!
- [ ] session management

###song files

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
- [x] get rid of aurora.js on the client

###torrent

- [ ] use the server as a peer
- [x] instead of uploading entire torrent to server, use `parse-torrent`, to get the hash, then emit the hash.
- [ ] When a client receives the hash, it must start downloading it. `client.download(infoHash)`
- [x] get metadata with https://www.npmjs.org/package/musicmetadata
- [ ] Find out what happens when you torrent.download(\'123abc\') after you torrent.seed(\'123abc\').
	- Hopefully we send a message to everyone in the room at once, telling them to download the next song.
	- The person who originally uploaded it will attempt to, but should ignore it.
	- I think this makes the world break but try it anyway.
- [x] torrent master will be given an infoHash, and a song id, ensures mp3 and ogg, acts as client for both.
	- then if given a song id, gives back {mp3infohash:\'abcd\ ogginfohash:\'1234\'}
	- see [convert-and-seed-audio](https://github.com/ArtskydJ/convert-and-seed-audio)
- [x] on `'upload' (ih1)` emit `'uploaded' (ih2, ih3)`
- [x] hang out in #webtorrent chatroom

###other

- [x] add tests for sox-stream, add good docs
- [x] shorten test files, preferably find non-copyrighted material
- [ ] https://www.npmjs.com/package/album-cover
- [ ] put templates into .ract files. use opt.template = fs.readFileSync(\'tplt.ract\')
- [ ] create the overview rooms page


