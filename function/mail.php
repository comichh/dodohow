<?php
/*
$mail="收信信箱";
$mail_title="主旨";
$mail_name="寄件者姓名";
$reply_mail="回信信箱";
$content="內文";
*/

$headers = "Content-type: text/html; charset=utf-8\r\n";
$headers.= "From: ".$mail_name."<".$reply_mail.">\r\n". "reply: ".$mail_name."<".$reply_mail.">\r\n";
$message = " $content ";
mail($mail, $mail_title,$message, $headers );

?>