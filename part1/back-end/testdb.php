<?php
$servername = "localhost";
$username = "root";
$password = "SD@001Micr";
$database = "moviedb";

// Connection
$conn = new mysqli($servername, $username, $password, $database);

// Success or not
if ($conn->connect_error){
        die("Connection filed: ". $conn->connect_error);

}

//echo "Conected successfully";

$sql = "SELECT title, genre, director,release_year FROM movies";
$result = $conn->query($sql);

if ($result->num_rows > 0){
        //echo "Work!!";
        // output data of each row
        while ($row = $result->fetch_assoc()){
          echo "Title: ".$row["title"]. ", Genre: ".$row["genre"]. ", Director: ".$row["director"]. ", Year: ".$row["release_year"]."<br>";
        }

} else{
        echo "0 results";
}

$conn->close();

?>
