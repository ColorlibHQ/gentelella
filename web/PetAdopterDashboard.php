<?php 
session_start();
include('C:\xampp\htdocs\GETPET\includes\config.php');
$ID=$_SESSION['ID'];
$sql = "SELECT * from pet_adopter where ID=:ID";
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
$OrganizationNameOrFirstname=($_POST['Firstname']);
$OrganizationManagerOrLastname=($_POST['Lastname']);
$AccountContactNo=($_POST['ContactNo']);
$AccountAddress=($_POST['Address']);
$AccountEmail=($_POST['Email']);
$AccountUsername=($_POST['Username']);
$AccountPassword=($_POST['Password']);

$sql="update registered set OrganizationNameOrFirstname=:Firstname,OrganizationManagerOrLastname=:Lastname,ContactNo=:ContactNo,Address=:Address,Email=:Email,Username=:Username,Password=:Password where ID=:ID";
$query=$dbh->prepare($sql);
$query->bindParam(':ID',$ID,PDO::PARAM_STR);  
$query->bindParam(':Firstname',$OrganizationNameOrFirstname,PDO::PARAM_STR);
$query->bindParam(':Lastname',$OrganizationManagerOrLastname,PDO::PARAM_STR);
$query->bindParam(':ContactNo',$AccountContactNo,PDO::PARAM_STR);
$query->bindParam(':Address',$AccountAddress,PDO::PARAM_STR);
$query->bindParam(':Email',$AccountEmail,PDO::PARAM_STR);
$query->bindParam(':Username',$AccountUsername,PDO::PARAM_STR);
$query->bindParam(':Password',$AccountPassword,PDO::PARAM_STR);
$query->execute();

$Firstname=($_POST['Firstname']);
$Lastname=($_POST['Lastname']);
$ContactNo=($_POST['ContactNo']);
$Address=($_POST['Address']);
$Email=($_POST['Email']);
$Username=($_POST['Username']);
$Password=($_POST['Password']);

$sql1="update pet_adopter set Firstname=:Firstname,Lastname=:Lastname,ContactNo=:ContactNo,Address=:Address,Email=:Email,Username=:Username,Password=:Password where ID=:ID";
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

$OrganizationNameOrFirstname=($_POST['Firstname']);
$OrganizationManagerOrLastname=($_POST['Lastname']);
$AccountContactNo=($_POST['ContactNo']);
$AccountAddress=($_POST['Address']);
$AccountEmail=($_POST['Email']);
$AccountUsername=($_POST['Username']);
$AccountPassword=($_POST['Password']);

$sql3="update login set OrganizationNameOrFirstname=:Firstname,OrganizationManagerOrLastname=:Lastname,ContactNo=:ContactNo,Address=:Address,Email=:Email,Username=:Username,Password=:Password where ID=:ID";
$query3=$dbh->prepare($sql3); 
$query3->bindParam(':ID',$ID,PDO::PARAM_STR);
$query3->bindParam(':Firstname',$OrganizationNameOrFirstname,PDO::PARAM_STR);
$query3->bindParam(':Lastname',$OrganizationManagerOrLastname,PDO::PARAM_STR);
$query3->bindParam(':ContactNo',$AccountContactNo,PDO::PARAM_STR);
$query3->bindParam(':Address',$AccountAddress,PDO::PARAM_STR);
$query3->bindParam(':Email',$AccountEmail,PDO::PARAM_STR);
$query3->bindParam(':Username',$AccountUsername,PDO::PARAM_STR);
$query3->bindParam(':Password',$AccountPassword,PDO::PARAM_STR);
$query3->execute();
{
echo '<script>alert("Your Account Updated Successfully!!!")</script>';
$ID=$_SESSION['ID'];
$sql = "SELECT * from pet_adopter where ID=:ID";
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
<html lang="zxx">

<head>
	
	<title>GetPet</title>
	<!-- Meta tag Keywords -->
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta charset="UTF-8" />
	<meta name="keywords" content="Cat Life web template, Bootstrap Web Templates, Flat Web Templates, Android Compatible web template, Smartphone Compatible web template, free webdesigns for Nokia, Samsung, LG, SonyEricsson, Motorola web design"
	/>
	<script>
		addEventListener("load", function () {
			setTimeout(hideURLbar, 0);
		}, false);

		function hideURLbar() {
			window.scrollTo(0, 1);
		}
	</script>
	<!--// Meta tag Keywords -->
	
	<!-- css files -->
	<link rel="stylesheet" href="css/bootstrap.css" type="text/css" media="all">
	<!-- Bootstrap-Core-CSS -->
	<link rel="stylesheet" href="css/font-awesome.css" type="text/css" media="all">
	<!-- Font-Awesome-Icons-CSS -->
	<link rel="stylesheet" href="css/owl.carousel.css" type="text/css" media="all" />
	<!-- Owl-Carousel-CSS -->
	<link rel="stylesheet" href="css/style.css" type="text/css" media="all" />
	<!-- Style-CSS -->
	
	<!-- //css files -->
	<!-- web fonts -->
	<link href="//fonts.googleapis.com/css?family=Molle:400i&amp;subset=latin-ext" rel="stylesheet">
	<link href="//fonts.googleapis.com/css?family=Lato:100,100i,300,300i,400,400i,700,700i,900,900i&amp;subset=latin-ext" rel="stylesheet">
	<link href="//fonts.googleapis.com/css?family=Raleway:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i&amp;subset=latin-ext"
	    rel="stylesheet">
	<!-- //web fonts -->
</head>

<body>
	<div class="w3l-main" id="home">
		<div class="container">
			<!-- header -->
			<div class="header">
				<div class="logo" style="width:200px;height:200px;">
					<h1>
						<a href="http://localhost/GETPET/web/PetAdopterDashboard.php">
							<img class="logo-img center-block" src="images/Logo/Logo.png" alt="" style="width:250px;height:250px;margin-left: -60px;margin-top: -50px;" />
						</a>
					</h1>
				</div>

				<div class="clearfix"> </div>
			</div>
			
			<!-- //header -->
		</div>
		<!-- Slider -->
		<div class="slider">
			<div class="callbacks_container">
				<ul class="rslides" id="slider">
					<li>
						<div class="slider-img-w3layouts one">
							<div class="w3l-overlay">
								<div class="container">
									<div class="banner-text-info">
										<h3>we provide
											<span>care</span> that your
											<span>pet</span> deserves!</h3>
										<p>A comprehensive guide to dog & cat care to make your pet feel your love</p>
									</div>
								</div>
							</div>
						</div>
					</li>
					<li>
						<div class="slider-img-w3layouts two">
							<div class="w3l-overlay">
								<div class="container">
									<div class="banner-text-info">
										<h3>you can show your
											<span>love</span> to your
											<span>pet</span>!</h3>
											<p>A comprehensive guide to dog & cat care to make your pet feel your love</p>
									</div>
								</div>
							</div>
						</div>
					</li>
					<li>
						<div class="slider-img-w3layouts three">
							<div class="w3l-overlay">
								<div class="container">
									<div class="banner-text-info">
										<h3>we provide
											<span>care</span> that your
											<span>pet</span> deserves!</h3>
											<p>A comprehensive guide to dog & cat care to make your pet feel your love</p>
									</div>
								</div>
							</div>
						</div>
					</li>
					<li>
						<div class="slider-img-w3layouts four">
							<div class="w3l-overlay">
								<div class="container">
									<div class="banner-text-info">
										<h3>you can show your
											<span>love</span> to your
											<span>pet</span>!</h3>
											<p>A comprehensive guide to dog & cat care to make your pet feel your love</p>
									</div>
								</div>
							</div>
						</div>
					</li>
				</ul>
			</div>
			<div class="clearfix"></div>
		</div>
		<!--//Slider-->
	</div>
	<!--//banner-->

	<!-- sticky navigation -->
	<div class="nav-links">
		<nav class='navbar navbar-default'>
			<div class='container'>
				<div class='navbar-header'>
					<button type='button' class='navbar-toggle' data-toggle='collapse' data-target='.navbar-collapse'>
						<span class='sr-only'>Toggle Navigation</span>
						<span class='icon-bar'></span>
						<span class='icon-bar'></span>
						<span class='icon-bar'></span>
					</button>
				</div>
				<div class='collapse navbar-collapse'>
					<ul>
						<li style = "width:150px;">
						<a href="#home" class="scroll">Home</a>
						</li>
						<!--<li style = "width:150px;">
							<a href="#services" class="scroll">Dashboard</a>
						</li>-->
						<li style = "width:150px;">
							<a href="http://localhost/GETPET/web/PAAboutUs.php">About Us</a>
						</li>
						<li style = "width:150px;">
							<a href="#team" class="scroll">Notification</a>
						</li>
						<!--<li style = "width:150px;">
							<a href="#contact" class="scroll">Contact Us</a>
						</li>-->
						<li class="nav-item" style = "width:150px; margin-left:450px"><a class="nav-link" href="#" data-toggle="dropdown">Acount</a>	
							<div class="dropdown-menu dropdown-menu-right" style="margin-right: 390px;width:200px;">
							  <img src="images/default_profile.png" alt="" style="width:80px;height:80px;margin-left: 60px;margin-top: 20px;border-radius: 50%;" />
							  <div class="dropdown-divider"></div>
							  <a class="dropdown-item" href="" data-toggle="modal" data-target="#Profile" style="color:black;"><div style="text-align: center"><t><?php echo ($result->Firstname);?> <?php echo ($result->Lastname);?></div></t></a>
							  <div style="text-align: center; margin-top:-30px;"><t ><?php echo ($result->Role);?></t></div>
							  <div class="dropdown-divider"></div>
							<a class="dropdown-item" href="" data-toggle="modal" data-target="#Profile" style="color:black;"><t style="margin-left: 10px;">Profile</t></a>
							  <div class="dropdown-divider"></div>
							  <a class="dropdown-item" href="" data-toggle="modal" data-target="#Settings" style="color:black;"><t style="margin-left: 10px;">Settings</t></a>
							  <div class="dropdown-divider"></div>
							  <a class="dropdown-item" href="http://localhost/GETPET/login-page/login.php" style="color:black;"><t style="margin-left: 10px;">Log out</t></a>
						</div></li>
                    </ul>
				</div>
			</div>
		</nav>
	</div>
	<!-- //sticky navigation -->

	<!-- welcome 
	
	-->
	
	<!-- Login -->
	
	<!-- //Login -->

	<!-- Signup -->
	
	<!-- //Signup -->

	<!-- middle slider 
	
	 -->

	<!-- services -->
	<div class="services" id="services">
		<div class="container">
			<h3 class="agile-title">Dashboard</h3>
			<div class="w3_agile_services_grids">
				<div class="col-md-4 col-sm-4 col-xs-4 w3_agile_services_grid " data-aos="zoom-in">
					<div class="ih-item circle effect1 agile_services_grid">
						<div class="spinner"></div>
						<div class="img">
							<img src="images/b1.jpg" alt=" " class="img-responsive" />
						</div>
					</div>
					<fieldset>
						<legend>Tips & Advice</legend>
						<div class="button-styles">
						<a href="#contact" class="button2-w3l scroll">More info</a>
						</div>
					</fieldset>
				</div>
				<div class="col-md-4 col-sm-4 col-xs-4 w3_agile_services_grid" data-aos="zoom-in">
					<div class="ih-item circle effect1 agile_services_grid">
						<div class="spinner"></div>
						<div class="img">
							<img src="images/c2.jpg" alt=" " class="img-responsive" />
						</div>
					</div>
					<fieldset>
						<legend>Articles</legend>
						<div class="button-styles">
						<a href="#contact" class="button2-w3l scroll">More info</a>
						</div>
					</fieldset>
				</div>
				<div class="col-md-4 col-sm-4 col-xs-4 w3_agile_services_grid" data-aos="zoom-in">
					<div class="ih-item circle effect1 agile_services_grid">
						<div class="spinner"></div>
						<div class="img">
							<img src="images/b3.jpg" alt=" " class="img-responsive" />
						</div>
					</div>
					<fieldset>
						<legend>Short-Term Care</legend>
						<div class="button-styles">
						<a href="#contact" class="button2-w3l scroll">More info</a>
						</div>
					</fieldset>
				</div>
				<div class="clearfix"> </div>
			</div>
			<div class="w3_agile_services_grids">
				<div class="col-md-4 col-sm-4 col-xs-4 w3_agile_services_grid " data-aos="zoom-in">
					<div class="ih-item circle effect1 agile_services_grid">
						<div class="spinner"></div>
						<div class="img">
							<img src="images/c4.jpg" alt=" " class="img-responsive" />
						</div>
					</div>
					<fieldset>
						<legend>Pets for Adoption</legend>
						<div class="button-styles">
						<a href="#contact" class="button2-w3l scroll">More info</a>
						</div>
					</fieldset>
				</div>
				<div class="col-md-4 col-sm-4 col-xs-4 w3_agile_services_grid" data-aos="zoom-in">
					<div class="ih-item circle effect1 agile_services_grid">
						<div class="spinner"></div>
						<div class="img">
							<img src="images/b5.jpg" alt=" " class="img-responsive" />
						</div>
					</div>
					<fieldset>
						<legend>Donation</legend>
						<div class="button-styles">
						<a href="#contact" class="button2-w3l scroll">More info</a>
						</div>
					</fieldset>
				</div>
				<div class="col-md-4 col-sm-4 col-xs-4 w3_agile_services_grid" data-aos="zoom-in">
					<div class="ih-item circle effect1 agile_services_grid">
						<div class="spinner"></div>
						<div class="img">
							<img src="images/b5.jpg" alt=" " class="img-responsive" />
						</div>
					</div>
					<fieldset>
						<legend>Fund-raising</legend>
						<div class="button-styles">
						<a href="#contact" class="button2-w3l scroll">More info</a>
						</div>
					</fieldset>
				</div>
				
		</div>
		<!--<div class="w3l-img-side">
			<img src="images/cat11.png" alt="" />
		</div>
		<div class="w3l-img-side w3l-img-side2">
			<img src="images/dog1.jpg" alt="" />
		</div>-->
	<!-- //services -->

	<!-- blog -->
	
	<!-- Modal5 -->
	<div class="modal fade" id="myModal2" tabindex="-1" role="dialog">
		<div class="modal-dialog">
			<!-- Modal content-->
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal">&times;</button>
					<div class="modal-info">
						<h4>Dog & Cat Life</h4>
						<img src="images/dc.jpg" alt=" " class="img-responsive" />
						<h5>What are the benefits of pet adoption?</h5>
						<p class="para-agileits-w3layouts">Adopting a pet comes with numerous advantages including:

							<p>1. You’re saving a life. Millions of healthy, adoptable pets are euthanized every year simply for a lack of a home. When you adopt your pet from a shelter or rescue group, you’re giving a deserving pet a loving home.</p>
							<p>2. Many adoptable pets are already trained.</p>
							<p>3. When you adopt an older pet, you will often get a sense of their personality and temperament. You also already know their full grown size!</p>
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- //Modal5 -->

	<!-- ModalProfile -->
	<div class="modal fade" id="Profile" tabindex="-1" role="dialog">
		<div class="modal-dialog">
			<!-- Modal content-->
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal">&times;</button>
					<div class="modal-info">
						<h1 style="text-align: center">Profile</h1 >
						<img src="images/default_profile.png" alt="" class="img-responsive" style="width:150px;height:150px;margin-left:190px;margin-top: 20px;border-radius: 50%;" /><br>
						<h3 style="margin-left: 10px;">Full Name:&nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp<?php echo ($result->Firstname);?>&nbsp<?php echo ($result->Lastname);?></h3><br>
						<h3 style="margin-left: 10px;">Contact No:&nbsp &nbsp &nbsp &nbsp &nbsp &nbsp <?php echo ($result->ContactNo);?></h3><br>
						<h3 style="margin-left: 10px;">Address:&nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp<?php echo ($result->Address);?></h3><br>
						<h3 style="margin-left: 10px;">Email:&nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp<?php echo ($result->Email);?></h3><br>
						<h3 style="margin-left: 10px;">Username:&nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp&nbsp<?php echo ($result->Username);?></h3><br>
						<h3 style="margin-left: 10px;">Role:&nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp<?php echo ($result->Role);?></h3><br>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- //ModalProfile -->

	<!-- ModalSettings -->
	<div class="modal fade" id="Settings" tabindex="-1" role="dialog">
		<div class="modal-dialog">
			<!-- Modal content-->
			<div class="modal-content">
				<div class="modal-header">
				<form method="post">
					<button type="button" class="close" data-dismiss="modal">&times;</button>
					<div class="modal-info">
						<h1 style="text-align: center">Account Settings</h1>
						<img src="images/default_profile.png" alt="" class="img-responsive" style="width:150px;height:150px;margin-left:190px;margin-top: 20px;border-radius: 50%;" /><br>
					</div><br>
					<div style="text-align: center" class="wrap-input100 validate-input">
					<a style="text-align: center; color: black;">Upload Profile</a>
	                </div><br>
                    <div style="text-align: center" class="wrap-input100 validate-input">
                        <input type="file" name="Picture" id="Logo" style="width:250px;height:40px;border:none;margin-left:160px;" placeholder="Upload Logo">
					</div><br>
					<div style="text-align: center" class="wrap-input100 validate-input">
					    <input type="hidden" name="ID" value="<?php echo ( $result->ID);?>" required = "required" class="form-control" id="success">
					</div><br>
					<div style="text-align: center" class="wrap-input100 validate-input">
						<input class="input100" style="background-color:#f1f1f1;width:250px;height:40px;border:none;" type="text" name="Firstname" required="required" value="<?php echo ($result->Firstname);?>" placeholder="Organization Name">
					</div><br>
					<div style="text-align: center" class="wrap-input100 validate-input">
						<input class="input100" style="background-color:#f1f1f1;width:250px;height:40px;border:none;" type="text" name="Lastname" required="required" value="<?php echo ($result->Lastname);?>" placeholder="Organization Manager">
						<span class="focus-input100"></span>
					</div><br>
					<div  style="text-align: center" class="wrap-input100 validate-input">
						<input class="input100" style="background-color:#f1f1f1;width:250px;height:40px;border:none;font-family:Arial;" type="text" name="ContactNo" onkeypress="isInputNumber(event)" maxlength="11" value="<?php echo ($result->ContactNo);?>" placeholder="Contact No.">
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
						<input class="input100" style="background-color:#f1f1f1;width:250px;height:40px;border:none;" type="text" name="Address" required="required" value="<?php echo ($result->Address);?>" placeholder="Address">
					</div><br>
					<div style="text-align: center" class="wrap-input100 validate-input" data-validate = "Valid email is required: ex@abc.xyz">
						<input class="input100" style="background-color:#f1f1f1;width:250px;height:40px;border:none;" type="text" name="Email" required="required" value="<?php echo ($result->Email);?>" placeholder="Email">
					</div><br>
					  <div style="text-align: center" class="wrap-input100 validate-input" data-validate = "Valid username is required: ex@abc.xyz">
						<input class="input100" style="background-color:#f1f1f1;width:250px;height:40px;border:none;" type="text" name="Username" required="required" value="<?php echo ($result->Username);?>" placeholder="Username">
					</div><br>
					<div style="text-align: center" class="wrap-input100 validate-input" data-validate = "Valid username is required: ex@abc.xyz">
						<input class="input100" style="background-color:#f1f1f1;width:250px;height:40px;border:none;" type="Password" name="Password" required="required" value="<?php echo ($result->Password);?>" placeholder="Password">
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
		</div>
	</div>
	<!-- //ModalProfile -->

	

	<!-- //blog -->

	<!-- team 
	
	team -->

	<!-- 
	
	 -->

	<!-- contact 
	
	 -->
	<!-- //contact -->

	<!-- footer 
	
	-->
	
	<!-- copyright -->
	<div class="w3layouts_copy_right">
		<div class="container">
			<p>© 2021 GetPet. All rights reserved | Design by
				<a href="http://w3layouts.com">Team K.W .</a>
			</p>
		</div>
	</div>
	<!-- //copyright -->
	


	<!-- js -->
	<script src="js/jquery-2.2.3.min.js"></script>
	<script src="js/bootstrap.js"></script>
	<!-- Necessary-JavaScript-File-For-Bootstrap -->
	<!-- //js -->

	<!-- Banner Slider -->
	<script src="js/responsiveslides.min.js"></script>
	<script>
		$(function () {
			$("#slider").responsiveSlides({
				auto: true,
				pager: true,
				nav: true,
				speed: 1000,
				namespace: "callbacks",
				before: function () {
					$('.events').append("<li>before event fired.</li>");
				},
				after: function () {
					$('.events').append("<li>after event fired.</li>");
				}
			});
		});
	</script>
	<!-- //Banner Slider -->

	<!-- Sticky Navigation Script -->
	<script>
		$(window).scroll(function () {
			if ($(window).scrollTop() >= 795) {
				$('nav').addClass('fixed-header');
			} else {
				$('nav').removeClass('fixed-header');
			}
		});

		/* scrollTop() >= 795
		   Should be equal the the height of the header
		 */
	</script>
	<!-- //Sticky Navigation Script -->

	<!-- simple-lightbox -->
	<script src="js/simple-lightbox.min.js"></script>
	<script>
		$(function () {
			var gallery = $('.agileinfo-gallery-row a').simpleLightbox({
				navText: ['&lsaquo;', '&rsaquo;']
			});
		});
	</script>
	<link href='css/simplelightbox.min.css' rel='stylesheet' type='text/css'>
	<!-- Light-box css -->
	<!-- //simple-lightbox -->

	<!-- smoothscroll -->
	<script src="js/SmoothScroll.min.js"></script>
	<!-- //smoothscroll -->

	<!-- start-smooth-scrolling -->
	<script src="js/move-top.js"></script>
	<script src="js/easing.js"></script>
	<script>
		jQuery(document).ready(function ($) {
			$(".scroll").click(function (event) {
				event.preventDefault();

				$('html,body').animate({
					scrollTop: $(this.hash).offset().top
				}, 1000);
			});
		});
	</script>
	<!-- //end-smooth-scrolling -->

	<!-- smooth-scrolling-of-move-up -->
	<script>
		$(document).ready(function () {
			/*
			var defaults = {
				containerID: 'toTop', // fading element id
				containerHoverID: 'toTopHover', // fading element hover id
				scrollSpeed: 1200,
				easingType: 'linear' 
			};
			*/
			$().UItoTop({
				easingType: 'easeOutQuart'
			});

		});
	</script>
	<!-- //smooth-scrolling-of-move-up -->

	<!-- Owl-Carousel-JavaScript -->
	<script src="js/owl.carousel.js"></script>
	<script>
		$(document).ready(function () {
			$("#owl-demo").owlCarousel({
				items: 3,
				lazyLoad: true,
				autoPlay: true,
				pagination: true,
			});
		});
	</script>
	<!-- //Owl-Carousel-JavaScript -->
	
</body>

</html>