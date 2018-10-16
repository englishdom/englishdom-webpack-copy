# Englishdom public form
-------

##### Example using

```js
var copy = require('englishdom-webpack-copy');

method(  
  [
    'first/first-sub/first-sub-sub',
    'second/second',
  ],
  'example',
  'public/example-vendor'
);
```

#### Package Managers

```
# NPM
npm install englishdom-webpack-copy
```

Option | Type | Default | Description
------ | ---- | ------- | -----------
list | array | undefined | default list of modules paths, which must be copied
pathFrom | string | node_modules | files will be copied from this path
pathTo | string | undefined | files will be copied to this path