const mailchimp = require("@mailchimp/mailchimp_marketing");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded()); //Parse URL-encoded bodies
app.use(express.static("public")); //to use static files like CSS
app.listen(process.env.PORT || 3000, function () {
 console.log("Server is running");
});
//Sending the signup.html file to the browser as soon as a request is made on localhost:3000
app.get("/", function (req, res) {
 res.sendFile(__dirname + "/signup.html");
});
//Setting up MailChimp
mailchimp.setConfig({
 apiKey: "8f0c8af658821493dce84792c0a3acfe-us5",
 server: "us5"
});
// Now after a POST request is made
app.post('/', function(req, res) {
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let email = req.body.email;

  const listId = "ae9c363d47";
  // Creating an object with users data
  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email
  };

  const run = async () => {
    const response = await mailchimp.lists.batchListMembers(listId, {
      members: [
        {
          email_address: subscribingUser.email,
          status: "subscribed",
          merge_fields: {
            FNAME: subscribingUser.firstName,
            LNAME: subscribingUser.lastName
          }
        }
      ],
    });
      res.sendFile(__dirname + "/success.html");
      console.log(`Successfully added contact as an audience member. The contact's id is ${response.id}`);
  };
  run().catch(e => res.sendFile(__dirname + "/failure.html"));
})
// 8f0c8af658821493dce84792c0a3acfe-us5
// list id
// ae9c363d47
