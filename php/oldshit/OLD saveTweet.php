<?php

try {

	// config database
	include_once("config.php");
	
	$decodedPost = urldecode($_POST['tweet']);
	
	// ================================ Raw tweet saving ====================================
	
	// raw tweet
	$rawtweet = mysql_real_escape_string($decodedPost);
	
	// current date
	$now = date("Y-m-d H:i:s");
	
	// create query
		$query 	=		"INSERT INTO";
		// table name
		$query	.= 		" `tweets` ";
		// columns 
		$query	.=		" (`id`, `tweet`, `date`) ";
		$query	.=		" VALUES ";
		// values of columns
		$query	.=		" (NULL, '{$rawtweet}', '{$now}') ";
		
	// post tweet in tweets table
	$result = mysql_query($query, $connection);// or die(mysql_error());
	
	// ================================ Word count saving ====================================
	
	// POST['tweet'], after decoding, should be a string of one or more words delimited by spaces.
	// they will be inserted in the database as multiple values in a single query for efficiency.
	
	// lowercase string
	$words = strtolower($decodedPost);
	
	//// removes non-word characters and underscores from string, using regular expressions. they can be passed through POST
	//$regexp = "/[^A-Za-z0-9 @]/";
	//if (isset($_POST['regexp'])) {
	//	$regexp = $_POST['regexp'];
	//}
	//$words = preg_replace($regexp, '', $words);
	//// removes excess whitespace, leaving just a single space
	//$words = preg_replace( '/\s+/', ' ', $words );
	
	$words = mysql_real_escape_string($words);
	
	// change var to array of strings split by " "
	$words = explode(' ', $words);
	
	// create query
		$query 	=		"INSERT INTO";
		// table name
		$query	.= 		" `wordscount` ";
		// columns 
		$query	.=		" (`id`, `word`, `count`) ";
		$query	.=		" VALUES ";
		// values of columns
		$query	.=		" (NULL, '{$words[0]}', '1') ";
		
		// for each extra word add another line of values
		for ($i = 1; $i < count($words); $i++) {
			$query .= " ,(NULL, '{$words[$i]}', '1') ";
		}
		
		// if duplicate key (the word), increase count instead of new row
		$query	.=		" ON DUPLICATE KEY UPDATE ";
		// handle duplicate data
		$query	.=		" count = count + 1 ";

	// post words data to wordscount table
	$result = mysql_query($query, $connection);// or die(mysql_error());
	
	
	
	// close connection. or not. test if it matters.
	mysql_close();
	
} 
catch (Exception $e) 
{
    echo 'Caught exception: ',  $e->getMessage(), "\n";
}

//*/
?>