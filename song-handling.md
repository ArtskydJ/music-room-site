server
======

#on upload
- add song to queue

#on join
- add usercount
- evaluatestate
- emit songstodownload

#on songend
- grab next song
- emit startsong with [message, song, songtodownload]

#on leave
- subtract usercount
- evaluatestate

client
======

#on join
download songs

#on startsong
- play song
- post message in chat
- download songtodownload

#when songisdownloaded
- preload song

#when songends
- emit songend

#on songstodownload
- download array of songs

