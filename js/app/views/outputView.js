define(function (require) { 

    "use strict";

    var $           = require('jquery'),
        Backbone    = require('backbone'),
		
		ModelName		= require('app/models/output'),
		// html template
		tpl         = require('text!tpl/Output.html'),
		tweetTableTemplate	= require('text!tpl/OutputTweetTable.html'),
		tweetFullTableTemplate	= require('text!tpl/OutputFullTweetTable.html'),
		
		tweetGraphTemplate = require('text!tpl/OutputTweetGraph.html');
		
	var outputAnimDuration = 200;
		
    return Backbone.View.extend({
		initialize: function() {
			
		},
		render: function(renderData) {
			var self = this;
			if (renderData != null) {
				self.$el.hide(0);
				// variables to pass to template
				var templateVariables = { renderData: renderData };
				// compile the template using underscore (_)
				var	outputTemplate = _.template(tpl);	
				// insert template html into view element
				self.$el.html(outputTemplate(templateVariables));
				self.$el.show(outputAnimDuration);
				return self;
			} else {
				self.$el.hide(0);
				// empty variable for template
				var templateVariables = { renderData: "" };
				// compile the template using underscore (_)
				var	outputTemplate = _.template(tpl);	
				// insert template html into view element
				self.$el.html(outputTemplate(templateVariables));
				self.$el.show(outputAnimDuration);
				return self;
			}
		},
		renderTweets: function(tweetsData) {
			var self = this;
			if (tweetsData != null) {
				self.$el.hide(0);
				// compile the template using underscore (_)
				var tweetTable = _.template(tweetTableTemplate);
				// current row template:
				// <tr>
					// <td><%=id%></td>
					// <td><%=tweet%></td>
				// </tr>
				if (tweetsData != "") {
					var results = $.parseJSON(tweetsData);
					var mappedResults = _.map(
						results,
						function(row) {
							return { 
								id: row.id,
								tweet: row.tweet,
							}
						}
					);
					
					var stringResults = "";
					_.forEach(
						mappedResults,
						function (row) {
							stringResults += "<tr><td>" + row.id + "</td><td class=\"monospace\">" + row.tweet + "</td></tr>";
						}
					);
					
					self.$el.html(tweetTable({rows: stringResults}));
					self.$el.show(outputAnimDuration);
				} else {
					console.log("tweetsData is apparently \"\"");
				}
			}
		},
		renderFullTweets: function(tweetsData) {
			var self = this;
			if (tweetsData != null) {
				self.$el.hide(0);
				// compile the template using underscore (_)
				var tweetFullTable = _.template(tweetFullTableTemplate);
				// full row template:
				//template goes here
				if (tweetsData != "") {
					var results = $.parseJSON(tweetsData);
					var mappedResults = _.map(
						results,
						function(row) {
							return { 
								id: row.id,
								tweet: row.tweet,
								tweet_id_str: row.tweet_id_str,
								created_at: row.created_at,
								user_name: row.user_name,
								user_id_str: row.user_id_str,
								lang: row.lang,
								retweet_count: row.retweet_count,
							}
						}
					);
					
					var stringResults = "";
					_.forEach(
						mappedResults,
						function (row) {
							stringResults += "<tr>"
							+ "<td>" + row.id + "</td>" 
							+ "<td>" + row.created_at + "</td>" 
							+ "<td class=\"monospace\">" + row.tweet + "</td>"
							+ "<td>" + row.tweet_id_str + "</td>" 
							+ "<td>" + row.user_name + "</td>"
							+ "<td>" + row.user_id_str + "</td>" 
							+ "<td>" + row.lang + "</td>" 
							+ "<td>" + row.retweet_count + "</td>" 
							+ "</tr>";
						}
					);
					
					self.$el.html(tweetFullTable({rows: stringResults}));
					self.$el.show(outputAnimDuration);
				} else {
					console.log("tweetsData is apparently \"\"");
				}
			}
		},
		renderGraph: function(graphData) {
			var self = this;
			// format graphData into proper format, as found in the examples on the graph website
			if (graphData != null) {
				self.$el.hide(0);
				var tweetGraph = _.template(tweetGraphTemplate);
				
				// draw chart here. the data exists.
				self.$el.html(graphData);
				self.$el.show(outputAnimDuration);
			}
		},
		amChartsMake: function(graphData) {
			AmCharts.makeChart("chartdiv",
				{
					"type": "serial",
					"pathToImages": "http://cdn.amcharts.com/lib/3/images/",
					"categoryField": "created_at",
					"dataDateFormat": "YYYY-MM-DD HH:NN:SS",
					"categoryAxis": {
						"minPeriod": "ss",
						"parseDates": true
					},
					"chartCursor": {
						"categoryBalloonDateFormat": "JJ:NN:SS"
					},
					"chartScrollbar": {},
					"trendLines": [],
					"graphs": [
						{
							"bullet": "round",
							"id": "AmGraph-1",
							"title": "graph 1",
							"valueField": "column-1"
						},
						{
							"bullet": "square",
							"id": "AmGraph-2",
							"title": "graph 2",
							"valueField": "count"
						}
					],
					"guides": [],
					"valueAxes": [
						{
							"id": "ValueAxis-1",
							"title": "Axis title"
						}
					],
					"allLabels": [],
					"balloon": {},
					"legend": {
						"useGraphSettings": true
					},
					"titles": [
						{
							"id": "Title-1",
							"size": 15,
							"text": "Chart Title"
						}
					],
					"dataProvider": 
						graphData
						
					
				}
			);
		}
    });

});