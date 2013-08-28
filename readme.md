# angular-blocks

[![Build Status](https://travis-ci.org/wmluke/angular-blocks.png?branch=master)](https://travis-ci.org/wmluke/angular-blocks)

Block style template inheritance for [AngularJS](http://angularjs.org) inspired by [Jade](http://jade-lang.com), [Handlebars](http://thejohnfreeman.com/blog/2012/03/23/template-inheritance-for-handlebars.html), and [Django](https://docs.djangoproject.com/en/dev/topics/templates/#template-inheritance).

## Installation

Requires jquery.

Download [angular-blocks.min.js](https://github.com/wmluke/angular-blocks/blob/master/dist/angular-blocks.min.js) or install with bower.

```bash
$ bower install angular-blocks --save
```

Load `angular-blocks.min.js` then add the `angular-blocks` module to your Angular app.


```javascript
angular.module('app', ['angular-blocks']);
```

## Usage

Given the template below:

```html
<script type="text/ng-template" id="/layout.html">
    <header data-block="header">
        <p>:header</p>
    </header>
    <div data-block="content">
        <p>:content</p>
    </div>
    <footer data-block="footer">
        <p>:footer</p>
    </footer>
</script>
```

### Block Replace: `data-block`

```html
<div data-extend-template="/layout.html">
   <div data-block="content">
       <p>Foo</p>
   </div>
</div>
```

Becomes:

```html
<div data-extend-template="/layout.html">
    <header data-block="header">
        <p>:header</p>
    </header>
    <div data-block="content">
        <p>Foo</p>
    </div>
    <footer data-block="footer">
        <p>:footer</p>
    </footer>
</div>
```

### Block Prepend: `data-block-prepend`

```html
<div data-extend-template="/layout.html">
   <div data-block-prepend="content">
       <p>Foo</p>
   </div>
</div>
```

Becomes:

```html
<div data-extend-template="/layout.html">
    <header data-block="header">
        <p>:header</p>
    </header>
    <div data-block="content">
       <div data-block-prepend="content">
           <p>Foo</p>
       </div>
       <p>:content</p>
    </div>
    <footer data-block="footer">
        <p>:footer</p>
    </footer>
</div>
```

### Block Append: `data-block-append`

```html
<div data-extend-template="/layout.html">
   <div data-block-append="content">
       <p>Foo</p>
   </div>
</div>
```

Becomes:

```html
<div data-extend-template="/layout.html">
    <header data-block="header">
        <p>:header</p>
    </header>
    <div data-block="content">
       <p>:content</p>
       <div data-block-append="content">
           <p>Foo</p>
       </div>
    </div>
    <footer data-block="footer">
        <p>:footer</p>
    </footer>
</div>
```

### Block Before: `data-block-before`

```html
<div data-extend-template="/layout.html">
   <div data-block-before="content">
       <p>Foo</p>
   </div>
</div>
```

Becomes:

```html
<div data-extend-template="/layout.html">
    <header data-block="header">
        <p>:header</p>
    </header>
   <div data-block-before="content">
       <p>Foo</p>
   </div>
    <div data-block="content">
       <p>:content</p>
    </div>
    <footer data-block="footer">
        <p>:footer</p>
    </footer>
</div>
```

### Block After: `data-block-after`

```html
<div data-extend-template="/layout.html">
   <div data-block-after="content">
       <p>Foo</p>
   </div>
</div>
```

Becomes:

```html
<div data-extend-template="/layout.html">
    <header data-block="header">
        <p>:header</p>
    </header>
    <div data-block="content">
       <p>:content</p>
    </div>
   <div data-block-after="content">
       <p>Foo</p>
   </div>
    <footer data-block="footer">
        <p>:footer</p>
    </footer>
</div>
```

## API

See the [spec](https://github.com/wmluke/angular-blocks/blob/master/test/angular-blocks-spec.js).

## Contributing

### Prerequisites

The project requires [Bower](http://bower.io), [Grunt](http://gruntjs.com), and [PhantomJS](http://phantomjs.org).  Once you have installed them, you can build, test, and run the project.

### Build & Test

To build and run tests, run either...

```bash
$ make install
```

or

```bash
$ npm install
$ bower install
$ grunt build
```

## Licsense

Copyright (c) 2013 William L. Bunselmeyer. https://github.com/wmluke/angular-blocks

Licensed under the MIT License
