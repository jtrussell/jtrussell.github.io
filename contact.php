<?php

header('Content-Type: application/json');

function respond($success, $msg) {
  echo json_encode([
    'success' => $success,
    'message' => $msg
  ]);
  exit;
}

function doingItWrong() {
  // Also check for robotness
  return 'GET' === $_SERVER['REQUEST_METHOD'];
}

if(doingItWrong()) {
  respond(false, 'o.O');
} else {
  $message = $_POST['message'];
  $name = $_POST['name'];
  $email = $_POST['email'];
  $subject = $_POST['subject'];
  $message = $_POST['message'];

  $err = strlen($name) === 0
    || strlen($email) === 0
    || strlen($subject) === 0
    || strlen($message) === 0;

  if(!$err) {
    // Send the meail
    $mail_to = '"justin" <justin@jrussell.me>';
    $header = 'From: "Contact Form" <webmaster@jrussell.me>\r\n';
    if(mail($mail_to, "Online Contact Form: " . $subject, $message . "\n\nFrom: " . $email, $header)) {
      respond(true, 'Thanks!');
    } else {
      respond(false, 'Something went wrong... one more try?');
    }
  } else {
    // There was an error proceed as normal but mark the offending elements
    respond(false, 'All the fields is required.');
  }
}
