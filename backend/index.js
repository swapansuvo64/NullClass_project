const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const stripe = require('stripe')('sk_test_51PhoK1Rq3EYac15I1EoPVydd1rm3zpDgIEal5B1aiB0NQG9s8flb7GGSwx41tpxd5ZkpjEAgp0qftxyYuyVcJve100UMWMXCA1');
const randomstring = require('randomstring');
const PDFDocument = require('pdfkit');
const stream = require('stream');

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

const uri = "mongodb+srv://Roni:3JT0brptvrBKtIQW@cluster0.kardea6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const otpCache = {};

function generateOTP() {
  return randomstring.generate({ length: 6, charset: 'numeric' });
}

function sendOTP(email, otp) {
  const mailOptions = {
    from: 'suvadeepprojects@gmail.com',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`
  };

  let transporter = nodemailer.createTransport({
    secure: true,
    service: 'Gmail',
    auth: {
      user: 'suvadeepprojects@gmail.com',
      pass: 'otih prsy iqmy cepp'
    },
    tls: { rejectUnauthorized: false }
  });

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error occurred:', error);
    } else {
      console.log('OTP sent successfully:', info.response);
    }
  });
}

function sendEmailWithAttachment(email, pdfBuffer) {
  const mailOptions = {
    from: 'suvadeepprojects@gmail.com',
    to: email,
    subject: 'Invoice',
    text: 'Please find your invoice attached.',
    attachments: [
      {
        filename: 'invoice.pdf',
        content: pdfBuffer,
        encoding: 'base64'
      }
    ]
  };

  let transporter = nodemailer.createTransport({
    secure: true,
    service: 'Gmail',
    auth: {
      user: 'suvadeepprojects@gmail.com',
      pass: 'otih prsy iqmy cepp'
    },
    tls: { rejectUnauthorized: false }
  });

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error occurred:', error);
    } else {
      console.log('Invoice sent successfully:', info.response);
    }
  });
}

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");

    const postCollection = client.db('database').collection('post');
    const userCollection = client.db('database').collection('users');
    const postStatsCollection = client.db('database').collection('postStats');

    app.get('/post', async (req, res) => {
      try {
        const userId = req.query.userId;
        const posts = await postCollection.find({ userId }).toArray();
        res.json(posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Failed to fetch posts" });
      }
    });

    app.get('/all-posts', async (req, res) => {
      try {
        const posts = await postCollection.find().toArray();
        console.log('Fetched posts:', posts);

        const enrichedPosts = await Promise.all(posts.map(async (post) => {
          try {
            const user = await userCollection.findOne({ uid: post.userId });
            console.log('Fetched user for post', post._id, ':', user);

            return {
              ...post,
              userPhotoURL: user ? user.photoURL : 'default-avatar.png',
              userName: user ? user.name : 'Unknown User',
              userHandle: user ? user.username : 'unknown',
            };
          } catch (userError) {
            console.error('Error fetching user data for post', post._id, ':', userError);
            return {
              ...post,
              userPhotoURL: 'default-avatar.png',
              userName: 'Unknown User',
              userHandle: 'unknown',
            };
          }
        }));

        res.json(enrichedPosts);
      } catch (error) {
        console.error('Error fetching all posts:', error);
        res.status(500).send('Error fetching posts');
      }
    });

    app.get('/user', async (req, res) => {
      try {
        const { uid } = req.query;
        if (!uid) {
          return res.status(400).json({ message: "UID is required" });
        }
    
        const user = await userCollection.findOne({ uid: uid });
    
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
    
        res.send(user);
      } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Failed to fetch user" });
      }
    });

    app.post('/create-payment-intent', async (req, res) => {
      try {
        const { amount } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount,
          currency: 'INR',
        });

        res.send({
          clientSecret: paymentIntent.client_secret,
        });
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    app.post('/post', async (req, res) => {
      try {
        const { content, selectedImages, location, user } = req.body;
    
        if (!user || !user.uid) {
          return res.status(400).json({ message: "User ID is required" });
        }
    
        const userId = user.uid;
        const userPostStats = await postStatsCollection.findOne({ userId });
    
        if (!userPostStats) {
          // Initialize post count for user if not present
          await postStatsCollection.insertOne({ userId, count: 1 });
        } else {
          const userPremiumStatus = await userCollection.findOne({ uid: userId });
          const maxPostsPerDay = userPremiumStatus.premium === 55000 ? 10 :
                                  userPremiumStatus.premium === 85000 || userPremiumStatus.premium === 16000 ? Infinity : 5;
    
          if (userPostStats.count >= maxPostsPerDay) {
            return res.status(403).json({ message: 'Post limit reached for today' });
          }
    
          // Update post count for user
          await postStatsCollection.updateOne(
            { userId },
            { $inc: { count: 1 } }
          );
        }
    
        const post = {
          content,
          images: selectedImages,
          location,
          userId,
          createdAt: new Date(),
        };
    
        const result = await postCollection.insertOne(post);
        res.status(201).json({ _id: result.insertedId, ...post });
      } catch (error) {
        console.error("Error inserting post:", error);
        res.status(500).json({ message: "Failed to insert post" });
      }
    });
    
    
    app.post('/register', async (req, res) => {
      try {
          const user = req.body;
          console.log("Received user data:", user);
  
          if (!user.username || !user.name || !user.email) {
              return res.status(400).json({ message: "Missing required user data" });
          }
  
          const existingUser = await userCollection.findOne({ email: user.email });
          if (existingUser) {
              return res.status(200).json(existingUser);
          }
  
          const result = await userCollection.insertOne(user);
          res.status(201).json({ _id: result.insertedId, ...user });
      } catch (error) {
          console.error("Error registering user:", error);
          res.status(500).json({ message: "Failed to register user" });
      }
  });
  

    app.post('/reqOTP', (req, res) => {
      const { email } = req.body;
      const otp = generateOTP();
      otpCache[email] = otp;

      console.log(otpCache);
      sendOTP(email, otp);
      res.status(200).json({ message: 'OTP sent' });
    });

    app.post('/verifyOTP', (req, res) => {
      const { email, otp } = req.body;

      if (!otpCache[email]) {
        return res.status(400).json({ message: 'Email not found' });
      }

      if (otpCache[email] === otp.trim()) {
        delete otpCache[email];
        console.log("OTP verified");
        return res.status(200).json({ message: 'OTP verified' });
      } else {
        console.log("Invalid OTP");
        return res.status(400).json({ message: 'Invalid OTP' });
      }
    });

    app.post('/send-invoice', async (req, res) => {
      try {
        const { email, name, amount } = req.body;

        const doc = new PDFDocument();
        const pdfStream = new stream.PassThrough();
        doc.pipe(pdfStream);

        doc.fontSize(25).text('Invoice', { align: 'center' });
        doc.moveDown();
        doc.fontSize(18).text(`Name: ${name}`);
        doc.text(`Amount: ₹${(amount / 100).toFixed(2)}`);
        doc.end();

        const pdfBuffer = [];
        pdfStream.on('data', (chunk) => pdfBuffer.push(chunk));
        pdfStream.on('end', () => {
          const buffer = Buffer.concat(pdfBuffer);
          sendEmailWithAttachment(email, buffer.toString('base64'));
        });

        res.status(200).json({ message: 'Invoice processing' });

      } catch (error) {
        console.error('Error sending invoice:', error);
        res.status(500).json({ message: 'Failed to send invoice' });
      }
    });

    app.post('/update-premium', async (req, res) => {
      try {
        const { email, amount } = req.body;
        console.log(`Received email: ${email}, amount: ${amount}`);

        let premiumLevel = 'none';
        if (amount === 5500) {
          premiumLevel = 'basic';
        } else if (amount === 8500) {
          premiumLevel = 'premium';
        } else if (amount === 16000) {
          premiumLevel = 'premium+';
        }

        console.log(`Setting premium level to: ${premiumLevel}`);

        const result = await userCollection.updateOne(
          { email: email },
          { $set: { premium: amount} }
        );

        if (result.matchedCount > 0) {
          console.log('Premium status updated successfully');
          res.status(200).json({ message: 'Premium status updated successfully' });
        } else {
          console.log('User not found');
          res.status(404).json({ message: 'User not found' });
        }
      } catch (error) {
        console.error('Error updating premium status:', error);
        res.status(500).json({ message: 'Failed to update premium status' });
      }
    });

    app.get('/post-stats', async (req, res) => {
      try {
        const stats = await postStatsCollection.find().toArray();
        res.json(stats);
      } catch (error) {
        console.error("Error fetching post stats:", error);
        res.status(500).json({ message: "Failed to fetch post stats" });
      }
    });

    app.get('/', (req, res) => {
      res.send('Hello World!');
    });

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

run().catch(console.error);
