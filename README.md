# stylelint-no-indistinguishable-colors

[![Travis](https://img.shields.io/travis/ierhyna/stylelint-no-indistinguishable-colors/master.svg)](https://travis-ci.org/ierhyna/stylelint-no-indistinguishable-colors)
[![NPM Version](https://img.shields.io/npm/v/stylelint-no-indistinguishable-colors.svg)](https://www.npmjs.com/package/stylelint-no-indistinguishable-colors)

[Stylelint](http://stylelint.io) plugin that disallows colors that are suspiciously close to being identical, using [css-colorguard](https://github.com/SlexAxton/css-colorguard).

## Installation

```
npm install --save-dev stylelint stylelint-no-indistinguishable-colors
```

## Usage

Update your Stylelint config with following rules:

```
{
  "plugins": [
    "stylelint-no-indistinguishable-colors"
  ],
  "rules": {
    "plugin/stylelint-no-indistinguishable-colors": true
  }
}
```

## Options

Boolean, or an array of options, where the first element is `true`, and the second is an options object.

### Boolean option

`true`: Enables the plugin. Defaults to Colorguard's threshold of 3.

`false`: Disables the plugin.

### Optional secondary options

Corresponds to Colorguard [options object](https://github.com/SlexAxton/css-colorguard#options).

#### ignore: Array ['#colorA', '#colorB']

Hex color codes that you would like to ignore completely.

#### threshold: Number

Number can be between `0` and `100`. The default value is `3`.

The lower the threshold the more similar the colors have to be to trigger a violation. The higher the threshold, the more violations you will get.

#### whitelist: Array [['#colorA', '#colorB'], ['#colorC', '#colorD']]

An array of color pairs to ignore.

#### allowEquivalentNotation: Boolean

By default, colorguard will complain if identical colors are represented with different notations. For example, `#000`, `#000000`, `rgba(0, 0, 0, 0)`, and `black`. If you want to permit these equivalent notations, set this option to `true`.
