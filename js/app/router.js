define(function (require) {

    "use strict";

    var $           	= require('jquery');
    var Backbone		= require('backbone');
	
	var	HeaderView		= require('app/views/headerView');
	var Header			= require('app/models/header');
	var CommandView 	= require('app/views/commandView');
	var Command			= require('app/models/command');
	var OutputView 		= require('app/views/outputView');
	var Output			= require('app/models/output');
	
	var $body = $("body");
	
    return Backbone.Router.extend({
        routes: {
            "": "home",
            
        },

        home: function () {
			
			// use bootstrap container, everything goes inside this div.container
			var $bootstrapRoot = $("<div/>").appendTo($body);
			$bootstrapRoot.addClass("container");
			
			var $pageRow = $("<div/>").appendTo($bootstrapRoot);
			$pageRow.addClass("row");
			var $pageRoot = $("<div/>").appendTo($pageRow);
			
			// include header
			var headerDiv = $("<div/>").appendTo($pageRoot);
			var headerView = new HeaderView({el: headerDiv, model: new Header()}).render();
			this.makeUnselectable(headerDiv);
			
			// include command menu
			var commandDiv = $("<div/>").appendTo($pageRoot);
			var commandView = new CommandView({el: commandDiv, model: new Command()}).render();
			
			// include output menu
			var outputDiv = $("<div/>").appendTo($pageRoot);
			var outputView = new OutputView({el: outputDiv, model: new Output()}).render();
			
			// reference output in command
			commandView.outputView = outputView;
			
			// initialize footable
			$('.footable').footable();

			// initialize jqueryui

        },
		
		makeUnselectable: function($element) {
			// make nonselectable, kudos second answer  http://stackoverflow.com/questions/2700000/how-to-disable-text-selection-using-jquery
			$element.attr('unselectable','on')
				 .css({'-moz-user-select':'none',
					   '-o-user-select':'none',
					   '-khtml-user-select':'none', /* you could also put this in a class */
					   '-webkit-user-select':'none',/* and add the CSS class here instead */
					   '-ms-user-select':'none',
					   'user-select':'none'
				 }).bind('selectstart', function(){ return false; });
			
		}

		
    });

});