<?php 
session_start();
include('C:\xampp\htdocs\developgetpet\includes\config.php');
if(isset($_POST['login']))
{
	$Username=$_POST['Username'];
    $Password=$_POST['Password'];

    $sql = "SELECT * FROM admin WHERE adUsername = :Username AND adPassword =:Password";
    $query = $dbh->prepare($sql);
    $query->bindParam(':Username', $Username,PDO::PARAM_STR);
    $query->bindParam(':Password', $Password,PDO::PARAM_STR);
    $query->execute();
    $results=$query->fetch(PDO::FETCH_ASSOC);
    

    if($query->rowCount()>0)
    {

        session_regenerate_id();
		    $_SESSION['adID'] = $results['adID'];
       
        echo '<script>alert("Login Successfully!")</script>';
        echo "<script type ='text/javascript'> document.location='http://localhost/developgetpet/web/AdminDashboard.php'</script>";


    }

    $sql1 = "SELECT * FROM petowner WHERE ownerUsername = :Username AND ownerPassword =:Password";
    $query1 = $dbh->prepare($sql1);
    $query1->bindParam(':Username', $Username,PDO::PARAM_STR);
    $query1->bindParam(':Password', $Password,PDO::PARAM_STR);
    $query1->execute();
    $results1=$query1->fetch(PDO::FETCH_ASSOC);
    

    if($query1->rowCount()>0)
    {

        session_regenerate_id();
		    $_SESSION['ownerID'] = $results1['ownerID'];
        $_SESSION['ownerFirstname'] = $results1['ownerFirstname'];
        $_SESSION['ownerLastname'] = $results1['ownerLastname'];

        $ID=$_SESSION['ownerID'];

        $Date=($_POST['Date']);

        $sql="update login set loginDate=:Date where userID=$ID";
        $query=$dbh->prepare($sql); 
        $query->bindParam(':Date',$Date,PDO::PARAM_STR);
        $query->execute();

        echo '<script>alert("Login Successfully!")</script>';
        echo "<script type ='text/javascript'> document.location='http://localhost/developgetpet/dashboard/PetOwnerDashboard.php'</script>";
        echo $_SESSION['ownerID'];
        echo $_SESSION['ownerFirstname'];
        echo $_SESSION['ownerLastname'];

    }

    $sql2 = "SELECT * FROM petadopter WHERE adopterUsername = :Username AND adopterPassword =:Password";
    $query2 = $dbh->prepare($sql2);
    $query2->bindParam(':Username', $Username,PDO::PARAM_STR);
    $query2->bindParam(':Password', $Password,PDO::PARAM_STR);
    $query2->execute();
    $results2=$query2->fetch(PDO::FETCH_ASSOC);
    

    if($query2->rowCount()>0)
    {

        session_regenerate_id();
		    $_SESSION['adopterID'] = $results2['adopterID'];
        $_SESSION['adopterFirstname'] = $results2['adopterFirstname'];
        $_SESSION['adopterLastname'] = $results2['adopterLastname'];

        $ID=$_SESSION['adopterID'];

        $Date=($_POST['Date']);

        $sql="update login set loginDate=:Date where userID=$ID";
        $query=$dbh->prepare($sql); 
        $query->bindParam(':Date',$Date,PDO::PARAM_STR);
        $query->execute();

        echo '<script>alert("Login Successfully!")</script>';
        echo "<script type ='text/javascript'> document.location='http://localhost/developgetpet/dashboard/PetAdopterDashboard.php'</script>";
        echo $_SESSION['adopterID'];
        echo $_SESSION['adopterFirstname'];
        echo $_SESSION['adopterLastname'];

    }

    $sql3 = "SELECT * FROM animalwelfareorganization WHERE orgUsername = :Username AND orgPassword =:Password";
    $query3 = $dbh->prepare($sql3);
    $query3->bindParam(':Username', $Username,PDO::PARAM_STR);
    $query3->bindParam(':Password', $Password,PDO::PARAM_STR);
    $query3->execute();
    $results3=$query3->fetch(PDO::FETCH_ASSOC);
    

    if($query3->rowCount()>0)
    {

        session_regenerate_id();
		    $_SESSION['orgID'] = $results3['orgID'];
        $_SESSION['orgName'] = $results3['orgName'];
        $_SESSION['orgManager'] = $results3['orgManager'];

        $ID=$_SESSION['orgID'];

        $Date=($_POST['Date']);

        $sql="update login set loginDate=:Date where userID=$ID";
        $query=$dbh->prepare($sql); 
        $query->bindParam(':Date',$Date,PDO::PARAM_STR);
        $query->execute();

        echo '<script>alert("Login Successfully!")</script>';
        echo "<script type ='text/javascript'> document.location='http://localhost/developgetpet/dashboard/AnimalWelfareOrganizationDashboard.php'</script>";
        echo $_SESSION['ID'];
        echo $_SESSION['OrganizationName'];
        echo $_SESSION['OrganizationManager'];

    }
    
    else 
    echo '<script>alert("Invalid Account!")</script>';
	



}
?>
<!doctype html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link href="https://fonts.googleapis.com/css?family=Roboto:300,400&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="fonts/icomoon/style.css">

    <link rel="stylesheet" href="css/owl.carousel.min.css">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="css/bootstrap.min.css">
    
    <!-- Style -->
    <link rel="stylesheet" href="css/style.css">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <style>
    .material-icons {vertical-align:-16%}
    </style>
    <title>GetPet</title>
  </head>
  <body>
  

  <div class="d-lg-flex half">
    <div class="bg order-1 order-md-2" class="responsive" style="background-image: url('images/doggy.jpg');"></div>
    <div class="contents order-2 order-md-1">
      <div class="container">
        <div class="row align-items-center justify-content-center">
          <div class="col-md-7">
          <a href="http://localhost/developgetpet/web/Dashboard.php">
          <p style="text-align:center;"><img src="images/Logo.png" style="width:250px;height:250px;margin-bottom:-90px;margin-top:-50px;margin-right:-15px;" alt=" " class="img-responsive"/></p>
          </a>
          <br>
          <h5>LOGIN TO <strong>GetPet</strong></h5>
            <form action="#" method="post">
              <div class="form-group first">
                <label for="username">Username:</label>
                <input type="text" name="Username" class="form-control" placeholder="Username" id="Username" required="required">
              </div>
              <div class="form-group last mb-3">
                <label for="password">Password:</label>
                <input type="password" name="Password" class="form-control" placeholder="Password" id="Password" required="required">
              </div>
              
              <?php
                date_default_timezone_set("Asia/Manila");
                ?>
              <div hidden style="text-align: center" class="wrap-input100 validate-input">
						    <input class="input100" style="background-color:#f1f1f1;width:250px;height:40px;border:none;" name="Date" required="required" value="<?php echo date('Y-m-d'); ?>" autocomplete="off">
					    </div>
              
              <div class="d-flex mb-5 align-items-center" >
              Show password:<input type="checkbox" onclick="myfunction()" value="Show password">
              
                  <div class="control__indicator"></div>
                </label>
                <span class="ml-auto"><a href="#" class="forgot-pass">Forgot Password</a></span> 
              </div>
              
              
              <input type="submit" name="login" value="Log In" class="btn btn-block btn-primary" style="background-color:#00cdc1;border:#00cdc1;">
              <p  style="text-align:center;"><span class="ml-auto"><a href="http://localhost/developgetpet/login-page/selectrole.php" class="forgot-pass">Don't have an account yet?Click here to register!</a></span></p>
            </form>
          </div>
        </div>
      </div>
    </div> 
  </div>
    <script src="js/jquery-3.3.1.min.js"></script>
    <script src="js/popper.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/main.js"></script>

    <script>
	
		function myfunction()
		{
			var x=document.getElementById("Password");
			if(x.type =="password")
			{
				x.type="text";
			}
			
			else
			{
				x.type="password";
			}
		}
    </script>

  </body>
</html>