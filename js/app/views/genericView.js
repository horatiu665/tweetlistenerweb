define(function (require) { // generic view which only inserts some HTML into the doc

    "use strict";

    var $           = require('jquery'),
        Backbone    = require('backbone'),
		ModelName		= require('app/models/modelName'),
		// html template
		tpl         = require('text!tpl/template.html');
		
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