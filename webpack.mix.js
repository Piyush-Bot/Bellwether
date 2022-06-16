let mix = require("laravel-mix");

mix.js("resources/v1/Auth/App.jsx", "public/v1/components/auth.js").react();
mix
  .js("resources/v1/Charging/App.jsx", "public/v1/components/charging.js")
  .react();
mix
  .js("resources/v1/Booking/App.jsx", "public/v1/components/booking.js")
  .react();
mix.js("resources/v1/Rbac/App.jsx", "public/v1/components/rbac.js").react();
mix
  .js(
    "resources/v1/Configuration/App.jsx",
    "public/v1/components/configuration.js"
  )
  .react();
mix.js("resources/v1/Orders/App.jsx", "public/v1/components/order.js").react();
// mix.js('resources/v1/Task/App.jsx', 'public/v1/components/task.js').react();
mix
  .js("resources/v1/Task-Management/App.jsx", "public/v1/components/task.js")
  .react();
mix
  .js("resources/v1/Reports/App.jsx", "public/v1/components/report.js")
  .react();
mix
  .js("resources/v1/Mis-Upload/App.jsx", "public/v1/components/misupload.js")
  .react();
mix
  .js(
    "resources/v1/Verification/App.jsx",
    "public/v1/components/verification.js"
  )
  .react();
mix
  .js(
    "resources/v1/Job-Application/App.jsx",
    "public/v1/components/jobapplication.js"
  )
  .react();
