export default (token) => `<body style="font-family: sans-serif;">

    <div style="
    margin: auto;
    background-color: rgb(245, 245, 245);
    width: 650px;
    height: 400px;
    text-align: center;
    box-shadow: 0px 5px 15px 0px rgb(153, 153, 153, 0.5);
    border-radius: 8px;">
  
    <h4 style="color: rgb(93, 93, 93); font-size: 28px; padding-top: 40px;">Welcome to barefoot nomad</h4>
    <p style="color: rgb(93, 93, 93); font-size: 17px;">Please confirm your account by clicking the button below</p>
    
    <a style="background-color: #FD297B; /* Green */
            outline: none;
            border-radius: 360px;
            color: white;
            margin-top: 10px;
            padding: 15px 32px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;" href='http://localhost:3000/api/v1/auth/login/${token}'>confirm email</a>
    <p style="color: rgb(93, 93, 93); font-size: 17px; margin-top: 50px;">Once confirmed, you'll be able to log in to Barefoot Nomad with your new account.</p>
    <p style="text-align: left; margin-left: 16px; margin-top: 20px; color: rgb(93, 93, 93);">Best wishes,</p>
  </div>
  </body>`;
