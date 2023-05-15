/*

Direct link to files used : https://mailchimp.com/developer/marketing/api/lists/batch-subscribe-or-unsubscribe/


  Things are used in mailchimp:
  ---------------------------------------------------------
  1.  Install the client library for your language
        ~~  npm install @mailchimp/mailchimp_marketing
  2.  Make your first API call
      const mailchimp = require("@mailchimp/mailchimp_marketing");

      mailchimp.setConfig({
      apiKey: "YOUR_API_KEY",
      server: "YOUR_SERVER_PREFIX",
      });

      async function run() {
        const response = await mailchimp.ping.get();
        console.log(response);
      }

      run();
   3. Batch subscribe or unsubscribe
      POST/lists/{list_id}

      Path Parameters:
      a.  list_id (REQUIRED)  type: string

      Query Parameters:
      -- Not used here

      Body Parameters:
      a. members (REQUIRED)   type: object[]
        --------------------------------------
        description: An array of objects, each representing an email address and
                    the subscription status for a specific list. Up to 500 members
                    may be added or updated with each API call.
        properties:
                  email_address
                  email_type
                  status
                  merge_fields  type: object
                  interests
                  ... etc

        code:
            const client = require("@mailchimp/mailchimp_marketing");

            client.setConfig({
            apiKey: "YOUR_API_KEY",
            server: "YOUR_SERVER_PREFIX",
            });

            const run = async () => {
            const response = await client.lists.batchListMembers("list_id", {
              members: [{}],
            });
            console.log(response);
            };

            run();

*/

// Note: Use a Procfile, a text file in the root directory of your application, to explicitly declare what command should be executed to start your app.


const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

//mailchimp_marketing
const client = require("@mailchimp/mailchimp_marketing");

client.setConfig({
  apiKey: "b90290425d212f99f533436d4f8063b5-us18",
  server: "us18",
});

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public")); //Use the static files

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html")
})

app.post("/", function(req, res) {

  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email
  }

  const list_id = "373f8fca16"

  const run = async () => {
    const response = await client.lists.batchListMembers(list_id, {
      members: [{
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName
        }
      }]
    }).then((responses) => {
      if (responses.new_members.id !== "") {
        res.sendFile(__dirname + "/success.html");
      }
      // console.log(responses);
    }).catch((err) => {
      res.sendFile(__dirname + "/failure.html");
      console.log(err);
    })


    // console.log(response);
  };

  run();

  /* console.log(responses)
  {
    new_members: [
      {
        id: '7721a9b02756c969bc74441f35bc6395',
        email_address: 'dvsdv@lms.com',
        unique_email_id: 'd525571c91',
        email_type: 'html',
        status: 'subscribed',
        merge_fields: [Object],
        stats: [Object],
        ip_signup: '',
        timestamp_signup: '',
        ip_opt: '49.37.117.176',
        timestamp_opt: '2023-05-14T14:52:26+00:00',
        member_rating: 2,
        last_changed: '2023-05-14T14:52:26+00:00',
        language: '',
        vip: false,
        email_client: '',
        location: [Object],
        tags_count: 0,
        tags: [],
        list_id: '373f8fca16',
        _links: [Array]
      }
    ],
    updated_members: [],
    errors: [],
    total_created: 1,
    total_updated: 0,
    error_count: 0,
  }
    */

})

app.post("/failure",(req,res)=>{
  res.redirect("/")
})

//Api Key
// b90290425d212f99f533436d4f8063b5-us18

// List id
// 373f8fca16

//In this case, the server will listen on port 3000 if the PORT environment variable isn’t set.
app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000");
})



// Alternate code : (not tested)

/*
Here is my code if you need it, I check first if the person is subscribed already, if not, then subscribe, if there is a error, error message. I found how I found redirect with parameters in stackoverflow, so I am passing text messages as parameters:

const express = require('express');
const bodyParser = require('body-parser');
const mailchimp = require('@mailchimp/mailchimp_marketing');
const md5 = require('md5');
const url = require('url');

app.post('/newsletter', function(req, res){
  const email = req.body.email;
  const fname = req.body.fname;
  const lname = req.body.lname;
  const subscribingUser = {
    firstName: fname,
    lastName: lname,
    email: email
  }

  const subscriberHash = md5(subscribingUser.email.toLowerCase());

  mailchimp.setConfig({
    apiKey: API key,
    server: 'us17'
  })
  const listId = List ID;

  async function run() {

    try{
      await mailchimp.lists.getListMember(
        listId,
        subscriberHash
      );
      res.redirect(url.format({
        pathname: '/newsletter-result',
        query: {
          result: 'Uh Oh',
          resultText: 'You are already subscribed and getting awesome content!'
        }
      }));
    }
    catch(e){
      try{
        const response = await mailchimp.lists.addListMember(listId, {
          email_address: subscribingUser.email,
          status: 'subscribed',
          merge_fields: {
            FNAME: subscribingUser.firstName,
            LNAME: subscribingUser.lastName
          }
        });
        res.redirect(url.format({
          pathname: '/newsletter-result',
          query: {
            result: 'Awesome',
            resultText: 'Look for awesome content'
          }
        }));
      }
      catch(e){
        res.redirect(url.format({
          pathname: '/newsletter-result',
          query: {
            result: 'Uh Oh',
            resultText: 'There was a problem, please try again!'
          }
        }));
      }
    }


  }
  run();
})

app.get('/newsletter-result', function(req, res){
  res.render('newsletter-result', {code:sourceCodes[5], style: 'css/newsletter-result.css',
              result: req.query.result, resultText: req.query.resultText});
})
*/
