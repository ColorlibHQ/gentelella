<?php 
session_start();
include('C:\xampp\htdocs\developgetpet\includes\config.php');
$ID=$_SESSION['ownerID'];
$sql = "SELECT * from petowner where ownerID=:ID";
$query=$dbh->prepare($sql);
$query->bindParam(':ID',$ID,PDO::PARAM_STR);
$query->execute();
$results=$query->fetchAll(PDO::FETCH_OBJ);
$cnt=1;
if($query->rowCount()>0)
{
  foreach($results as $result)
  {
     ?>
<p></p>
<?php
?>
<?php }} ?>
<?php
if(isset($_POST['update']))
{
$Firstname=($_POST['Firstname']);
$Lastname=($_POST['Lastname']);
$ContactNo=($_POST['ContactNo']);
$Address=($_POST['Address']);
$Email=($_POST['Email']);
$Username=($_POST['Username']);
$Password=($_POST['Password']);

$sql="update register set 
userFirstname=:Firstname,
userLastname=:Lastname,
contactNo=:ContactNo,
Address=:Address,
Email=:Email,
Username=:Username,
Password=:Password 
where userID=:ID";

$query=$dbh->prepare($sql);
$query->bindParam(':ID',$ID,PDO::PARAM_STR);  
$query->bindParam(':Firstname',$Firstname,PDO::PARAM_STR);
$query->bindParam(':Lastname',$Lastname,PDO::PARAM_STR);
$query->bindParam(':ContactNo',$ContactNo,PDO::PARAM_STR);
$query->bindParam(':Address',$Address,PDO::PARAM_STR);
$query->bindParam(':Email',$Email,PDO::PARAM_STR);
$query->bindParam(':Username',$Username,PDO::PARAM_STR);
$query->bindParam(':Password',$Password,PDO::PARAM_STR);
$query->execute();

$Firstname=($_POST['Firstname']);
$Lastname=($_POST['Lastname']);
$ContactNo=($_POST['ContactNo']);
$Address=($_POST['Address']);
$Email=($_POST['Email']);
$Username=($_POST['Username']);
$Password=($_POST['Password']);

$sql1="update petowner set
ownerFirstname=:Firstname,
ownerLastname=:Lastname,
ownerContactNo=:ContactNo,
ownerAddress=:Address,
ownerEmail=:Email,
ownerUsername=:Username,
ownerPassword=:Password 
where ownerID=:ID";
$query1=$dbh->prepare($sql1); 
$query1->bindParam(':ID',$ID,PDO::PARAM_STR); 
$query1->bindParam(':Firstname',$Firstname,PDO::PARAM_STR);
$query1->bindParam(':Lastname',$Lastname,PDO::PARAM_STR);
$query1->bindParam(':ContactNo',$ContactNo,PDO::PARAM_STR);
$query1->bindParam(':Address',$Address,PDO::PARAM_STR);
$query1->bindParam(':Email',$Email,PDO::PARAM_STR);
$query1->bindParam(':Username',$Username,PDO::PARAM_STR);
$query1->bindParam(':Password',$Password,PDO::PARAM_STR);
$query1->execute();

$Firstname=($_POST['Firstname']);
$Lastname=($_POST['Lastname']);
$ContactNo=($_POST['ContactNo']);
$Address=($_POST['Address']);
$Email=($_POST['Email']);
$Username=($_POST['Username']);
$Password=($_POST['Password']);

$sql3="update login set 
userFirstname=:Firstname,
userLastname=:Lastname,
contactNo=:ContactNo,
Address=:Address,
Email=:Email,
Username=:Username,
Password=:Password where userID=:ID";

$query3=$dbh->prepare($sql3); 
$query3->bindParam(':ID',$ID,PDO::PARAM_STR);
$query3->bindParam(':Firstname',$Firstname,PDO::PARAM_STR);
$query3->bindParam(':Lastname',$Lastname,PDO::PARAM_STR);
$query3->bindParam(':ContactNo',$ContactNo,PDO::PARAM_STR);
$query3->bindParam(':Address',$Address,PDO::PARAM_STR);
$query3->bindParam(':Email',$Email,PDO::PARAM_STR);
$query3->bindParam(':Username',$Username,PDO::PARAM_STR);
$query3->bindParam(':Password',$assword,PDO::PARAM_STR);
$query3->execute();
{
echo '<script>alert("Your Account Updated Successfully!")</script>';
$ID=$_SESSION['ownerID'];
$sql = "SELECT * from petowner where ownerID=:ID";
$query=$dbh->prepare($sql);
$query->bindParam(':ID',$ID,PDO::PARAM_STR);
$query->execute();
$results=$query->fetchAll(PDO::FETCH_OBJ);
$cnt=1;
if($query->rowCount()>0)
{
  foreach($results as $result)
  {
    ?>
                              
<p></p>
<?php
?>
<?php }}
}
}
?>

<?php
if(isset($_POST['profile']))
{
$Picture=$_POST['Picture'];

$sql="update register set 
Image=:Picture
where userID=:ID";

$query=$dbh->prepare($sql);
$query->bindParam(':ID',$ID,PDO::PARAM_STR);  
$query->bindParam(':Picture',$Picture,PDO::PARAM_STR);
$query->execute();


$Picture=($_POST['Picture']);

$sql1="update petowner set
ownerPicture=:Picture
where ownerID=:ID";
$query1=$dbh->prepare($sql1); 
$query1->bindParam(':ID',$ID,PDO::PARAM_STR); 
$query1->bindParam(':Picture',$Picture,PDO::PARAM_STR);
$query1->execute();


$Picture=$_POST['Picture'];

$sql3="update login set 
Image=:Picture
where userID=:ID";

$query3=$dbh->prepare($sql3);
$query3->bindParam(':ID',$ID,PDO::PARAM_STR); 
$query3->bindParam(':Picture',$Picture,PDO::PARAM_STR);
$query3->execute();
{
echo '<script>alert("Your Profile Picture Updated Successfully!")</script>';
$ID=$_SESSION['ownerID'];
$sql = "SELECT * from petowner where ownerID=:ID";
$query=$dbh->prepare($sql);
$query->bindParam(':ID',$ID,PDO::PARAM_STR);
$query->execute();
$results=$query->fetchAll(PDO::FETCH_OBJ);
$cnt=1;
if($query->rowCount()>0)
{
  foreach($results as $result)
  {
    ?>
                              
<p></p>
<?php
?>
<?php }}
}
}
?>
<!DOCTYPE html>
<html lang="en">
  <head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<!-- Meta, title, CSS, favicons, etc. -->
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<title>GETPET</title>

	<!-- Bootstrap -->
	<link href="../vendors/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
	<!-- Font Awesome -->
	<link href="../vendors/font-awesome/css/font-awesome.min.css" rel="stylesheet">
	<!-- NProgress -->
	<link href="../vendors/nprogress/nprogress.css" rel="stylesheet">
	<!-- iCheck -->
	<link href="../vendors/iCheck/skins/flat/green.css" rel="stylesheet">
	<!-- bootstrap-wysiwyg -->
	<link href="../vendors/google-code-prettify/bin/prettify.min.css" rel="stylesheet">
	<!-- Select2 -->
	<link href="../vendors/select2/dist/css/select2.min.css" rel="stylesheet">
	<!-- Switchery -->
	<link href="../vendors/switchery/dist/switchery.min.css" rel="stylesheet">
	<!-- starrr -->
	<link href="../vendors/starrr/dist/starrr.css" rel="stylesheet">
	<!-- bootstrap-daterangepicker -->
	<link href="../vendors/bootstrap-daterangepicker/daterangepicker.css" rel="stylesheet">

	<!-- Custom Theme Style -->
	<link href="../build/css/custom.min.css" rel="stylesheet">
</head>

<body class="nav-md">
    <div class="container body">
      <div class="main_container">
        <div class="col-md-3 left_col">
          <div class="left_col scroll-view">
            <div class="navbar nav_title" style="border: 0;">
              <a href="http://localhost/developgetpet/dashboard/PetOwnerDashboard.php" class="site_title"><i class="fa fa-paw"></i> <span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbspGETPET</span></a>
            </div>

            <div class="clearfix"></div>

					<!-- menu profile quick info -->
                    <div class="profile clearfix">
                    <!--<div class="profile_pic">
                    <img <?php echo"<img src = '/developgetpet/web/images/$result->ownerPicture'";?> alt="..." class="img-circle profile_img" style="background-color:#00cdc1;border:#00cdc1;">
                    </div>
                    <div class="profile_info">
                    <span>Welcome,</span>
                    <h2><?php echo ($result->ownerFirstname);?> <?php echo ($result->ownerLastname);?></h2>
                    </div>-->
                    <div class="clearfix"></div>
                    </div>
                    <!-- /menu profile quick info -->

					<br />

					<!-- sidebar menu -->
					<div id="sidebar-menu" class="main_menu_side hidden-print main_menu" >
              <div class="menu_section">
                    <ul class="nav side-menu">
                    <li>
                    <li><a href="http://localhost/developgetpet/dashboard/PetOwnerDashboard.php"><i></i> Dashboard </a>
                    </li>

                    <li>
                    <li><a href="http://localhost/developgetpet/dashboard/P.OPost.php">Pet Adoption</a>
                    </li>

                    <li>
                    <li><a href="#">Short-term Care</a>
                    </li>

                    <li>
                    <li><a href="#">Donation</a>
                    </li>

                    <li>
                    <li><a href="#">Fundraising activities</a>
                    </li>

                    <li>
                    <li><a href="#">Tips, Advice & Articles</a>
                    </li>

                    </ul>
					</div>
					</div>
					<!-- /sidebar menu -->

					<!-- /menu footer buttons -->
					<div class="sidebar-footer hidden-small">
                    <a data-toggle="tooltip" data-placement="top" title="Settings">
                    <span class="glyphicon glyphicon-cog" aria-hidden="true"></span>
                    </a>
                    <a data-toggle="tooltip" data-placement="top" title="Logout" href="http://localhost/developgetpet/login-page/login.php">
                    <span class="glyphicon glyphicon-off" aria-hidden="true"></span>
                    </a>
                    </div>
					<!-- /menu footer buttons -->
				</div>
			</div>

			<!-- top navigation -->
			<div class="top_nav">
            <div class="nav_menu">
                <div class="nav toggle">
                  <a id="menu_toggle"><i class="fa fa-bars"></i></a>
                </div>
                <nav class="nav navbar-nav">
                <ul class=" navbar-right">
                  <li class="nav-item dropdown open" style="padding-left: 15px;">
                    <a href="javascript:;" class="user-profile dropdown-toggle" aria-haspopup="true" id="navbarDropdown" data-toggle="dropdown" aria-expanded="false">
                    <img <?php echo"<img src = '/GETPET/web/images/$result->ownerPicture'";?> alt=""><?php echo ($result->ownerFirstname);?> <?php echo ($result->ownerLastname);?>
                    </a>
                    <div class="dropdown-menu dropdown-usermenu pull-right" aria-labelledby="navbarDropdown">
                      <a class="dropdown-item"  href="javascript:;" onclick="document.getElementById('id01').style.display='block'" class="w3-button w3-black" data-toggle="modal" data-target="#Profile"> Profile</a>
                      <a class="dropdown-item"  href="javascript:;" onclick="document.getElementById('id01').style.display='block'" class="w3-button w3-black" data-toggle="modal" data-target="#Settings"> Settings</a>
                      <!--<a class="dropdown-item"  href="javascript:;">
                          <span class="badge bg-red pull-right">50%</span>
                          <span>Settings</span>
                        </a>-->
                    <a class="dropdown-item"  href="http://localhost/developgetpet/dashboard/page_404.php" id="contact">Contact Us</a>
                      <a class="dropdown-item"  href="http://localhost/developgetpet/login-page/login.php"><i class="fa fa-sign-out pull-right"></i> Log Out</a>
                    </div>
                  </li>
  
                  <li role="presentation" class="nav-item dropdown open">
                    <a href="javascript:;" class="dropdown-toggle info-number" id="navbarDropdown1" data-toggle="dropdown" aria-expanded="false">
                      <i class="fa fa-envelope-o"></i>
                      <!--<span class="badge bg-green">6</span>-->
                    </a>
                    <ul class="dropdown-menu list-unstyled msg_list" role="menu" aria-labelledby="navbarDropdown1">
                      
                      <li class="nav-item">
                        <div class="text-center">
                          <a class="dropdown-item">
                            <strong>See All Alerts</strong>
                            <i class="fa fa-angle-right"></i>
                          </a>
                        </div>
                      </li>
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
			<!-- /top navigation -->

			<!-- page content -->
			<div class="right_col" role="main">
                <div class="">
                    <div class="page-title">
                        <div class="title_left">
                        <br>
                        <h2><?php echo ($result->Role);?>'s Dashboard</h2>
                        </div>

                        <div class="title_right">
                            <div class="col-md-5 col-sm-5 form-group pull-right top_search">
                                <div class="input-group">
                                    <input type="text" class="form-control" placeholder="Search for...">
                                    <span class="input-group-btn">
                                        <button class="btn btn-default" type="button">Go!</button>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

<<<<<<< Updated upstream
                    <!-- Post Button -->
=======
	<!-- Post Pet Code -->
<?php 
$ID=$_SESSION['ownerID'];

$sql = "SELECT * from petowner where ownerID=:ID";
$query=$dbh->prepare($sql);
$query->bindParam(':ID',$ID,PDO::PARAM_STR);
$query->execute();
$results=$query->fetchAll(PDO::FETCH_OBJ);
$cnt=1;
if($query->rowCount()>0)
{
  foreach($results as $result)
  {
     ?>
<p></p>
<?php
?>
<?php }} ?>

<?php
date_default_timezone_set("Asia/Manila");
$date = date('m/d/Y h:i:s A', time());
?>

<?php
if(isset($_POST['Post']))
{

$ID=($_POST['ID']);
$Name=($_POST['Name']);
$Email=($_POST['Email']);
$Address=($_POST['Address']);
$ContactNo=($_POST['ContactNo']);
$Type=($_POST['Type']);
$Petname=($_POST['Petname']);
$Breed=($_POST['Breed']);
$Gender=($_POST['Gender']);
$Age=($_POST['Age']);
$Color=($_POST['Color']);
$Weight=($_POST['Weight']);
$Vaccination=($_POST['Vaccination']);
$Deworming=($_POST['Deworming']);
$Description=($_POST['Description']);
$Picture = $_FILES["Picture"]["name"];
$tmp_dir = $_FILES["Picture"]["tmp_name"];

move_uploaded_file($tmp_dir, "C:/xampp/htdocs/developgetpet/web/images/$Picture");

$sql="INSERT INTO postforadoption(userID,Name,userEmail,userAddress,userContactNo,petType,petName,petBreed,petSex,petAge,petColor,petWeight,vaccinationStatus,dewormingStatus,petDescription,petPicture,postDate,availabilityStatus)VALUES(:ID,:Name,:Email,:Address,:ContactNo,:Type,:Petname,:Breed,:Gender,:Age,:Color,:Weight,:Vaccination,:Deworming,:Description,:Picture,'$date','Available')";
$query=$dbh->prepare($sql); 
$query->bindParam(':ID',$ID,PDO::PARAM_STR);
$query->bindParam(':Name',$Name,PDO::PARAM_STR);
$query->bindParam(':Email',$Email,PDO::PARAM_STR);
$query->bindParam(':Address',$Address,PDO::PARAM_STR);
$query->bindParam(':ContactNo',$ContactNo,PDO::PARAM_STR);
$query->bindParam(':Type',$Type,PDO::PARAM_STR);
$query->bindParam(':Petname',$Petname,PDO::PARAM_STR);
$query->bindParam(':Breed',$Breed,PDO::PARAM_STR);
$query->bindParam(':Gender',$Gender,PDO::PARAM_STR);
$query->bindParam(':Age',$Age,PDO::PARAM_STR);
$query->bindParam(':Color',$Color,PDO::PARAM_STR);
$query->bindParam(':Weight',$Weight,PDO::PARAM_STR);
$query->bindParam(':Vaccination',$Vaccination,PDO::PARAM_STR);
$query->bindParam(':Deworming',$Deworming,PDO::PARAM_STR);
$query->bindParam(':Description',$Description,PDO::PARAM_STR);
$query->bindParam(':Picture',$Picture,PDO::PARAM_STR);
$query->execute();

echo '<script>alert("Posted Successfully!")</script>';
echo "<script type ='text/javascript'> document.location='http://localhost/developgetpet/dashboard/P.O-Adoption.php'</script>";

}
?>
<!-- //Post Pet Code -->


                    <!-- Back Button -->
>>>>>>> Stashed changes
                    <a href="http://localhost/developgetpet/dashboard/P.O-Adoption.php"><button type="button" class="btn btn-round btn-success" style="background-color:#00cdc1;border:#00cdc1;">Back</button></a>

                    <div class="clearfix"></div>

                    <div class="row">

                        <div class="col-md-12 col-sm-12  ">
                        <div class="x_panel">
                        <div class="x_title">
                        <h2>Post Pet For Adoption</h2>
                        <ul class="nav navbar-right panel_toolbox">
                        <li><a class="collapse-link" style="margin-left:50px"><i class="fa fa-chevron-up"></i></a>
                        </li>          
                        </ul>
                        <div class="clearfix"></div>
                        </div>

                                <div class="x_content">
                                    <form class="" action="" method="post" novalidate>
                                         
                                        <span class="section"></span>
                                        <div class="field item form-group">
                                            <label class="col-form-label col-md-3 col-sm-3  label-align">Name<span class="required"></span></label>
                                            <div class="col-md-6 col-sm-6">
                                                <input class="form-control" data-validate-length-range="6" data-validate-words="2" name="name" value="<?php echo ($result->ownerFirstname);?> <?php echo ($result->ownerLastname);?>" disabled="disabled"/>
                                            </div>

                                        </div>
                                        <div class="field item form-group">
                                            <label class="col-form-label col-md-3 col-sm-3  label-align">Email<span class="required"></span></label>
                                            <div class="col-md-6 col-sm-6">
                                                <input class="form-control" name="email" class='email' value="<?php echo ($result->ownerEmail);?>" disabled="disabled"/></div>
                                        </div>

                                        <div class="field item form-group">
                                            <label class="col-form-label col-md-3 col-sm-3  label-align">Address<span class="required"></span></label>
                                            <div class="col-md-6 col-sm-6">
                                                <input class="form-control" type="email" class='email' name="confirm_email" value="<?php echo ($result->ownerAddress);?>" disabled="disabled" /></div>
                                        </div>

                                        <div class="field item form-group">
                                            <label class="col-form-label col-md-3 col-sm-3  label-align">Contact Number <span class="required"></span></label>
                                            <div class="col-md-6 col-sm-6">
                                                <input class="form-control" type="number" class='number' name="number" value="<?php echo ($result->ownerContactNo);?>" disabled="disabled"></div>
                                        </div>

                                        <div class="field item form-group">
											<label class="col-form-label col-md-3 col-sm-3  label-align" style="color:black;">Type of Pet <span class="required"></span></label>
											<div class="col-md-6 col-sm-6">
<<<<<<< Updated upstream
												<select class="form-control">
													<option>Type of pet...</option>
=======
												<select class="form-control" name="Type">
													<option> Select...</option>
>>>>>>> Stashed changes
													<option>Dog</option>
													<option>Cat</option>
												</select>
											</div>
										</div>

                                        <div class="field item form-group">
                                            <label class="col-form-label col-md-3 col-sm-3  label-align" style="color:black;" > Pet Name<span class="required"></span></label>
                                            <div class="col-md-6 col-sm-6">
                                                <input type="text" id="petname" class="form-control" name="petname" placeholder="Pet Name" required="required"/>
                                            </div>
                                        </div>

                                        <div class="field item form-group">
											<label class="col-form-label col-md-3 col-sm-3  label-align" style="color:black;" >Select Breed</label>
											<div class="col-md-6 col-sm-6">
												<select class="select2_group form-control">
													<optgroup label="Dog Breed">
                                                        <option value="#">Please Choose Breed...</option>
														<option value="#">Affenpinscher</option>
														<option value="#">Afghan hound</option>
														<option value="#">Airedale terrier</option>
														<option value="#">Beagle</option>
                                                        <option value="#">Bearded collie</option>
														<option value="#">bloodhound</option>
														<option value="#">Chihuahua</option>
														<option value="#">Chow chow</option>
                                                        <option value="#">Curly-coated retriever</option>
														<option value="#">Dachshund</option>
														<option value="#">Dalmatian</option>
														<option value="#">Doberman pinscher</option>
                                                        <option value="#">English cocker spaniel</option>
														<option value="#">English setter</option>
														<option value="#">English toy spaniel</option>
														<option value="#">French bulldog</option>
                                                        <option value="#">Foxhound</option>
                                                        <option value="#">Fox terrier</option>
                                                        <option value="#">German shepherd</option>
                                                        <option value="#">Golden retriever</option>
                                                        <option value="#">Greyhound</option>
                                                        <option value="#">Irish setter</option>
                                                        <option value="#">Irish water spaniel</option>
                                                        <option value="#">Irish wolfhound</option>
                                                        <option value="#">Jack Russell terrier</option>
                                                        <option value="#">Japanese spaniel</option>
                                                        <option value="#">keeshond</option>
                                                        <option value="#">Kerry blue terrier</option>
                                                        <option value="#">komondor</option>
                                                        <option value="#">Labrador retriever</option>
                                                        <option value="#">Lakeland terrier</option>
                                                        <option value="#">Lhasa apso</option>
                                                        <option value="#">Maltese</option>
                                                        <option value="#">Manchester terrier</option>
                                                        <option value="#">Mexican hairless</option>
                                                        <option value="#">Newfoundland</option>
                                                        <option value="#">Norwegian elkhound</option>
                                                        <option value="#">Norwich terrier</option>
                                                        <option value="#">Otterhound</option>
                                                        <option value="#">Pekingese</option>
                                                        <option value="#">Pomeranian</option>
                                                        <option value="#">Poodle</option>
                                                        <option value="#">Rottweiler</option>
                                                        <option value="#">Rhodesian ridgeback</option>
                                                        <option value="#">Saint Bernard</option>
                                                        <option value="#">Shih tzu</option>
                                                        <option value="#">Siberian husky</option>
                                                        <option value="#">Tibetan terrier</option>
                                                        <option value="#">Vizsla</option>
                                                        <option value="#">Weimaraner</option>
                                                        <option value="#">Welsh terrier</option>
                                                        <option value="#">West Highland white terrier</option>
                                                        <option value="#">Yorkshire terrier</option>
													</optgroup>
                                                    
                                                    <optgroup label="Cat Breed">
                                                    <option value="#">Please Choose Breed...</option>
                                                    <option value="#">Abyssinian</option>
                                                    <option value="#">Aegean</option>
                                                    <option value="#">American Bobtail</option>
                                                    <option value="#">Bengal</option>
                                                    <option value="#">Birman</option>
                                                    <option value="#">British Shorthair</option>
                                                    <option value="#">California Spangled</option>
                                                    <option value="#">Chantilly-Tiffany</option>
                                                    <option value="#">Chartreux</option>
                                                    <option value="#">Devon Rex</option>
                                                    <option value="#">Dwelf</option>
                                                    <option value="#">Dragon Li or
                                                    Chinese Li Hua</option>
                                                    <option value="#">Egyptian Mau</option>
                                                    <option value="#">Exotic Shorthair</option>
                                                    <option value="#">European Shorthair</option>
                                                    <option value="#">German Rex</option>
                                                    <option value="#">Havana Brown</option>
                                                    <option value="#">Highlander</option>
                                                    <option value="#">Himalayan or
                                                    Colorpoint Persian</option>
                                                    <option value="#">Japanese Bobtail</option>
                                                    <option value="#">Javanese or
                                                    Colorpoint Longhair</option>
                                                    <option value="#">Kanaani</option>
                                                    <option value="#">Khao Manee</option>
                                                    <option value="#">Kinkalow</option>
                                                    <option value="#">LaPerm</option>
                                                    <option value="#">Lykoi</option>
                                                    <option value="#">Lambkin</option>
                                                    <option value="#">Maine Coon</option>
                                                    <option value="#">Manx</option>
                                                    <option value="#">Mekong Bobtail</option>
                                                    <option value="#">Napoleon</option>
                                                    <option value="#">Nebelung</option>
                                                    <option value="#">Norwegian Forest Cat</option>
                                                    <option value="#">Ocicat</option>
                                                    <option value="#">Ojos Azules</option>
                                                    <option value="#">Oregon Rex</option>
                                                    <option value="#">Peterbald</option>
                                                    <option value="#">Persian</option>
                                                    <option value="#">Pixie-bob</option>
                                                    <option value="#">Ragamuffin or
                                                    Liebling</option>
                                                    <option value="#">Ragdoll</option>
                                                    <option value="#">Russian Blue</option>
                                                    <option value="#">Savannah</option>
                                                    <option value="#">Scottish Fold</option>
                                                    <option value="#">Selkirk Rex</option>
                                                    <option value="#">Tonkinese</option>
                                                    <option value="#">Toybob</option>
                                                    <option value="#">Toyger</option>
                                                    <option value="#">Ukrainian Levkoy</option>
                                                    <option value="#">York Chocolate</option>
                                                    </optgroup>

												</select>
											</div>
										</div>

                                        <div class="field item form-group">
                                        <label class="col-form-label col-md-3 col-sm-3  label-align" style="color:black;" >Gender<span class="required"></span></label>
											<div class="col-md-6 col-sm-6">
												<select class="form-control">
													<option>Please Choose...</option>
													<option value="#">Male</option>
													<option value="#">Female</option>
												</select>
											</div>
										</div>

                                        <div class="field item form-group">
<<<<<<< Updated upstream
                                            <label class="col-form-label col-md-3 col-sm-3  label-align">Age<span class="required"></span></label>
=======
                                            <label class="col-form-label col-md-3 col-sm-3  label-align" style="color:black;" >Pet Age<span class="required"></span></label>
>>>>>>> Stashed changes
                                            <div class="col-md-6 col-sm-6">
                                                <input class="form-control" type="number" class="number" name="number" placeholder="Pet Age" required="required"></div>
                                        </div>

                                        <div class="field item form-group">
                                            <label class="col-form-label col-md-3 col-sm-3  label-align" style="color:black;" >Pet Color<span class="required"></span></label>
                                            <div class="col-md-6 col-sm-6">
                                                <input type="text" id="petcolor" class="form-control" name="petcolor" placeholder="Pet Color" required="required"/>
                                            </div>
                                        </div>

                                        <div class="field item form-group">
                                            <label class="col-form-label col-md-3 col-sm-3  label-align" style="color:black;" >Pet Weight<span class="required"></span></label>
                                            <div class="col-md-6 col-sm-6">
                                                <input type="text" id="petweight" class="form-control" name="petweight" placeholder="Pet Weight" required="required"/>
                                            </div>
                                        </div>

<<<<<<< Updated upstream
                                        <div class="field item form-group">
											<label class="col-form-label col-md-3 col-sm-3  label-align">Description</label>
=======
                    <div class="field item form-group">
											<label class="col-form-label col-md-3 col-sm-3  label-align" style="color:black;" >Vaccination Status<span class="required"></span></label>
											<div class="col-md-6 col-sm-6">
												<select class="form-control" name="Vaccination">
													<option>Vaccination Status...</option>
													<option>Vaccinated</option>
													<option>Not Vaccinated</option>
												</select>
											</div>
										</div>

                    <div class="field item form-group">
											<label class="col-form-label col-md-3 col-sm-3  label-align" style="color:black;" > Deworming Status <span class="required"></span></label>
											<div class="col-md-6 col-sm-6">
												<select class="form-control" name="Deworming">
													<option>Deworming Status...</option>
													<option>Deworm</option>
													<option>Not Deworm</option>
												</select>
											</div>
										</div>

                    <div class="field item form-group">
											<label class="col-form-label col-md-3 col-sm-3  label-align" style="color:black;" >Description</label>
>>>>>>> Stashed changes
											<div class="col-md-6 col-sm-6">
												<textarea id="description" required="required" class="form-control" name="description" placeholder="Pet Description" data-parsley-trigger="keyup" data-parsley-minlength="20" data-parsley-maxlength="100" data-parsley-minlength-message="Come on! You need to enter at least a 20 caracters long comment.." data-parsley-validation-threshold="10"></textarea>
                                            </div>
										</div>

<<<<<<< Updated upstream
                                        <div class="field item form-group">
                                        <label class='col-form-label col-md-3 col-sm-3  label-align'>
                                        Date</label>
                                        <div class="col-md-6 col-sm-6">
                                        <div class='input-group date' id='myDatepicker4'>
                                        <input type='text' class="form-control" readonly="readonly" />
                                        <span class="input-group-addon">
                                        <span class="glyphicon glyphicon-calendar"></span>
                                        </span>
                                        </div>
                                        </div>
=======
                    <label class="col-form-label col-md-3 col-sm-3  label-align" style="color:black;" >Upload Pet Photo</label>
                    <br>
                    <div style="text-align: center" class="wrap-input100 validate-input">
                     <input type="file" name="Picture" id="Picture" style="width:250px;height:40px;border:none;margin-right:420px" placeholder="Upload Picture">
			              </div>
                    <?php
                    date_default_timezone_set("Asia/Manila");
                    ?>
                     <div class="field item form-group">
                                            <label class="col-form-label col-md-3 col-sm-3  label-align" style="color:black;" >Date<span class="required"></span></label>
                                            <div class="col-md-6 col-sm-6">
                                                <input type="text" id="petweight" class="form-control" name="Date" value="<?php echo date("m/d/Y h:i:s A", time());?>" placeholder="Current Date and Time" required="required"/>
                                            </div>
>>>>>>> Stashed changes
                                        </div>

                                        <div class="field item form-group">
											<label class="col-form-label col-md-3 col-sm-3  label-align">Availability<span class="required"></span></label>
											<div class="col-md-6 col-sm-6">
												<select class="form-control">
													<option>Availability...</option>
													<option>Already Adopted</option>
													<option>Available to Adopt</option>
												</select>
											</div>
										</div>
                                       

                                        <div class="ln_solid">
                                            <br>
                                            <div class="form-group">
                                                <div class="col-md-6 offset-md-3">
                                                    <button type='submit' class="btn btn-success" style="background-color:#00cdc1;border:#00cdc1;">Submit</button>
                                                    <button type='reset' class="btn btn-danger">Reset</button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
			<!-- /page content -->

            <!-- ModalProfile -->
  <div class="modal fade" id="Profile" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
  aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header text-center">
        <h4 class="modal-title w-100 font-weight-bold" style="margin-left:20px;">Profile</h4>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body mx-3">
      <form method="post">
        <div class="modal-header">
              <img <?php echo"<img src = '/GETPET/web/images/$result->ownerPicture'";?> alt="avatar" style="width:150px;height:150px;margin-left:125px;margin-top:-20px;" class="rounded-circle img-responsive">
        </div>
        <div style="text-align: center" class="wrap-input100 validate-input">
              <input type="file" name="Picture" id="Picture" style="width:250px;height:40px;border:none;margin-left:160px;margin-top:5px;" placeholder="Upload Photo">
				</div>
        <div style="text-align: center" class="wrap-input100 validate-input">
					    <input type="hidden" name="ownerID" value="<?php echo ( $result->ownerID);?>" required = "required" class="form-control" id="success">
				</div>
        <div style="text-align: center">
						  <button  class="login100-form-btn" style="background-color:#00cdc1;width:150px;height:35px;border:none;" name="profile" type="submit" id="insert" value="Insert">
							 <a style="color:White"> Update Profile </a>
						 </button>
				</div>
        <div style="text-align: center">
             <h6 class="mt-1 mb-2"><?php echo ($result->ownerFirstname);?> <?php echo ($result->ownerLastname);?></h6>
             <h6 class="mt-1 mb-2"><?php echo ($result->ownerContactNo);?></h6>
             <h6 class="mt-1 mb-2"><?php echo ($result->ownerAddress);?></h6>
             <h6 class="mt-1 mb-2"><?php echo ($result->ownerEmail);?></h6>
             <h6 class="mt-1 mb-2"><?php echo ($result->Role);?></h6>
        </div><br>
      </form>
      </div>
    </div>
  </div>
</div>
	<!-- //ModalProfile -->
  
   <!-- ModalSettings -->
   <div class="modal fade" id="Settings" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
  aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header text-center">
        <h4 class="modal-title w-100 font-weight-bold" style="margin-left:20px;">Account Settings</h4>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body mx-3">
      <form method="post">
        <div class="modal-header">
              <img <?php echo"<img src = '/GETPET/web/images/$result->ownerPicture'";?> alt="avatar" style="width:150px;height:150px;margin-left:125px;margin-top:-20px;" class="rounded-circle img-responsive">
        </div>
        <div style="text-align: center" class="wrap-input100 validate-input">
					    <input type="hidden" name="ownerID" value="<?php echo ( $result->ownerID);?>" required = "required" class="form-control" id="success">
				</div>
        <div style="text-align: center" class="wrap-input100 validate-input">
						<input class="input100" style="background-color:#f1f1f1;width:250px;height:40px;border:none;" type="text" name="Firstname" required="required" value="<?php echo ($result->ownerFirstname);?>" placeholder="First Name">
				</div><br>
        <div style="text-align: center" class="wrap-input100 validate-input">
						<input class="input100" style="background-color:#f1f1f1;width:250px;height:40px;border:none;" type="text" name="Lastname" required="required" value="<?php echo ($result->ownerLastname);?>" placeholder="Last Name">
						<span class="focus-input100"></span>
				</div><br>
        <div  style="text-align: center" class="wrap-input100 validate-input">
						<input class="input100" style="background-color:#f1f1f1;width:250px;height:40px;border:none;font-family:Arial;" type="text" name="ContactNo" onkeypress="isInputNumber(event)" maxlength="11" value="<?php echo ($result->ownerContactNo);?>" placeholder="Contact No.">
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
						<input class="input100" style="background-color:#f1f1f1;width:250px;height:40px;border:none;" type="text" name="Address" required="required" value="<?php echo ($result->ownerAddress);?>" placeholder="Address">
				</div><br>
        <div style="text-align: center" class="wrap-input100 validate-input" data-validate = "Valid email is required: ex@abc.xyz">
						<input class="input100" style="background-color:#f1f1f1;width:250px;height:40px;border:none;" type="text" name="Email" required="required" value="<?php echo ($result->ownerEmail);?>" placeholder="Email">
				</div><br>
        <div style="text-align: center" class="wrap-input100 validate-input" data-validate = "Valid username is required: ex@abc.xyz">
						<input class="input100" style="background-color:#f1f1f1;width:250px;height:40px;border:none;" type="text" name="Username" required="required" value="<?php echo ($result->ownerUsername);?>" placeholder="Username">
				</div><br>
        <div style="text-align: center" class="wrap-input100 validate-input" data-validate = "Valid username is required: ex@abc.xyz">
						<input class="input100" style="background-color:#f1f1f1;width:250px;height:40px;border:none;" type="Password" name="Password" required="required" value="<?php echo ($result->ownerPassword);?>" placeholder="Password">
				</div><br><br>
        <div style="text-align: center">
						<button  class="login100-form-btn" style="background-color:#00cdc1;width:250px;height:40px;border:none;" name="update" type="submit" id="insert" value="Insert">
							<a style="color:White"> Update </a>
						</button>
				</div><br>
      </form>
      </div>
    </div>
  </div>
</div>
  <!-- //ModalSettings -->

			<!-- footer content -->
			<footer>
				<div class="pull-right">
					Gentelella - Bootstrap Admin Template by <a href="https://colorlib.com">Colorlib</a>
				</div>
				<div class="clearfix"></div>
			</footer>
			<!-- /footer content -->
		</div>
	</div>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
    <script src="../vendors/validator/multifield.js"></script>
    <script src="../vendors/validator/validator.js"></script>

	<!-- Javascript functions	-->
	<script>
		function hideshow(){
			var password = document.getElementById("password1");
			var slash = document.getElementById("slash");
			var eye = document.getElementById("eye");
			
			if(password.type === 'password'){
				password.type = "text";
				slash.style.display = "block";
				eye.style.display = "none";
			}
			else{
				password.type = "password";
				slash.style.display = "none";
				eye.style.display = "block";
			}

		}
	</script>

    <script>
        // initialize a validator instance from the "FormValidator" constructor.
        // A "<form>" element is optionally passed as an argument, but is not a must
        var validator = new FormValidator({
            "events": ['blur', 'input', 'change']
        }, document.forms[0]);
        // on form "submit" event
        document.forms[0].onsubmit = function(e) {
            var submit = true,
                validatorResult = validator.checkAll(this);
            console.log(validatorResult);
            return !!validatorResult.valid;
        };
        // on form "reset" event
        document.forms[0].onreset = function(e) {
            validator.reset();
        };
        // stuff related ONLY for this demo page:
        $('.toggleValidationTooltips').change(function() {
            validator.settings.alerts = !this.checked;
            if (this.checked)
                $('form .alert').remove();
        }).prop('checked', false);

    </script>

    <!-- jQuery -->
    <script src="../vendors/jquery/dist/jquery.min.js"></script>
    <!-- Bootstrap -->
    <script src="../vendors/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
    <!-- FastClick -->
    <script src="../vendors/fastclick/lib/fastclick.js"></script>
    <!-- NProgress -->
    <script src="../vendors/nprogress/nprogress.js"></script>
    <!-- bootstrap-progressbar -->
	<script src="../vendors/bootstrap-progressbar/bootstrap-progressbar.min.js"></script>
	<!-- iCheck -->
	<script src="../vendors/iCheck/icheck.min.js"></script>
	<!-- bootstrap-daterangepicker -->
	<script src="../vendors/moment/min/moment.min.js"></script>
	<script src="../vendors/bootstrap-daterangepicker/daterangepicker.js"></script>
	<!-- bootstrap-wysiwyg -->
	<script src="../vendors/bootstrap-wysiwyg/js/bootstrap-wysiwyg.min.js"></script>
	<script src="../vendors/jquery.hotkeys/jquery.hotkeys.js"></script>
	<script src="../vendors/google-code-prettify/src/prettify.js"></script>
	<!-- jQuery Tags Input -->
	<script src="../vendors/jquery.tagsinput/src/jquery.tagsinput.js"></script>
	<!-- Switchery -->
	<script src="../vendors/switchery/dist/switchery.min.js"></script>
	<!-- Select2 -->
	<script src="../vendors/select2/dist/js/select2.full.min.js"></script>
	<!-- Parsley -->
	<script src="../vendors/parsleyjs/dist/parsley.min.js"></script>
	<!-- Autosize -->
	<script src="../vendors/autosize/dist/autosize.min.js"></script>
	<!-- jQuery autocomplete -->
	<script src="../vendors/devbridge-autocomplete/dist/jquery.autocomplete.min.js"></script>
	<!-- starrr -->
	<script src="../vendors/starrr/dist/starrr.js"></script>
	<!-- Custom Theme Scripts -->
	<script src="../build/js/custom.min.js"></script>

    <!-- bootstrap-daterangepicker -->
    <script src="../vendors/moment/min/moment.min.js"></script>
    <script src="../vendors/bootstrap-daterangepicker/daterangepicker.js"></script>
    <!-- bootstrap-datetimepicker -->    
    <script src="../vendors/bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js"></script>
    <!-- Ion.RangeSlider -->
    <script src="../vendors/ion.rangeSlider/js/ion.rangeSlider.min.js"></script>
    <!-- Bootstrap Colorpicker -->
    <script src="../vendors/mjolnic-bootstrap-colorpicker/dist/js/bootstrap-colorpicker.min.js"></script>

     <!-- Initialize datetimepicker -->
    <script  type="text/javascript">
   $(function () {
                $('#myDatepicker').datetimepicker();
            });
    
    $('#myDatepicker2').datetimepicker({
        format: 'DD.MM.YYYY'
    });
    
    $('#myDatepicker3').datetimepicker({
        format: 'hh:mm A'
    });
    
    $('#myDatepicker4').datetimepicker({
        ignoreReadonly: true,
        allowInputToggle: true
    });

    $('#datetimepicker6').datetimepicker();
    
    $('#datetimepicker7').datetimepicker({
        useCurrent: false
    });
    
    $("#datetimepicker6").on("dp.change", function(e) {
        $('#datetimepicker7').data("DateTimePicker").minDate(e.date);
    });
    
    $("#datetimepicker7").on("dp.change", function(e) {
        $('#datetimepicker6').data("DateTimePicker").maxDate(e.date);
    });
</script>

</body>
</html>
