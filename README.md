# better-blockmap-study

A short study of the differential download size improvement that
[better-blockmap][0] (with zip boundary detection on) offers in comparison to
[app-builder][1].

## Results

```sh
% npm install
% node download.js
% node compare.js
287830.3333333333
```

On average for [Signal Desktop][2] the savings per each download are thus
~281kb.

[0]: https://github.com/indutny/better-blockmap
[1]: https://github.com/develar/app-builder
[2]: https://github.com/signalapp/Signal-Desktop
