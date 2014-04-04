# Selectr

This plugin aims to accomplish a seemingly simple task: make a select box that doesn't suck.

Demo coming soon; in the meantime, here's a [fiddle](http://jsfiddle.net/CaseyWebb/5ufT7/)

It is built using Bootstrap components, and is written in CoffeeScript and SCSS.

If your project does not use Bootstrap, include the selectrPolyfill.css or selectrPolyfill.min.css.
All the ruls in the polyfill file are scoped to selectr, so you don't have to worry about it affecting
your existing stylesheets.

### Usage

To use selectr, simply fire it using jQuery

`$('select').selectr();`

#### Options and defaults

  title:          '',
  placeholder:    'Search',
  resetText:      'Clear All',
  width:          '300px',
  maxListHeight:  '250px'

To use options, pass them as an object.

    $('select').selectr({
      title: 'Select things here',
      placeholder: 'Search in options',
      ...
    });


### Bugs
If you encounter a bug, please file an issue or email me at CaseyWebb@me.com

Feel free to branch or submit a pull request

### Legal Junk

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
