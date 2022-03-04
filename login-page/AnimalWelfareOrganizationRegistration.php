<?php 
session_start();
include('C:\xampp\htdocs\developgetpet\includes\config.php');
if(isset($_POST['insert']))
{

$OrganizationName=($_POST['OrganizationName']);
$OrganizationManager=($_POST['OrganizationManager']);
$Logo = $_FILES["Logo"]["name"];
$tmp_dir = $_FILES["Logo"]["tmp_name"];

move_uploaded_file($tmp_dir, "C:/xampp/htdocs/GETPET/web/images/$Logo");
$ContactNo=($_POST['ContactNo']);
$Address=($_POST['Address']);
$Email=($_POST['Email']);
$Username=($_POST['Username']);
$Password=($_POST['Password']);

$sql="INSERT INTO register(orgName,orgManager,Image,contactNo,Address,Email,Username,Password,Role,registerDate)VALUES(:Firstname,:Lastname,:Logo,:ContactNo,:Address,:Email,:Username,:Password,'Animal Welfare Organization',Now())";
$query=$dbh->prepare($sql); 
$query->bindParam(':Firstname',$OrganizationName,PDO::PARAM_STR);
$query->bindParam(':Lastname',$OrganizationManager,PDO::PARAM_STR);
$query->bindParam(':Logo',$Logo,PDO::PARAM_STR);
$query->bindParam(':ContactNo',$ContactNo,PDO::PARAM_STR);
$query->bindParam(':Address',$Address,PDO::PARAM_STR);
$query->bindParam(':Email',$Email,PDO::PARAM_STR);
$query->bindParam(':Username',$Username,PDO::PARAM_STR);
$query->bindParam(':Password',$Password,PDO::PARAM_STR);
$query->execute();

$sql2="SELECT userID FROM register ORDER BY userID DESC";
$query2=$dbh->prepare($sql2);
$query2->execute();

$ID=$query2->fetchColumn();


$OrganizationName=($_POST['OrganizationName']);
$OrganizationManager=($_POST['OrganizationManager']);
$Logo = $_FILES["Logo"]["name"];
$tmp_dir = $_FILES["Logo"]["tmp_name"];

move_uploaded_file($tmp_dir, "C:/xampp/htdocs/GETPET/web/images/$Logo");
$ContactNo=($_POST['ContactNo']);
$Address=($_POST['Address']);
$Email=($_POST['Email']);
$Username=($_POST['Username']);
$Password=($_POST['Password']);

$sql1="INSERT INTO animalwelfareorganization(orgID,orgName,orgManager,orgLogo,orgContactNo,orgAddress,orgEmail,orgUsername,orgPassword,Role)VALUES($ID,:OrganizationName,:OrganizationManager,:Logo,:ContactNo,:Address,:Email,:Username,:Password,'Animal Welfare Organization')";
$query1=$dbh->prepare($sql1); 
$query1->bindParam(':OrganizationName',$OrganizationName,PDO::PARAM_STR);
$query1->bindParam(':OrganizationManager',$OrganizationManager,PDO::PARAM_STR);
$query1->bindParam(':Logo',$Logo,PDO::PARAM_STR);
$query1->bindParam(':ContactNo',$ContactNo,PDO::PARAM_STR);
$query1->bindParam(':Address',$Address,PDO::PARAM_STR);
$query1->bindParam(':Email',$Email,PDO::PARAM_STR);
$query1->bindParam(':Username',$Username,PDO::PARAM_STR);
$query1->bindParam(':Password',$Password,PDO::PARAM_STR);
$query1->execute();

$OrganizationName=($_POST['OrganizationName']);
$OrganizationManage=($_POST['OrganizationManager']);
$Logo = $_FILES["Logo"]["name"];
$tmp_dir = $_FILES["Logo"]["tmp_name"];

move_uploaded_file($tmp_dir, "C:/xampp/htdocs/GETPET/web/images/$Logo");
$ContactNo=($_POST['ContactNo']);
$Address=($_POST['Address']);
$Email=($_POST['Email']);
$Username=($_POST['Username']);
$Password=($_POST['Password']);

$sql3="INSERT INTO login(userID,orgName,orgManager,Image,contactNo,Address,Email,Username,Password,Role)VALUES($ID,:OrganizationName,:OrganizationManager,:Logo,:ContactNo,:Address,:Email,:Username,:Password,'Animal Welfare Organization')";
$query3=$dbh->prepare($sql3); 
$query3->bindParam(':OrganizationName',$OrganizationName,PDO::PARAM_STR);
$query3->bindParam('OrganizationManager',$OrganizationManager,PDO::PARAM_STR);
$query3->bindParam(':Logo',$Logo,PDO::PARAM_STR);
$query3->bindParam(':ContactNo',$ContactNo,PDO::PARAM_STR);
$query3->bindParam(':Address',$Address,PDO::PARAM_STR);
$query3->bindParam(':Email',$Email,PDO::PARAM_STR);
$query3->bindParam(':Username',$Username,PDO::PARAM_STR);
$query3->bindParam(':Password',$Password,PDO::PARAM_STR);
$query3->execute();

echo '<script>alert("Registered Successfully!")</script>';
echo "<script type ='text/javascript'> document.location='http://localhost/developgetpet/web/Dashboard.php'</script>";
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
    <title>GETPET</title>
  </head>
  <body>
  

  <div class="d-lg-flex half">
    <div class="bg order-1 order-md-2" style="background-image: url('images/doggy.jpg'); height:870px;"></div>
    <div class="contents order-2 order-md-1">
      <div class="container">      
          <div class="col-md-7">
            <form class="login100-form validate-form" style=" width: 50vw; margin-left : -3vw;" method="post" nctype="multipart/form-data">
              <br>
              <br>
              <br>
					      <p style="text-align:center;"><img src="images/Logo.png" style="width:250px;height:250px;margin-top:-80px;margin-left:-15px;" alt=" " class="img-responsive"/></p>
                  <h3 style="text-align:center;margin-top:-40px;">Animal Welfare Organization <strong>Registration:</strong></h3>
					<br>
					<div style="text-align: center" class="wrap-input100 validate-input">
						<input class="input100" style="background-color:#f1f1f1;width:250px;height:40px;border:none;" type="text" name="OrganizationName" required="required" placeholder="Organization Name">
					</div><br>
          <div style="text-align: center" class="wrap-input100 validate-input">
						<input class="input100" style="background-color:#f1f1f1;width:250px;height:40px;border:none;" type="text" name="OrganizationManager" required="required" placeholder="Organization Manager">
						<span class="focus-input100"></span>
					</div><br>
          <div style="text-align: center" class="wrap-input100 validate-input">
                        <a style="margin-left:-160px;">Upload Logo</a><br><br>
                        <input type="file" name="Logo" id="Logo" 
                        style="width:250px;height:40px;border:none;" placeholder="Upload Logo">
					</div><br>
                    
					<div  style="text-align: center" class="wrap-input100 validate-input">
						<input class="input100" style="background-color:#f1f1f1;width:250px;height:40px;border:none;font-family:Arial;" type="text" name="ContactNo" onkeypress="isInputNumber(event)" maxlength="11" placeholder="Contact No.">
						<script>
            
                        function isInputNumber(evt){
                
                        var ch = String.fromCharCode(evt.which);
                
                        if(!(/[0-9]/.test(ch))){
                        evt.preventDefault();
                       }
					}
                    </script>
					</div><br>
					<div style="text-align: center" class="wrap-input100 validate-input">
						<input class="input100" style="background-color:#f1f1f1;width:250px;height:40px;border:none;" type="text" name="Address" required="required" placeholder="Address">
					</div><br>
					<div style="text-align: center" class="wrap-input100 validate-input" data-validate = "Valid email is required: ex@abc.xyz">
						<input class="input100" style="background-color:#f1f1f1;width:250px;height:40px;border:none;" type="text" name="Email" required="required" placeholder="Email">
					</div><br>
          <div style="text-align: center" class="wrap-input100 validate-input" data-validate = "Valid username is required: ex@abc.xyz">
						<input class="input100" style="background-color:#f1f1f1;width:250px;height:40px;border:none;" type="text" name="Username" required="required" placeholder="Username">
					</div><br>
					<div  style="text-align: center" class="wrap-input100 validate-input" data-validate="Password is required">
						<input class="input100" style="background-color:#f1f1f1;width:250px;height:40px;border:none;" type="password" name="Password" required="required" placeholder="Password">
					</div><br><br>
					<div style="text-align: center">
						<button  class="login100-form-btn" style="background-color:#00cdc1;width:250px;height:40px;border:none;" name="insert" type="submit" id="insert" value="Insert">
							<a style="color:White"> Register </a>
						</button>
					</div><br>
          <p style="text-align:center;"><span class="ml-auto"><a href="http://localhost/developgetpet/login-page/login.php" class="forgot-pass">I am already a member</a></span></p>
          <br>
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