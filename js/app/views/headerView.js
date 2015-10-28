define(function (require) { // view for header: title of webapp and such

    "use strict";

    var $           = require('jquery'),
        Backbone    = require('backbone'),
		Header		= require('app/models/header'),
		// html template
		tpl         = require('text!tpl/Header.html');
		
	var	template = _.template(tpl);
	
    return Backbone.View.extend({
		initialize: function() {
			
		},
		render: function() {
			// insert template html into view element
			this.$el.html(template(this.model.attributes));
			return this;
		}
    });

});