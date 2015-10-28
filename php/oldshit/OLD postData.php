<?php

try {

	// config database
	include_once("config.php");
	
	// POST['words'] should be a string of one or more words delimited by spaces.
	// they will be inserted in the database as multiple values in a single query for efficiency.
	
	$rawtweet = mysql_real_escape_string($_POST['words']);
	
	// lowercase string
	$words = strtolower($_POST['words']);
	
	//// removes non-word characters and underscores from string, using regular expressions. they can be passed through POST
	//$regexp = "/[^A-Za-z0-9 @]/";
	//if (isset($_POST['regexp'])) {
	//	$regexp = $_POST['regexp'];
	//}
	//$words = preg_replace($regexp, '', $words);
	//// removes excess whitespace, leaving just a single space
	//$words = preg_replace( '/\s+/', ' ', $words );
	
	$words = mysql_real_escape_string($words);
	
	$now = date("Y-m-d H:i:s");
	
	// change var to array of strings split by " "
	$words = explode(' ', $words);
	
		$query 	=		"INSERT INTO";
		// table name
		$query	.= 		" `wordscount` ";
		// columns 
		$query	.=		" (`id`, `word`, `count`, `first_tweet`, `first_date`) ";
		$query	.=		" VALUES ";
		// values of columns
		$query	.=		" (NULL, '{$words[0]}', '1', '{$rawtweet}', '{$now}') ";
		
		// for each extra word add another line of values
		for ($i = 1; $i < count($words); $i++) {
			$query .= " ,(NULL, '{$words[$i]}', '1', '{$rawtweet}', '{$now}') ";
		}
		
		// if duplicate key (the word), increase count instead of new row
		$query	.=		" ON DUPLICATE KEY UPDATE ";
		// handle duplicate data
		$query	.=		" count = count + 1 ";

	// actually post data
	$result = mysql_query($query, $connection);// or die(mysql_error());

	// close connection. or not. test if it matters.
	mysql_close();
	
	echo "worked. \r\n";

} 
catch (Exception $e) 
{
    echo 'Caught exception: ',  $e->getMessage(), "\n";
}

//*/
?>