define(function (require) { // model

    "use strict";

    var $           = require('jquery'),
        Backbone    = require('backbone');
	
	// contains data and func for header (nothing)
    return Backbone.Model.extend({
		defaults: {
			// model vars
			//varname
		},
		initialize: function(args) {
			var self = this;
			// this is how to set values for model vars
			//this.set({varname: "value"});
			
		}
		
    });
	
});