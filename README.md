# Selectr

Selectr is a jQuery plugin that aims to accomplish a seemingly simple task: make a select box that doesn't suck.

It currently supports ctrl+click, search, color-coding, and selection limiting (multi-selects). In modern browsers (Chrome, Safari, FF, IE11), selectr ensures your source element and itself remain in sync. If you require this behavior (_e.g._ because you're using a data-binding framework of some sort) in legacy IE, see **Legacy Browser Caveats** below.

It is built using Bootstrap components, and is written in CoffeeScript and SCSS; if your project is not using Bootstrap, you should use selectrWithPolyfill.css -- which includes all of selectr's styles along with the relevant Bootstrap styles (scoped to avoid conflicting with existing styles, of course) -- or write your own.

Selectr was heavily inspired by [select2](https://github.com/ivaynberg/select2) and the label/assignee/milestone dropdowns in Github's issue tracker.

The files you probably want live in the prod folder. Debug contains the compiled JS, source maps, and compiled styles. Src contains the original Coffeescript and SCSS files. 

__[Click here to view demo](http://caseywebb.github.io/selectr)__

## Installation

#### From this repository

Copy selectr.min.js and the appropriate stylesheet (selectr.min.css if your project uses Bootstrap, or selectrWithPolyfill.min.css if your project does not) and include them on the page(s) you would like to use selectr on

#### Installing with Bower

`bower install selectr`

Note: The bower package lists bootstrap as a dependency; thus bootstrap will be copied to your project.

## Usage

To use selectr, simply fire it using jQuery

`$('select').selectr();`

### Multi selects

To make selectr a multi select, simply use the `multiple` attribute on your select element as you would with regular HTML.

    <select name="foo" multiple>

### Color coding

Selectr supports color coding of options by setting the `data-selectr-color` attribute on the option. Any valid CSS color is supported, i.e. hex, rgba(a), hsl(a).

Ex.

    <option data-selectr-color="rgb(255, 255, 255)" value="foo">Foo</option>

### Options and defaults

    title:                  '',
    noMatchingOptionsText:  'No options found'
    placeholder:            'Search',
    resetText:              'Clear All',
    width:                  '300px',
    maxListHeight:          '250px',
    tooltipBreakpoint:      25, // min length of option name to show tooltip on
    maxSelection:           NaN

To pass options to selectr, you may use an HTML5 data-* attribute, or an options object passed to the initialization function.

#### Using HTML5 data attributes

    <select name="foo" data-selectr-opts="{ "title": "Foo Bar", "placeholder": "Bax Qux", "maxSelection": 5, ... }" multiple>
    
__NOTE__: Attribute _must_ be valid JSON; that means quoted keys as well as values. This is to avoid using [eval()](http://stackoverflow.com/questions/86513/why-is-using-the-javascript-eval-function-a-bad-idea).

_But wait! I need quotes/apostrophes in my title!_
Easy fix. Use the ASCII code, i.e. instead of ' use `&#39;` and instead of " use `&quot;`.

#### Using an options object

    $('select').selectr({ title: 'Foo Bar', placeholder: 'Baz Qux', ... });
    
#### NOTE: Order of precedence

HTML5 data attributes take precedence over the options object. This allows you to pass certain parameters that should apply to most/all selectr instances, and "fill in the blanks" or override those options with the `data-selectr-opts` attribute. See demo file for an example.

### Compatiblity

Requires jQuery 1.8.3+

Tested in the following browsers:

- Chrome
- Firefox
- IE 8+*

### *Legacy Browser (IE8-10) caveats

selectr uses MutationObservers to update the list of options, which are unsupported by older browsers. Instead of hacking together a buggy solution,
I've opted to require that, in order to update the options list in older browsers, a change event be manually fired on the source select element.

### Contributing

#### Bugs

If you encounter a bug, please file an issue in Github, or shoot me an email at NotCaseyWebb@gmail.com

#### Pull requests

If you would like to submit a pull request or fork this project, the package.json and Gruntfile.js should have everything you need to get started. Simply `cd` into the directory you cloned the repo in, `npm install`, and `grunt watch`. Coffeescript -> JS compilation, JSHinting, css prefixing, minification, and concatenation (for the polyfill styles) will be taken care of automagically.

Source files live in src, compiled but unminified files in debug, and minified in prod.



### Legal Junk

Selectr is distributed under the [MIT License](http://opensource.org/licenses/mit-license.php). Have at it.
