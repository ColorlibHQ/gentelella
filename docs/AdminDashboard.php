<?php 
session_start();
include('C:\xampp\htdocs\developgetpet\includes\config.php');
$query=$dbh->prepare("SELECT COUNT(ownerID) FROM petowner");
$query->execute();

$pet_owner=$query->fetchColumn();

?>

<?php
$query=$dbh->prepare("SELECT COUNT(adopterID) FROM petadopter");
$query->execute();

$pet_adopter=$query->fetchColumn();

?>

<?php
$query=$dbh->prepare("SELECT COUNT(orgID) FROM animalwelfareorganization");
$query->execute();

$animal_welfare_organization=$query->fetchColumn();

?>

<?php
$query=$dbh->prepare("SELECT COUNT(*) FROM register ");
$query->execute();

$Registered=$query->fetchColumn();

?>

<?php
$query=$dbh->prepare("SELECT COUNT(*) FROM login WHERE (loginDate) = (CURDATE())");
$query->execute();

$Date=$query->fetchColumn();

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
		</div>
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
                        <li>
							<a href="http://localhost/developgetpet/web/AdminDashboard.php">Home</a>
						</li>
						<!--<li style = "width:160px;">
							<a href="#activity" class="scroll">Activity Log</a>
						</li>-->
						<li style = "width:160px; margin-left:-15px;">
							<a href="#activity" class="scroll">Request</a>
						</li>
						<li style = "width:160px; margin-left:-15px;">
							<a href="" class="scroll">Report</a>
						</li>						
						<li style = "width:160px; margin-left:-15px;">
							<a href="" class="scroll">Notification</a>
						</li>
						<li class="nav-item" style = "width:90px; margin-left:120px"><a class="nav-link" href="#" data-toggle="dropdown">Acount</a>
							<div class="dropdown-menu dropdown-menu-right" style="margin-right: 35px;width:200px;">
							  <img src="images/default_profile.png" alt="" style="width:80px;height:80px;margin-left: 60px;margin-top: 20px;border-radius: 50%;" />
							  <div class="dropdown-divider"></div>
							  <a class="dropdown-item" href="" data-toggle="modal" data-target="#Profile" style="color:black;"><div style="text-align: center"><t>Admin</div></t></a>
							  <div class="dropdown-divider"></div>
							  <a style="color:black;"><t style="margin-left: 10px;">Profile</t></a>
							  <div class="dropdown-divider"></div>
							  <a class="dropdown-item" style="color:black;"><t style="margin-left: 10px;">Settings</t></a>
							  <div class="dropdown-divider"></div>
							  <a class="dropdown-item" href="http://localhost/developgetpet/login-page/login.php" style="color:black;"><t style="margin-left: 10px;">Log out</t></a>
						</div></li>
                    </ul>
				</div>
			</div>
		</nav> 
	</div>
	<!-- //sticky navigation -->

	<!-- UserActivityLog -->
	<!-- Total -->
	<div class="services" id="activity">
	<form class="login100-form validate-form" method="post">
		<div class="container">
		<h3 class="agile-title">Dashboard</h3>
			<div class="w3_agile_services_grids">
				<div class="col-md-4 col-sm-4 col-xs-4 w3_agile_services_grid " data-aos="zoom-in">
					<div class="ih-item circle effect1 agile_services_grid">
						<div class="spinner"></div>
						<div class="img">
							<img src="images/pet_owner_or_rescuer.jpg" alt=" " class="img-responsive" />
						</div>
					</div>
					<br>
					<legend style="font-size: 20px">Total Pet Owner</legend>
					<fieldset>
						<legend><?php echo $pet_owner; ?></legend>
						<button type="button" name="PetOwner" style="background-color:#00cdc1;border-radius:2px;color:white;width:100px;height:35px;border:none;"><a href="http://localhost/developgetpet/web/PetOwner.php" style="color:white;">View</a></button>
					</fieldset>
				</div>
				<div class="col-md-4 col-sm-4 col-xs-4 w3_agile_services_grid " data-aos="zoom-in">
					<div class="ih-item circle effect1 agile_services_grid">
						<div class="spinner"></div>
						<div class="img">
							<img src="images/adopter.jpg" alt=" " class="img-responsive" />
						</div>
					</div>
					<br>
					<legend style="font-size: 20px">Total Pet Adopter</legend>
					<fieldset>
						<legend><?php echo $pet_adopter; ?></legend>
						<button type="button" style="background-color:#00cdc1;border-radius:2px;color:white;width:100px;height:35px;border:none;"><a href="http://localhost/developgetpet/web/PetAdopter.php" style="color:white;">View</a></button>
					</fieldset>
				</div>
				<div class="col-md-4 col-sm-4 col-xs-4 w3_agile_services_grid" data-aos="zoom-in">
					<div class="ih-item circle effect1 agile_services_grid">
						<div class="spinner"></div>
						<div class="img">
							<img src="images/b1.jpg" alt=" " class="img-responsive" />
						</div>
					</div>
					<br>
					<legend style="font-size: 20px">Total Animal Welfare Organization</legend>
					<fieldset>
						<legend><?php echo $animal_welfare_organization;?></legend>
						<button type="button" style="background-color:#00cdc1;border-radius:2px;color:white;width:100px;height:35px;border:none;"><a href="http://localhost/developgetpet/web/AnimalWelfareOrganization.php" style="color:white;">View</a></button>
					</fieldset>
				</div>
				<div class="col-md-4 col-sm-4 col-xs-4 w3_agile_services_grid" data-aos="zoom-in">
				<br><br>
					<div class="ih-item circle effect1 agile_services_grid">
						<div class="spinner"></div>
						<div class="img">
							<img src="images/registered.jpg" alt=" " class="img-responsive" />
						</div>
					</div>
					<br>
					<legend style="font-size: 20px">Total Registered</legend>
					<fieldset>
					     <legend><legend><?php echo $Registered;?></legend></legend>
						 <button type="button" style="background-color:#00cdc1;border-radius:2px;color:white;width:100px;height:35px;border:none;"><a href="http://localhost/developgetpet/web/TotalRegistered.php" style="color:white;">View</a></button>
					</fieldset>
				</div>
				<div class="col-md-4 col-sm-4 col-xs-4 w3_agile_services_grid" data-aos="zoom-in">
				<br><br>
					<div class="ih-item circle effect1 agile_services_grid">
						<div class="spinner"></div>
						<div class="img">
							<img src="images/login.jpg" alt=" " class="img-responsive" />
						</div>
					</div>
					<br>
					<legend style="font-size: 20px">Total User Log Today</legend>
					<fieldset>
					     <legend><legend><?php echo $Date;?></legend></legend>
						 <button type="button" style="background-color:#00cdc1;border-radius:2px;color:white;width:100px;height:35px;border:none;"><a href="http://localhost/developgetpet/web/UserLogToday.php" style="color:white;">View</a></button>
					</fieldset>
				</div>
				<div class="clearfix"> </div>
			</div>
		</div>
		</form>
	</div><br><br><br><br><br>
	<!-- //UserActivityLog -->
	<!-- //Total -->
	
	<!-- footer 
	<section class="footer-w3">
		<div class="container">
			<div class="col-lg-4 col-md-4 col-sm-4 footer-agile1" data-aos="zoom-in">
				<h3>ADOPTING MEANS YOU SAVE A LIFE!</h3>
				<p class="footer-p1">Too often, shelters euthanize animals due to room constraints, but if more people adopted pets instead of buying them, the number of pets euthanized would lower dramatically.
						When you adopt, not only do you save your loving new companion, but you make space for other animals who desperately need it, creating a domino effect of goodness.
				</p>
			</div>
			<div class="col-lg-4 col-md-4 col-sm-4 footer-mid-w3" data-aos="zoom-in">
				<h3>Instagram Posts</h3>
				<div class="agileinfo_footer_grid1">
					<a href="#">
						<img src="images/dogs1.jpg" alt=" " class="img-responsive">
					</a>
				</div>
				<div class="agileinfo_footer_grid1">
					<a href="#">
						<img src="images/f2.jpg" alt=" " class="img-responsive">
					</a>
				</div>
				<div class="agileinfo_footer_grid1">
					<a href="#">
						<img src="images/dogs3.jpg" alt=" " class="img-responsive">
					</a>
				</div>
				<div class="agileinfo_footer_grid1">
					<a href="#">
						<img src="images/f4.jpg" alt=" " class="img-responsive">
					</a>
				</div>
				<div class="agileinfo_footer_grid1">
					<a href="#">
						<img src="images/dogs5.jpg" alt=" " class="img-responsive">
					</a>
				</div>
				<div class="agileinfo_footer_grid1">
					<a href="#">
						<img src="images/f6.jpg" alt=" " class="img-responsive">
					</a>
				</div>
				<div class="clearfix"> </div>
			</div>
			<div class="col-lg-4 col-md-4 col-sm-4 footer-agile1" data-aos="zoom-in">
				<h3>Follow us also in Twitter</h3>
				<ul class="tweet-agile">
					<li>
						<i class="fa fa-twitter-square" aria-hidden="true"></i>
						<p class="tweet-p1">
							<a href="mailto:support@company.com">GetPet@twitter.com</a> ADOPTING IS MORE AFFORDABLE.
							<a href="#">http://ax.by/zzzz</a>
						</p>
						<p class="tweet-p2">Posted 3 days ago.</p>
					</li>
					<li>
						<i class="fa fa-twitter-square" aria-hidden="true"></i>
						<p class="tweet-p1">
							<a href="mailto:support@company.com">WeAreGetPet@twitter.com</a> YOU GET A SUPPORT SYSTEM.
							<a href="#">http://ax.by/zzzz</a>
						</p>
						<p class="tweet-p2">Posted 3 days ago.</p>
					</li>
				</ul>
			</div>
			<div class="clearfix"></div>
		</div>
	</section>
	-->
	<br>
	<br>
	<br>
	
	<!-- copyright -->
	<div class="w3layouts_copy_right">
		<div class="container">
			<p>© 2021 GetPet. All rights reserved | Design by
				<a href="">Team K.W .</a>
			</p>
		</div>
	</div>
	<!-- //copyright -->
	<!-- //footer 
	


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