require.config({

    baseUrl: 'js/lib',

    paths: {
        app: '../app',
        tpl: '../tpl',
        jqueryui: 'http://code.jquery.com/ui/1.11.4/jquery-ui',
    },

    map: {
        //'*': {
        //    'app/models/employee': 'app/models/memory/employee'
        //}
    },

    shim: {
        'jqueryui': {
            exports:"$",
            deps:['jquery']
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        },
		'bootstrap': {
			deps: ['jquery']
		},
        'footable': {
            deps: ['jquery']
        },
    }
});

require(['jquery', 'backbone', 'app/router', 'jqueryui', 'bootstrap', 'footable'], function ($, Backbone, Router) {
	var router = new Router();
    Backbone.history.start();
});	