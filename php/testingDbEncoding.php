<?php

try {

	// config database
	include_once("config.php");
	
	//$decodedPost = rawurldecode($_POST['json']);
	
	// ================================ Raw tweet-json saving ====================================
	
	//$json = json_decode($_POST['json']);
	
	//$text = mysqli_real_escape_string($mysqli, $json->text);
	
	$text = "┼∟│ñ*7→▄";
	
	// create query
		$query 	=		"INSERT INTO";
		// table name
		$query	.= 		" `json` ";
		// columns 
		$query	.=		" (`id`, `tweet`) ";
		$query	.=		" VALUES ";
		// values of columns
		$query	.=		" (NULL, '{$text}') ";
		
	// post json data to json table
	$result = mysqli_query($mysqli, $query);// or die(mysql_error());
	
	if ($result == FALSE) {
		echo 'RESULT WAS FALSE OH NOES';
		echo mysqli_error($mysqli);
	}
	
	// close connection. or not. test if it matters.
	mysqli_close($mysqli);
	
} 
catch (Exception $e) 
{
    echo 'Caught exception: ',  $e->getMessage(), "\n";
}

//*/
?>