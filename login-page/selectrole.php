<?php 
session_start();
include('C:\xampp\htdocs\developgetpet\includes\config.php');
if(isset($_POST['PetAdopter']))
{
	
   echo "<script type ='text/javascript'> document.location='http://localhost/developgetpet/apps/login-page/PetAdopterRegistration.php'</script>";

}
if(isset($_POST['PetOwner']))
{
	
   echo "<script type ='text/javascript'> document.location='http://localhost/GETPET/login-page/PetOwnerRegistration.php'</script>";

}
if(isset($_POST['AnimalWelfareAgency']))
{
	
   echo "<script type ='text/javascript'> document.location='http://localhost/GETPET/login-page/AnimalWelfareOrganizationRegistration.php'</script>";

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
    <div class="bg order-1 order-md-2" style="background-image: url('images/doggy.jpg');"></div>
    <div class="contents order-2 order-md-1">
      
        <div class="row align-items-center justify-content-center">
          <div class="col-md-7">
              <br>
              <br>
          <p style="text-align:center;"><img src="images/Logo.png" style="width:450px;height:450px;margin-top:-80px;" alt=" " class="img-responsive"/></p>
            <h3>Select <strong>Role:</strong></h3>
            <a href="http://localhost/developgetpet/apps/login-page/PetAdopterRegistration.php" style="color:White;"><button type="button" name="PetAdopter" href="http://localhost/GETPET/login-page/login.php" class="btn btn-block btn-primary" style="background-color:#00cdc1;border:#00cdc1;">Pet Adopter</button></a>
            <br>
            <a href="http://localhost/GETPET/login-page/PetAdopterRegistration.php" style="color:White;"><button type="button" name="PetAdopter" href="http://localhost/GETPET/login-page/login.php" class="btn btn-block btn-primary" style="background-color:#00cdc1;border:#00cdc1;">Pet Owner</button></a>
            <br>
            <a href="http://localhost/GETPET/login-page/PetAdopterRegistration.php" style="color:White;"><button type="button" name="PetAdopter" href="http://localhost/GETPET/login-page/login.php" class="btn btn-block btn-primary" style="background-color:#00cdc1;border:#00cdc1;">Animal Welfare Organization</button></a>
            <br>
              <p  style="text-align:center;"><span class="ml-auto"><a href="http://localhost/developgetpet/apps/login-page/login.php" class="forgot-pass">I am already a member</a></span></p>
            </form>
          </div>
        </div>
      
    </div>

    
  </div>
    
    

    <script src="js/jquery-3.3.1.min.js"></script>
    <script src="js/popper.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/main.js"></script>
  </body>
</html>