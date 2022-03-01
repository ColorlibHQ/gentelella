<?php 
session_start();
include('C:\xampp\htdocs\developgetpet\includes\config.php');
if(isset($_POST['login']))
{
	$Username=$_POST['Username'];
    $Password=$_POST['Password'];

    $sql = "SELECT * FROM admin WHERE Username = :Username AND Password =:Password";
    $query = $dbh->prepare($sql);
    $query->bindParam(':Username', $Username,PDO::PARAM_STR);
    $query->bindParam(':Password', $Password,PDO::PARAM_STR);
    $query->execute();
    $results=$query->fetch(PDO::FETCH_ASSOC);
    

    if($query->rowCount()>0)
    {

        session_regenerate_id();
		    $_SESSION['ID'] = $results['ID'];
       
        echo '<script>alert("Login Successfully!")</script>';
        echo "<script type ='text/javascript'> document.location='http://localhost/GETPET/web/AdminDashboard.php'</script>";


    }

    $sql1 = "SELECT * FROM pet_owner WHERE Username = :Username AND Password =:Password";
    $query1 = $dbh->prepare($sql1);
    $query1->bindParam(':Username', $Username,PDO::PARAM_STR);
    $query1->bindParam(':Password', $Password,PDO::PARAM_STR);
    $query1->execute();
    $results1=$query1->fetch(PDO::FETCH_ASSOC);
    

    if($query1->rowCount()>0)
    {

        session_regenerate_id();
		    $_SESSION['ID'] = $results1['ID'];
        $_SESSION['Firstname'] = $results1['Firstname'];
        $_SESSION['Lastname'] = $results1['Lastname'];

        $ID=$_SESSION['ID'];

        $Date=($_POST['Date']);

        $sql="update login set Date=:Date where ID=$ID";
        $query=$dbh->prepare($sql); 
        $query->bindParam(':Date',$Date,PDO::PARAM_STR);
        $query->execute();

        echo '<script>alert("Login Successfully!")</script>';
        echo "<script type ='text/javascript'> document.location='http://localhost/GETPET/web/PetOwnerDashboard.php'</script>";
        echo $_SESSION['ID'];
        echo $_SESSION['Firstname'];
        echo $_SESSION['Lastname'];

    }

    $sql2 = "SELECT * FROM pet_adopter WHERE Username = :Username AND Password =:Password";
    $query2 = $dbh->prepare($sql2);
    $query2->bindParam(':Username', $Username,PDO::PARAM_STR);
    $query2->bindParam(':Password', $Password,PDO::PARAM_STR);
    $query2->execute();
    $results2=$query2->fetch(PDO::FETCH_ASSOC);
    

    if($query2->rowCount()>0)
    {

        session_regenerate_id();
		    $_SESSION['ID'] = $results2['ID'];
        $_SESSION['Firstname'] = $results2['Firstname'];
        $_SESSION['Lastname'] = $results2['Lastname'];

        $ID=$_SESSION['ID'];

        $Date=($_POST['Date']);

        $sql="update login set Date=:Date where ID=$ID";
        $query=$dbh->prepare($sql); 
        $query->bindParam(':Date',$Date,PDO::PARAM_STR);
        $query->execute();

        echo '<script>alert("Login Successfully!")</script>';
        echo "<script type ='text/javascript'> document.location='http://localhost/developgetpet/dashboard/PetAdopterDashboard.php'</script>";
        echo $_SESSION['ID'];
        echo $_SESSION['Firstname'];
        echo $_SESSION['Lastname'];

    }

    $sql3 = "SELECT * FROM animal_welfare_agency WHERE Username = :Username AND Password =:Password";
    $query3 = $dbh->prepare($sql3);
    $query3->bindParam(':Username', $Username,PDO::PARAM_STR);
    $query3->bindParam(':Password', $Password,PDO::PARAM_STR);
    $query3->execute();
    $results3=$query3->fetch(PDO::FETCH_ASSOC);
    

    if($query3->rowCount()>0)
    {

        session_regenerate_id();
		    $_SESSION['ID'] = $results3['ID'];
        $_SESSION['OrganizationName'] = $results3['OrganizationName'];
        $_SESSION['OrganizationManager'] = $results3['OrganizationManager'];

        $ID=$_SESSION['ID'];

        $Date=($_POST['Date']);

        $sql="update login set Date=:Date where ID=$ID";
        $query=$dbh->prepare($sql); 
        $query->bindParam(':Date',$Date,PDO::PARAM_STR);
        $query->execute();

        echo '<script>alert("Login Successfully!")</script>';
        echo "<script type ='text/javascript'> document.location='http://localhost/GETPET/web/AnimalWelfareAgencyDashboard.php'</script>";
        echo $_SESSION['ID'];
        echo $_SESSION['OrganizationName'];
        echo $_SESSION['OrganizationManager'];

    }
    
    else 
    echo '<script>alert("Invalid Account!")</script>';
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

    <title>GetPet</title>

    <!-- Bootstrap -->
    <link href="../vendors/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="../vendors/font-awesome/css/font-awesome.min.css" rel="stylesheet">
    <!-- NProgress -->
    <link href="../vendors/nprogress/nprogress.css" rel="stylesheet">
    <!-- Animate.css -->
    <link href="../vendors/animate.css/animate.min.css" rel="stylesheet">

    <!-- Custom Theme Style -->
    <link href="../build/css/custom.min.css" rel="stylesheet">
  </head>

  <body class="login">
    <div>
      <a class="hiddenanchor" id="signup"></a>
      <a class="hiddenanchor" id="signin"></a>

      <div class="login_wrapper">
        <div class="animate form login_form">
          <section class="login_content">
            <form>
              <h1>Login Form</h1>
              <div>
                <input type="text" name="Username" class="form-control" placeholder="Username" id="Username" required="required">
              </div>
              <div>
                <input type="password" name="Password" class="form-control" placeholder="Password" id="Password" required="required">
              </div>
              <div>
                <a class="btn btn-default submit" name="login" id="login" href="index.html">Log in</a>
                <a class="reset_pass" href="#">Lost your password?</a>
              </div>

              <div class="clearfix"></div>

              <div class="separator">
                <p class="change_link">New to site?
                  <a href="#signup" class="to_register"> Create Account </a>
                </p>

                <div class="clearfix"></div>
                <br />

                <div>
                  <h1><i class="fa fa-paw"></i> GETPET!</h1>
                  <p>©2022 All Rights Reserved. GETPET!</p>
                </div>
              </div>
            </form>
          </section>
        </div>

        <div id="register" class="animate form registration_form">
          <section class="login_content">
            <form>
              <h1>Create Account</h1>
              <div>
                <input type="text" class="form-control" placeholder="Username" required="" />
              </div>
              <div>
                <input type="email" class="form-control" placeholder="Email" required="" />
              </div>
              <div>
                <input type="password" class="form-control" placeholder="Password" required="" />
              </div>
              <div>
                <a class="btn btn-default submit" href="index.html">Submit</a>
              </div>

              <div class="clearfix"></div>

              <div class="separator">
                <p class="change_link">Already a member ?
                  <a href="#signin" class="to_register"> Log in </a>
                </p>

                <div class="clearfix"></div>
                <br />

                <div>
                  <h1><i class="fa fa-paw"></i> Gentelella Alela!</h1>
                  <p>©2016 All Rights Reserved. Gentelella Alela! is a Bootstrap 3 template. Privacy and Terms</p>
                </div>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  </body>
</html>
