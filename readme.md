music-room
==========

#basic specs
- one chatroom
- require user registration; no anonymous users
- auto-post a message in the chat when a song starts
- drag audio files to page
- uploads to db, auto-conversion later, vbr mp3 preferable
- round robin songs
- re-order songs via gui
- use socket.io
- things to figure out: sending files to server; getting files back;
- cap each user's queue to 20 or so
- store music files to disk on server
- round robin lib gets users, and under each user has (array?) file ids, possibly metadata too.
- state: user set, and each user's queue
- get metadata with one of these:
     - https://www.npmjs.org/package/musicmetadata
     - https://www.npmjs.org/package/audio-metadata
- use browser-audio or howler.js


#overview
- socket.io by default has buffers, but streams can be added IN THE FUTURE with socket.io-stream
- drag files into browser; read metadata; upload w/ socket.io if accepted type and size
- when file gets uploaded, it is saved in database. also, a user's list of songs is saved in the db.
- check for songs every few seconds. 