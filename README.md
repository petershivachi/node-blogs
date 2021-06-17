 # Backend Assessment
 ## Description
 Backend API with CRUD functionality to create, retrieve and update blogs. 
 
 It allow users to create an account, users with accounts are then authenticated with jsonwebtokens.
 
 There is a moddleware to guard protected routes, this are routes that can be accessed by authenticated users only.
 
 ## Functionality
 - Register users - Endpoint to register user with username, email and password, all the fields are required
 - Create blogs - Only authenticared users can create a blog post
 - Login users - Users with existing account can be authentocated with email and password.
 - View blogs - Both authenticated and unauthenticated users can view blogs.
 - View individuals blogs - Users can view a single blog 
 - Delete a blog -  Only authenticated users can delete there own blog posts

## Setup Project On Your Machine
### Specifications and Environments
- NodeJS Environment
- You need MongoDB Atlas

### Steps To Get Project Running
- Clone project repository into your own machine

      git clone https://github.com/petershivachi/node-blogs.git
      
- Navigate into the backend-assement folder

      cd backend-assessment
      
- Install node package depedencies
 
      npm install 
      
- Run development server

      npm run server
