<?php
try {
	// database mysqli and return custom query results ::>:>>::>:>:>
	include_once("config.php");

	if (isset($_POST["multiquery"])) {
		// try multi query mode
		$query = rawUrlDecode($_POST["multiquery"]);
		
		$result = mysqli_multi_query($mysqli, $query);
		
		if ($result === FALSE) {
			echo "Query did not work. \n";
			echo mysqli_error($mysqli);
			
		} else if ($result === 0) {
			echo "No results returned";
		} else {
			// first result is just setting a variable. ignore it.
			$result = mysqli_use_result($mysqli);
			
			if (mysqli_next_result($mysqli)) {
				// second result is the actual data.
				$result = mysqli_use_result($mysqli);
				$myArray = array();
				
				while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
					$tempArray = $row;
					// some strings contain fucked up characters
					//$tempArray["tweet"] = stripslashes($tempArray["tweet"]);
					//$tempArray["user_name"] = stripslashes($tempArray["user_name"]);
					
					array_push($myArray, $tempArray);
					
				}
				echo json_encode($myArray);
				
			}
			mysqli_close($mysqli);
		}
		
	} else {
		// try single query mode (which surely works..)
		$query = rawUrlDecode($_POST["query"]);
		
		// echo "<p>";
		// echo "Query: " . $query;
		// echo "</p>";

		// using single query mode
		$result = mysqli_query($mysqli, $query);
		
		if ($result === FALSE) {
			echo "Query did not work. \n";
			echo mysqli_error($mysqli);
			
		} else if ($result === 0) {
			echo "No results returned";
		} else {
			
			$i = 0;
			$numRows = mysqli_num_rows($result);
			///////////$response = "";
			// $response = "[";
			// while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
				// $response .= "{";
				// foreach ($row as $key => $value) {
					////////////quotes around $key and $value
					//////////// use json_encode() because it adds "" and cleans weird characters that make errors
					// $response .= json_encode($key) . " : " . json_encode($value) . ",";
				// }
				// $i++;
				// $response .= "},";
			// }
			// $response .= "]";
			// $response = str_replace(",}", "}", $response);
			// $response = str_replace(",]", "]", $response);
			// echo $response;
			$myArray = array();
			while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
				$tempArray = $row;
				// some strings contain fucked up characters
				//$tempArray["tweet"] = stripslashes($tempArray["tweet"]);
				//$tempArray["user_name"] = stripslashes($tempArray["user_name"]);
				
				array_push($myArray, $tempArray);
				
			}
			echo json_encode($myArray);
			
		}
			
		mysqli_close($mysqli);
	}
} catch (Exception $e) {
	echo $e;
}

?>