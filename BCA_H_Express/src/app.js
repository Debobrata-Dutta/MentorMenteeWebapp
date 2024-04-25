const express=require("express")
const session = require("express-session")
const app=express()
const port=3000
const multer = require('multer')
const path=require("path")
const views_path=path.join(__dirname,"../template/views")
const hbs=require("hbs")
const body_parser=require("body-parser")
require("./db/conn")
const signup=require("./models/register")
const registration=require("./models/registration")
app.use(body_parser.json())
app.use(body_parser.urlencoded({extended:false}))
app.use("/uploads",express.static(path.join(__dirname,"../uploads")))
app.use("/images",express.static(path.join(__dirname,"../template/public/assets/images")))
app.use("/css",express.static(path.join(__dirname,"../template/public/assets/css")))
app.use("/js",express.static(path.join(__dirname,"../template/public/assets/js")))
app.set("view engine","hbs")
app.set("views",views_path)
app.get("/index",(req,res)=>{
    res.render("index")
})
app.listen(port,()=>{
    console.log(`running in port:${port}`)
    console.log(`view_path`)
})
app.use(session({
    secret:"asus101",
    resave:false,
    saveUninitialized:false,
    cookie:{secure:false}
}))


app.post("/save",async(req,res)=>{
    const email = req.body.email;
    const adamasDomain = /^[a-zA-Z0-9._%+-]+@(?:stu\.)?adamasuniversity\.ac\.in$/;
    if(adamasDomain.test(email)){
    }
    else{
        res.send(`
            <script>
                alert("Please enter a valid Adamas University Student's email address ");
                window.history.back();
            </script>`);
    }
    try{
        const SignUp_info=new signup({
            username:req.body.username,
            email:req.body.email,
            password:req.body.password,
        })
        const data=await SignUp_info.save()
        res.render("registrationForm.hbs")
    }
    catch (err){
        console.log(err)
    }
})
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
        },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Express route to handle form data submission
app.post('/submit', upload.single('image'), async (req, res) => {
    // Extract all the necessary fields from the form data
    const email = req.body.email;
    const phoneNumber = req.body.phone;
    const fatherPhoneNumber = req.body.fatherPhone;
    const motherPhoneNumber = req.body.motherPhone;

    // Regular expression to validate Adamas University email domain
    const adamasDomain = /^[a-zA-Z0-9._%+-]+@stu\.adamasuniversity\.ac\.in$/;
    // Regular expression to validate Indian phone numbers
    const indianPhoneNumber = /^[6-9]\d{9}$/;
    // Function to check if the submitted email domain matches the Adamas University domain
    const isValidEmailDomain = (email) => adamasDomain.test(email);
    // Function to check if the submitted phone number is a valid Indian phone number
    const isValidPhoneNumber = (phoneNumber) => indianPhoneNumber.test(phoneNumber);
    // Check if all fields are valid
    if (isValidEmailDomain(email) && isValidPhoneNumber(phoneNumber) && isValidPhoneNumber(fatherPhoneNumber) && isValidPhoneNumber(motherPhoneNumber)) {
        // If all are valid, send a success response
    } else {
        // If any is invalid, render an HTML page with an alert box
        res.send(`
            <script>
            alert("Please enter a valid Adamas University email address and valid Indian phone numbers for all fields");
                window.history.back();
            </script>
        `);
    }
    try {
        const imagePath = req.file.path; // Uploaded image path
        const Registration_Form =new registration({
                firstName:req.body.firstName,
                lastName:req.body.lastName,
                rollNo:req.body.rollNo,
                course:req.body.course,
                gender:req.body.gender,
                dob:req.body.dob,
                batch:req.body.batch,
                section:req.body.section,
                email:req.body.email,
                phone:req.body.phone,
                address:req.body.address,
                image: req.file.filename, // Save only the filename in the database
                fatherName:req.body.fatherName,
                motherName:req.body.motherName,
                fatherOccupation:req.body.fatherOccupation,
                motherOccupation:req.body.motherOccupation,
                fatherEmail:req.body.fatherEmail,
                fatherPhone:req.body.fatherPhone,
                motherEmail:req.body.motherEmail,
                motherPhone:req.body.motherPhone,
                class10Percentage:req.body.class10Percentage,
                class12Percentage:req.body.class12Percentage,
                comments:req.body.comments
        });

        await Registration_Form.save();
        res.send('Form data submitted successfully!');
    } catch (error) {
        console.log(error);
            res.send('Internal Server Error');
        }

})

// Handle user login
app.post('/login', async (req, res) => {
    const { email, password, username } = req.body;

    try {
        // Assume username and password validation here...
        // Set session variable upon successful login
        // Check if username and password match an admin account
        const adminUser = await signup.findOne({ username, password, type: "admin" });
        if (adminUser) {
            // Redirect to admin page if the user is an admin
            const regis = await registration.find();
            req.session.user = { username: username, email: email };
            return res.render("Admin.hbs", { regis });
        }

        // If not an admin, check if it's a student account
        const studentUser = await signup.findOne({ username, email, password, type: "student" });
        req.session.user = { username: username, email: email };
        if (!studentUser) {
            return res.send(`
            <script>
                alert("Invalid Username, Password, or Email");
                window.history.back();
            </script>`);
        }

        // If username and password match, get the registration data
        const registrationData = await registration.findOne({ email: email });
        if (!registrationData) {
            return res.send(`
            <script>
                alert("No registration data found for this user");
                window.history.back();
            </script>`);
        }

        // Render user data page
        res.render("userData.hbs", { registrationData });

    } catch (error) {
        console.error('Error:', error);
        res.send('Internal Server Error');
    }
});

function sessionval(req,res,next){
    if (req.session.user){
        next();
    }
    else{
        res.send("UNAUTHORISED ACCESS !");
    }
}


app.get("/myprofile", sessionval, async (req, res) => {
    try {
        // Get the username and password from the session
        const { username, email } = req.session.user;

        // Find the user's credentials based on the username and email
        const credentials = await signup.findOne({ username, email });

        // Render the profile template with the user's credentials
        res.render("userCredentials.hbs", { credentials });
    } catch (error) {
        console.error("Error:", error);
        res.send("Internal Server Error");
    }
});

app.post("/update2", async (req, res) => {
    try {
        // Extract data from the request body
        const { username, email, password } = req.body;

        // Assuming you have a function to update user data in your database
        // Example: Update the user's profile based on their username
        await signup.findOneAndUpdate(
            { email: email }, // Find user by email
            { username: username, password: password }, // Update fields
            { new: true } // Return the updated document
        );

        // Redirect or send a response indicating success
        res.send("Profile updated successfully!");
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).send("Error updating profile");
    }
});
app.get('/logout', (req, res) => {
    // Destroy the session variable
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.send('Internal Server Error');
        } else {
            // Redirect to a different page after logout
            res.send("logged out") // Redirect to your login page or any other page
        }
    });
});

app.post("/update", async (req, res) => {
    const id = req.body.id;
    const updates = {
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        rollNo:req.body.rollNo,
        course:req.body.course,
        gender:req.body.gender,
        dob:req.body.dob,
        batch:req.body.batch,
        section:req.body.section,
        email:req.body.email,
        phone:req.body.phone,
        address:req.body.address,
        fatherName:req.body.fatherName,
        motherName:req.body.motherName,
        fatherOccupation:req.body.fatherOccupation,
        motherOccupation:req.body.motherOccupation,
        fatherEmail:req.body.fatherEmail,
        fatherPhone:req.body.fatherPhone,
        motherEmail:req.body.motherEmail,
        motherPhone:req.body.motherPhone,
        class10Percentage:req.body.class10Percentage,
        class12Percentage:req.body.class12Percentage,
        date:req.body.date,
        comments: req.body.comments
    };

    // console.log(updates);
    // console.log(req.body.id);
    const regis = await registration.updateOne({_id: id}, {$set: updates});
    return res.send(`
            <script>
                alert("Data Updated Successfully");
                window.history.back();
            </script>`);
});
app.post("/delete", async (req, res) => {
    const id = req.body.id;

    try {
        const deletedRegistration = await registration.deleteOne({_id: id});
        if (deletedRegistration.deletedCount === 1) {
            return res.send(`
                <script>
                    alert("Data Deleted Successfully");
                    window.history.back();
                </script>`);
        } else {
            return res.send(`
                <script>
                    alert("Document not found");
                    window.history.back();
                </script>`);
        }
    } catch (error) {
        console.error("Error deleting document:", error);
        return res.send(`
            <script>
                alert("An error occurred while deleting data");
                window.history.back();
            </script>`);
    }
});


