save-compare-suggest
==================

Метод, который позволяет сравнивать 2 html файла и если эти 2 файла различаются предлагает перезаписать эталанный файл

- [Как использовать?](#Как-использовать)

Как использовать?
-----------------

```js
const saveComparesSuggest = require('save-compares-suggest');

const path1 = 'file1.html';
const path2 = 'file2.html';

saveComparesSuggest(path1, path2);
```