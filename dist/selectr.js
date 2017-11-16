!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("jquery")):"function"==typeof define&&define.amd?define(["jquery"],t):"object"==typeof exports?exports.selectr=t(require("jquery")):e.selectr=t(e.$)}(this,function(e){return function(e){function t(o){if(r[o])return r[o].exports;var i=r[o]={exports:{},id:o,loaded:!1};return e[o].call(i.exports,i,i.exports,t),i.loaded=!0,i.exports}var r={};return t.m=e,t.c=r,t.p="",t(0)}([function(e,t,r){var o,i=function(e,t){return function(){return e.apply(t,arguments)}};o=r(1),window.NO_STYLES||(r(2),window.POLYFILL_BOOTSTRAP_STYLES&&r(6)),function(e,t){var r;return r=function(){function t(t,r){this.source=t,this.args=r,this.updateFooter=i(this.updateFooter,this),this.deselectOption=i(this.deselectOption,this),this.selectOption=i(this.selectOption,this),this.triggerChange=i(this.triggerChange,this),this.args=e.extend({},this.defaults,this.args,this.source.data("selectr-opts")),this.multi=this.source.prop("multiple"),this.createSelectr(),this.monitorSource(),this.selectrContainer.insertAfter(this.source),this.selectrContainer=e(this.source.next()),this.bindEventListeners(),this.source.hide()}return t.prototype.defaults={title:"Select Options",noMatchingOptionsText:"No options found",placeholder:"Search",resetText:"Clear All",width:"300px",maxListHeight:"250px",tooltipBreakpoint:25,maxSelection:Infinity,panelStyle:"default",alwaysShowFooter:!1},t.prototype.createSelectr=function(){return this.selectrContainer=this.createContainer(),e(".list-group",this.selectrContainer).append(this.createOpts()),this.updateFooter()},t.prototype.createContainer=function(){return e(document.createElement("div")).addClass("selectr panel panel-"+this.args.panelStyle+" "+(this.multi?"multi":void 0)).css("width",this.args.width).html("<div class='panel-heading "+(""===this.args.title?"no-title":void 0)+"'> <h4 class='panel-title'> "+this.args.title+" </h4> </div> <div class='panel-body'> <input class='form-control' placeholder='"+this.args.placeholder+"'> <span class='clear-search hidden'>&times;</span> </div> <ul class='list-group' style='max-height: "+this.args.maxListHeight+"'> </ul> <div class='no-matching-options hidden'> <strong>"+this.args.noMatchingOptionsText+"</strong> </div> <div class='panel-footer "+(this.multi||this.args.alwaysShowFooter?void 0:"hidden")+"'> <button class='reset btn btn-sm btn-default' type='button'> "+this.args.resetText+" </button> "+(this.multi?"<span class='current-selection badge'></span>":"")+" </div>")},t.prototype.createOpts=function(){var t,r,o,i,n;for(i=e("option",this.source),n=[],t=0,r=i.length;t<r;t++)o=i[t],n.push(e(document.createElement("li")).addClass("list-group-item "+(e(o).is(":selected")?"selected":void 0)).data("val",e(o).val()).append(e(document.createElement("div")).addClass("color-code "+(e(o).data("selectr-color")?void 0:"no-color")).css("background-color",e(o).data("selectr-color"))).append(e(document.createElement("div")).text(e(o).text()).addClass("option-name").attr({title:e(o).text()})).append(e(document.createElement("div")).html("&times").addClass("add-remove "+(this.multi?void 0:"hidden"))));return n},t.prototype.monitorSource=function(){var t;return t=function(t){return function(){var r;return r=e(document.createElement("ul")).addClass("list-group").css("max-height",t.args.maxListHeight).append(t.createOpts()),e(".list-group",t.selectrContainer).replaceWith(r),t.updateFooter()}}(this),this.source.on("change",function(e,r){if("selectrInitiated"!==r)return t()})},t.prototype.bindEventListeners=function(){var t,r,o,i,n,s,a,l,c,d,p,u,h,f;return a=this.multi,p=this.selectrContainer,u=this.source,d=this.selectOption,n=this.deselectOption,h=this.triggerChange,f=this.updateFooter,s=function(t){var r,o;if(t.stopPropagation(),2!==(null!=(o=t.originalEvent)?o.detail:void 0))return r=(t.ctrlKey||t.metaKey)&&a,e(this).hasClass("selected")&&(r||0===e(this).siblings(".selected").length)&&a?n(this):d(r,this)},t=function(t){var r;if(t.stopPropagation(),!t.originalEvent.detail||2!==t.originalEvent.detail)return r=e(t.target).parents(".list-group-item"),r.hasClass("selected")?n(r):d(!0,r)},c=function(t){var r,o,i,n;return t.stopPropagation(),i=new RegExp(e(this).val().replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&"),"i"),n=!0,e(".list-group-item",p).each(function(t,r){e(r).text().match(i)?(e(r).removeClass("hidden"),n=!1):e(r).addClass("hidden")}),r=e(".clear-search",p),e(this).val().length>0?r.removeClass("hidden"):r.addClass("hidden"),o=e(".no-matching-options",p),n?o.removeClass("hidden"):o.addClass("hidden")},r=function(t){return e(this).siblings("input").val("").trigger("change")},l=function(t){return p.find("ul > li").removeClass("selected"),e("option",u).prop("selected",!1),h(u),f()},o=function(t){if(t.ctrlKey)return e(".list-group",p).addClass("ctrl-key")},i=function(t){if(!t.ctrlKey)return e(".list-group",p).removeClass("ctrl-key")},e(p).on("click",".list-group-item",s),e(p).on("click",".add-remove",t),e(p).on("click change keyup",".form-control",c),e(p).on("click",".clear-search",r),e(p).on("click",".reset",l),e(document).on("keydown",o),e(document).on("keyup",i)},t.prototype.triggerChange=function(){return this.source.trigger("change",["selectrInitiated"])},t.prototype.selectOption=function(t,r){var o,i,n,s;if(!(this.args.maxSelection<=e(r).siblings(".selected").length&&t)){if(!t)for(e("option",this.source).prop("selected",!1),n=e(r).siblings(),o=0,i=n.length;o<i;o++)s=n[o],e(s).removeClass("selected");return e(r).addClass("selected"),e("option[value='"+e(r).data("val")+"']",this.source).prop("selected",!0),this.updateFooter(),this.triggerChange()}},t.prototype.deselectOption=function(t){return this.selectrContainer.removeClass("max-selection-reached"),e(t).removeClass("selected"),e("option[value="+e(t).data("val")+"]",this.source).prop("selected",!1),this.updateFooter(),this.triggerChange()},t.prototype.updateFooter=function(){var t,r;if(this.multi&&(r=e("option:selected",this.source).length,e(".current-selection",this.selectrContainer).text(r>0?r:""),r===this.args.maxSelection?this.selectrContainer.addClass("max-selection-reached"):this.selectrContainer.removeClass("max-selection-reached"),!this.args.alwaysShowFooter))return t=e(".panel-footer",this.selectrContainer),0===r?t.addClass("hidden"):t.removeClass("hidden")},t}(),e.fn.extend({selectr:function(t){return this.each(function(){var o;if(o=e(this),!o.data("selectr-initialized"))return new r(o,t),o.data("selectr-initialized",!0)})}})}(o,this)},function(t,r){t.exports=e},function(e,t,r){var o=r(3);"string"==typeof o&&(o=[[e.id,o,""]]);r(5)(o,{});o.locals&&(e.exports=o.locals)},function(e,t,r){t=e.exports=r(4)(),t.push([e.id,".selectr{margin:0;display:inline-block;max-width:100%}.selectr,.selectr :not(input){-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.selectr .panel-heading{cursor:default}.selectr .panel-heading.no-title{padding:0;border-bottom:none}.selectr .panel-body{position:relative}.selectr input::-ms-clear{display:none;width:0;height:0}.selectr .clear-search{position:absolute;right:25px;top:12px;font-size:28px;font-weight:700;color:#333;opacity:.8;cursor:pointer}.selectr .clear-search:hover{opacity:1}.selectr .list-group{overflow-x:hidden;-ms-overflow-y:auto}.selectr .list-group-item{padding:0!important;overflow:hidden;cursor:pointer}.selectr .list-group-item.selected{background-color:#4679bd;color:#fff;font-weight:700}.selectr .list-group-item.selected .add-remove{-webkit-transform:rotate(0deg);transform:rotate(0deg)}.selectr.multi .list-group-item:hover .option-name{margin-right:50px;border-right:1px solid #ddd}.selectr.multi .list-group-item:hover .selected .option-name{border-right:1px solid #fff}.selectr.multi .list-group-item:hover .add-remove{display:block}.selectr .option-name{height:100%;padding:10px 15px;text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.selectr .color-code{width:20px;height:20px;margin:10px;margin-right:0;float:left;border-radius:5px}.selectr .color-code.no-color{width:0;height:0;margin:0}.selectr .add-remove{-webkit-transform:rotate(45deg);transform:rotate(45deg);transition:-webkit-transform .2s linear;transition:transform .2s linear;transition:transform .2s linear,-webkit-transform .2s linear;opacity:.5;display:none;cursor:pointer;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:24px;font-weight:900;position:absolute;right:0;top:0;width:50px;padding:8px;line-height:24px;text-align:center;vertical-align:middle}.selectr .add-remove:hover,.selectr .ctrl-key .add-remove{opacity:.8}.selectr .current-selection{float:right;margin-top:5px;cursor:default}.selectr.max-selection-reached li:not(.selected) .option-name{margin-right:0!important;border-right:none!important}.selectr.max-selection-reached li:not(.selected) .add-remove{display:none!important}.selectr.max-selection-reached .current-selection{background-color:#d9534f}.selectr .no-matching-options{padding:10px;padding-top:0;text-align:center}",""])},function(e,t){e.exports=function(){var e=[];return e.toString=function(){for(var e=[],t=0;t<this.length;t++){var r=this[t];r[2]?e.push("@media "+r[2]+"{"+r[1]+"}"):e.push(r[1])}return e.join("")},e.i=function(t,r){"string"==typeof t&&(t=[[null,t,""]]);for(var o={},i=0;i<this.length;i++){var n=this[i][0];"number"==typeof n&&(o[n]=!0)}for(i=0;i<t.length;i++){var s=t[i];"number"==typeof s[0]&&o[s[0]]||(r&&!s[2]?s[2]=r:r&&(s[2]="("+s[2]+") and ("+r+")"),e.push(s))}},e}},function(e,t,r){function o(e,t){for(var r=0;r<e.length;r++){var o=e[r],i=h[o.id];if(i){i.refs++;for(var n=0;n<i.parts.length;n++)i.parts[n](o.parts[n]);for(;n<o.parts.length;n++)i.parts.push(c(o.parts[n],t))}else{for(var s=[],n=0;n<o.parts.length;n++)s.push(c(o.parts[n],t));h[o.id]={id:o.id,refs:1,parts:s}}}}function i(e){for(var t=[],r={},o=0;o<e.length;o++){var i=e[o],n=i[0],s=i[1],a=i[2],l=i[3],c={css:s,media:a,sourceMap:l};r[n]?r[n].parts.push(c):t.push(r[n]={id:n,parts:[c]})}return t}function n(e,t){var r=m(),o=b[b.length-1];if("top"===e.insertAt)o?o.nextSibling?r.insertBefore(t,o.nextSibling):r.appendChild(t):r.insertBefore(t,r.firstChild),b.push(t);else{if("bottom"!==e.insertAt)throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");r.appendChild(t)}}function s(e){e.parentNode.removeChild(e);var t=b.indexOf(e);t>=0&&b.splice(t,1)}function a(e){var t=document.createElement("style");return t.type="text/css",n(e,t),t}function l(e){var t=document.createElement("link");return t.rel="stylesheet",n(e,t),t}function c(e,t){var r,o,i;if(t.singleton){var n=x++;r=v||(v=a(t)),o=d.bind(null,r,n,!1),i=d.bind(null,r,n,!0)}else e.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(r=l(t),o=u.bind(null,r),i=function(){s(r),r.href&&URL.revokeObjectURL(r.href)}):(r=a(t),o=p.bind(null,r),i=function(){s(r)});return o(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;o(e=t)}else i()}}function d(e,t,r,o){var i=r?"":o.css;if(e.styleSheet)e.styleSheet.cssText=y(t,i);else{var n=document.createTextNode(i),s=e.childNodes;s[t]&&e.removeChild(s[t]),s.length?e.insertBefore(n,s[t]):e.appendChild(n)}}function p(e,t){var r=t.css,o=t.media;if(o&&e.setAttribute("media",o),e.styleSheet)e.styleSheet.cssText=r;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(r))}}function u(e,t){var r=t.css,o=t.sourceMap;o&&(r+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(o))))+" */");var i=new Blob([r],{type:"text/css"}),n=e.href;e.href=URL.createObjectURL(i),n&&URL.revokeObjectURL(n)}var h={},f=function(e){var t;return function(){return"undefined"==typeof t&&(t=e.apply(this,arguments)),t}},g=f(function(){return/msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase())}),m=f(function(){return document.head||document.getElementsByTagName("head")[0]}),v=null,x=0,b=[];e.exports=function(e,t){t=t||{},"undefined"==typeof t.singleton&&(t.singleton=g()),"undefined"==typeof t.insertAt&&(t.insertAt="bottom");var r=i(e);return o(r,t),function(e){for(var n=[],s=0;s<r.length;s++){var a=r[s],l=h[a.id];l.refs--,n.push(l)}if(e){var c=i(e);o(c,t)}for(var s=0;s<n.length;s++){var l=n[s];if(0===l.refs){for(var d=0;d<l.parts.length;d++)l.parts[d]();delete h[l.id]}}}};var y=function(){var e=[];return function(t,r){return e[t]=r,e.filter(Boolean).join("\n")}}()},function(e,t,r){var o=r(7);"string"==typeof o&&(o=[[e.id,o,""]]);r(5)(o,{});o.locals&&(e.exports=o.locals)},function(e,t,r){t=e.exports=r(4)(),t.push([e.id,".selectr{margin-bottom:20px;background-color:#fff;border:1px solid #ddd;border-radius:4px;box-shadow:0 1px 1px rgba(0,0,0,.05)}.selectr *{box-sizing:border-box}.selectr .hidden{display:none!important}.selectr .panel-heading{color:#333;background-color:#f5f5f5;border-color:#ddd;padding:10px 15px;border-bottom:1px solid transparent;border-top-right-radius:3px;border-top-left-radius:3px}.selectr .panel-title{margin-top:0;margin-bottom:0;font-size:16px;color:inherit}.selectr .panel-body{padding:15px}.selectr .form-control{display:block;width:100%;height:34px;padding:6px 12px;font-size:14px;line-height:1.42857143;color:#555;background-color:#fff;background-image:none;border:1px solid #ccc;border-radius:4px;box-shadow:inset 0 1px 1px rgba(0,0,0,.075);transition:border-color .15s ease-in-out,box-shadow .15s ease-in-out}.selectr .list-group{margin:0;padding:0}.selectr .list-group-item{border-width:1px 0;border-radius:0;position:relative;display:block;padding:10px 15px;margin-bottom:-1px;background-color:#fff;border:1px solid #ddd}.selectr .panel-footer{padding:10px 15px;background-color:#f5f5f5;border-top:1px solid #ddd;border-bottom-right-radius:3px;border-bottom-left-radius:3px}.selectr .btn{margin-bottom:0;font-weight:400;vertical-align:middle;cursor:pointer;background-image:none;border:1px solid transparent;padding:6px 12px;font-size:14px;line-height:1.42857143;border-radius:4px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;color:#333;background-color:#fff;border-color:#ccc}.selectr .badge,.selectr .btn{display:inline-block;text-align:center;white-space:nowrap}.selectr .badge{min-width:10px;padding:3px 7px;font-size:12px;font-weight:700;color:#fff;line-height:1;vertical-align:baseline;background-color:#999;border-radius:10px}",""])}])});
//# sourceMappingURL=selectr.js.map