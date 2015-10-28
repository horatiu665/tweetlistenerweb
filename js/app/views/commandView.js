define(function (require) { 

    "use strict";

    var $           = require('jquery'),
        Backbone    = require('backbone'),
		bootstrap	= require('bootstrap'),
		
		ModelName		= require('app/models/command'),
		// html template
		tpl         = require('text!tpl/Command.html');

	var	commandTemplate = _.template(tpl);

    return Backbone.View.extend({
		// reference to outputView, for passing the renderData
		outputView: Backbone.View,
		initialize: function() {
			// $("#command-viewGraph-date") = this contains the date chooser for graph view
			
		},
		render: function() {
			var self = this;
			// variables to pass to template
			var templateVariables = {
				
			};
			
			// insert template html into view element
			self.$el.html(commandTemplate(templateVariables));
			
			// show command sub-panels only when selecting from the navbar/menu/button list
			$('#command-tabs a').click(function (e) {
				e.preventDefault();
				$(this).tab('show');
			});
			
			// setup events for each button in template:
			
			$("#command-viewGraph-date").datepicker({dateFormat:'yy-mm-dd'});

			// viewTweets
			$("#command-viewTweets-all").on("click", function(event) {
				var tweetLimit = $("#command-viewTweets-limit").val();
				if (tweetLimit == "") {
					tweetLimit = "50";
				}
				var viewTweetsQuery = "SELECT * FROM `json` ORDER BY `id` DESC LIMIT " + tweetLimit;
				self.customQuery(viewTweetsQuery, function(str) {
					self.outputView.renderTweets(str);
				});
				event.preventDefault();
			});
			
			// viewFullTweets
			$("#command-viewFullTweets-all").on("click", function(event) {
				var tweetLimit = $("#command-viewFullTweets-limit").val();
				if (tweetLimit == "") {
					tweetLimit = "50";
				}
				var viewTweetsQuery = "SELECT * FROM `json` ORDER BY `id` DESC LIMIT " + tweetLimit;
				self.customQuery(viewTweetsQuery, function(str) {
					self.outputView.renderFullTweets(str);
				});
				event.preventDefault();
			});
			
			// customQuery
			$("#command-customQuery").on("submit", function(event) {
				self.customQuery($("#command-customQuery-input").val(), function(str) {
					self.outputView.render(str);
				});
				event.preventDefault();
			});
			
			// viewGraph
			$("#command-viewGraph-button").on("click", function(event) {
				
				// old method where we get every 3rd day and count tweets in each.
				if (false) {
					// resolution of the graph is how many columns to show, out of the total size of the database table.
					var resolution = 3;
					// separate query to find out size of DB
					var sizeQuery = "SELECT COUNT(*) FROM json";
					var size = 0;
					self.customQuery(sizeQuery, function(str) {
						size = parseInt($.parseJSON(str)[0]["COUNT(*)"]);
						// every how many-eth row should we query?
						var everyNthRow = Math.floor(size / resolution);
						var tweetsQuery = "set @row:=-1; SELECT json.* FROM json "
							+ "INNER JOIN ( SELECT id FROM ( SELECT @row:=@row+1 AS rownum, id FROM "
								+ "( SELECT id FROM json ORDER BY id )"
								+ " AS sorted ) as ranked WHERE rownum % " 
							+ everyNthRow + " = 0 ) AS subset ON subset.id = json.id";
						self.customMultiQuery(tweetsQuery, function(str) {
							self.outputView.renderGraph(str);
						
						});
					});
				}

				// new method where we use query to calculate sum of tweets for 3 by 3 days.

				var tableName = $("#command-viewGraph-tableName").val();//"json";
				if (tableName == "") tableName = "json";
				var releaseDate = $("#command-viewGraph-date").val();//"2015-10-14";
				if (releaseDate == "") releaseDate = "2015-10-14";
				
				var daysPerHistogramBin = $("#command-viewGraph-binSize").val();//1;
				if (daysPerHistogramBin == "") daysPerHistogramBin = 1;

				var daysRange = $("#command-viewGraph-daysRange").val();//14;
				if (daysRange == "") daysRange = 14;

				var sumPerDayQuery = "SELECT DATE_FORMAT(DATE_SUB(`created_at`, INTERVAL MOD(DAY(`created_at`), "+daysPerHistogramBin+") DAY), '%m-%d')"
					+" as DATES, Count(*) AS COUNT FROM `"+tableName+"` WHERE (`created_at` "
					+"BETWEEN DATE_SUB('"+releaseDate+" 00:00:00', INTERVAL "+daysRange+" DAY) AND DATE_ADD('"+releaseDate+" 00:00:00', INTERVAL "+daysRange+" DAY)  ) group by DATES";
				
				// using fusioncharts
				// http://www.fusioncharts.com/dev/getting-started/building-your-first-chart.html
				// <div id="chartContainer">FusionCharts XT will load here!</div>
				$("#output").html('<div id="fusionChartContainer">FusionCharts XT will load here!</div>');

				var width = $("#fusionChartContainer").width();
				var height = 400;//$("#fusionChartContainer").height();


				self.customQuery(sumPerDayQuery, function(str) {
					
					var chartData = str;
					// THX second answer from http://stackoverflow.com/questions/1144783/replacing-all-occurrences-of-a-string-in-javascript
					chartData = chartData.split("DATES").join("label");
					chartData = chartData.split("COUNT").join("value");

					FusionCharts.ready(function(){
					      var revenueChart = new FusionCharts({
					        "type": "column2d",
					        "renderAt": "fusionChartContainer",
					        "width": width,
					        "height": height,
					        "dataFormat": "json",
					        "dataSource": {
					          "chart": {
					              "caption": "Tweet Histogram",
					              "subCaption": "Table: " + tableName,
					              "xAxisName": "Dates",
					              "yAxisName": "Tweet count",
					              "theme": "fint"
					           },
					          "data": 
					          	  JSON.parse(chartData)
					          // [
					          //     {
					          //        "label": "Jan",
					          //        "value": "420000"
					          //     },
					          //     {
					          //        "label": "Feb",
					          //        "value": "810000"
					          //     },
					          //     {
					          //        "label": "Mar",
					          //        "value": "720000"
					          //     }
					          //  ]

					        }
					    });

					    revenueChart.render();
					});

				});

				event.preventDefault();

			}); // end viewGraph
			
			return this;
		},
		customQuery: function(query, callback) {
			var self = this;
			var ajaxData = "query=" + encodeURIComponent(query);
			
			// default async ajax request																									
			jQuery.ajax({																	
				type: "POST",																	
				url: "php/customQuery.php",																	
				dataType: "text",																	
				data: ajaxData,																	
				success: function(response) {																	
					if (callback != null) {																	
						callback(response);																	
					}																	
					return response;																	
				},																	
				error: function(xhr, ajaxOptions, thrownError) {																	
					if (callback != null) {																	
						console.log("error");																	
						callback(thrownError);																	
					}																	
					return thrownError;																	
				}																	
			});																	
			
		},
		customMultiQuery: function(query, callback) {
			var self = this;
			var ajaxData = "multiquery=" + encodeURIComponent(query);
			
			// default async ajax request
			jQuery.ajax({
				type: "POST",
				url: "php/customQuery.php",
				dataType: "text",
				data: ajaxData,
				success: function(response) {
					if (callback != null) {
						callback(response);
					}
					return response;
				},
				error: function(xhr, ajaxOptions, thrownError) {
					if (callback != null) {
						console.log("error");
						callback(thrownError);
					}
					return thrownError;
				}
			});
			
		}
    });

});