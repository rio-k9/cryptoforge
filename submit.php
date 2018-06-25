<?php
    $msg = '';
    $msgClass= '';
    if(filter_has_var(INPUT_POST, 'submit')){
        if(empty($_POST["name"]) || empty($_POST["email"]) || empty($_POST["message"])){
                $name = htmlspecialchars($_POST['name']);
                $email = htmlspecialchars($_POST['email']);
                $message = htmlspecialchars($_POST['message']);
                $toEmail = 'rkarim@websoar.co.uk';
                $subject = 'WebSoar Message - ' .$name;
                $body = '
                 <h3> You have a CryptoForge Msg </h3>
                <h4>Contact Details</h4>
                <ul>
                    <li>First name:' .$name .'</li>
                    <li>Email:' .$email .'</li>
                    <li>Message:' .$message .'</li>
                </ul>
                ';
                $headers = "MIME-Version: 1.0" ."\r\n";
                $headers .="Content-Type:text/html;charset=UTF-8" ."\r\n";

                $headers .= "From: WebSoar <noreply@websoar.co.uk>" ."\r\n";
                if(mail($toEmail, $subject, $body, $headers)){
                    header("Location: http://cryptoforge.riokarim.com/success.html");
                    die();
                }
                else {
                    header("Location: http://cryptoforge.riokarim.com/fail.html");
                    die();
                }
        }
    }
?>