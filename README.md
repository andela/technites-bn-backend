
[![Coverage Status](https://coveralls.io/repos/github/andela/technites-bn-backend/badge.svg?branch=develop)](https://coveralls.io/github/andela/technites-bn-backend?branch=develop)
[![Maintainability](https://api.codeclimate.com/v1/badges/a5fa230c63f46d23a649/maintainability)](https://codeclimate.com/github/andela/technites-bn-backend/maintainability)
[![Build Status](https://travis-ci.org/andela/technites-bn-backend.svg?branch=develop)](https://travis-ci.org/andela/technites-bn-backend)     [![Reviewed by Hound](https://img.shields.io/badge/Reviewed_by-Hound-8E64B0.svg)](https://houndci.com)

# Barefoot Nomad
> Making company travel and accommodation easy and convinient.

### Vision
Make company global travel and accommodation easy and convenient for the strong workforce of savvy members of staff, by leveraging the modern web.

---

## Pre-requisites
* Install [Node.js](https://nodejs.org/en/download/) if you dont have it installed.
* Install Postgresql to your system
* Install Redis database
## Environment Setup
1. git clone this repository && cd to the project directory
2. with postgres create a 2 databases : `one for test and another for development` 
3. run `npm install` to install dependencies
4. create a `.env` file in the root project directory
5. copy the `.env.example` to the `.env` file and update it accordingly
6. run `npm run migrate` && `npm run seed` to create the schemas and seed
7. run `npm run test` to test the application unit tests

## Testing specific endpoints:
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/e5aedfc69394a3b82064#?env%5Bdev-bare-foot%5D=W3sia2V5IjoidXJsIiwidmFsdWUiOiIxMjcuMC4wLjE6MzAwMC9hcGkvdjEvIiwiZW5hYmxlZCI6dHJ1ZX0seyJrZXkiOiJ0b2tlbiIsInZhbHVlIjpudWxsLCJlbmFibGVkIjp0cnVlfV0=) or view full documentation of the API can be found [here](https://technites-bn-backend-staging.herokuapp.com/api/v1/api-docs/)

Run the application with `npm run dev` and open an API testing tool. We will use Postman for this case.
```
http://localhost:3000/api/v1/<endpoint>
```
Authentication
------------- |

Method        | EndPoint      | Enable a user: |
------------- | ------------- | ---------------
POST  | /auth/signup  | Register to the barefoot  |
POST  | /auth/login  | Login to barefoot after email confirmation |
POST  | /auth/logout  | Logout from barefoot |

User
------------- |

Method        | EndPoint      | Enable a user: |
------------- | ------------- | ---------------
POST  | /auth/reset  | Request for password reset |
PATCH  | /users/editprofile  | Edit user profile|

Host
------------- |

Method        | EndPoint      | Enable a user: |
------------- | ------------- | ---------------
POST  | /host | Add a verified host (Super admin) |

Accommodation
------------- |
```json
    {
        accommodation_name: "myAccommodation",
        description: "This is my accommodation" ,
        location: "Kigali",
        images: "image upload",
    }
```

Method        | EndPoint      | Enable a user: |
------------- | ------------- | ---------------
POST  | /accommodations  | Add an accommodation (Travel Admins / Verified Host)|
GET  | /accommodations  | Get a list of all the accommodations|
GET  | /accommodations/:id  | Get a specific accommodation|
POST  | /accommodations/:id/rooms  | Add a room to a given accommodation (Travel admins/ Hosts)|
GET  | /accommodations/:id/rooms  | get a list of all rooms in the specific accommodation|
GET  | /accommodations/:id/rooms/:id  | get a specific room|
POST  | /accommodations/:id/like  | Like a specific accommodation|
PUT  | /accommodations/:id/unlike  | Unlike a specific accommodation|
POST  | /accommodations/:id/feedback  | Provide feedback to a specific accommodation|

Requests
------------- |
```json
    {
    request_type: "ReturnTrip",
    location_id: 1,
    departure_date: "2020-09-25",
    destinations: [
        { "destination_id": 2, "accomodation_id": 1, "room_id": 1, "check_in": "2020-09-25", "check_out": "2020-09-26"},
        { "destination_id": 3, "accomodation_id": 2, "room_id": 2, "check_in": "2020-09-27", "check_out": "2020-09-28"}
        ],
    reason: "Reason for the request",
    return_date: "2020-10-25"
    }
```

Method        | EndPoint      | Enable a user: |
------------- | ------------- | ---------------
POST  | /requests  | Make a trip request |
PATCH  | /request/:id  | Edit a trip request|
POST  | /request/:id/comment  | Comment on a request|
GET  | /requests/:id/approve  | Approve a trip request (Manager)|
GET  | /requests/:id/reject  | Reject a trip request (Manager)|
GET  | /requests?{query params} | Reject a trip request (Manager)|


---

## Licence

This software is published by `The Technites Dev Team` under the [MIT licence](http://opensource.org/licenses/MIT).

#### Contributors

[Paul Otieno -TTL](https://github.com/Paulstar200) || [Fred Mucyo](https://github.com/mucyomiller) || [Didas Mbalanya](https://github.com/didasmbalanya) || [Jordy Bastien](https://github.com/Jordybastien) || [Amily Kassim](https://github.com/amilykassim) || [Titus Thumbi](https://github.com/TgeeT)

