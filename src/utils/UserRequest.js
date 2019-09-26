export default (user, request, origin, destination, stopCities) => {
  let returnDate = null;

  if (request.request_type === 'OneWay') returnDate = 'Not specified';
  else returnDate = request.return_date;

  if (stopCities.length < 2) stopCities = 'Not specified';

  return `<body style="font-family: sans-serif;">
       <div style="
       margin: auto;
       background-color: rgb(245, 245, 245);
       width: 650px;
       height: 400px;
       text-align: center;
       box-shadow: 0px 5px 15px 0px rgb(153, 153, 153, 0.5);
       border-radius: 8px;">
  
       <h4 style="color: rgb(93, 93, 93); font-size: 28px; padding-top: 40px;">Request trip confirmation</h4>
          <p style="text-align: left; margin-left: 30px; margin-top: 20px; color: rgb(93, 93, 93);"> Dear ${user.firstname} your trip request from ${origin} to ${destination} was succesfully received, Kindly wait back for a response from your line manager</p>
          <p style="text-align: left; margin-left: 30px; margin-top: 20px; color: rgb(93, 93, 93);">Reason: ${request.reason}</p>
          <p style="text-align: left; margin-left: 30px; margin-top: 20px; color: rgb(93, 93, 93);">Stop cities: ${stopCities},</p>
          <p style="text-align: left; margin-left: 30px; margin-top: 20px; color: rgb(93, 93, 93);">Departure date: ${request.departure_date},</p>
          <p style="text-align: left; margin-left: 30px; margin-top: 20px; line-height: 0; color: rgb(93, 93, 93);">Return date date: ${returnDate}</p>
     
     </div>
     </body>`;
};
